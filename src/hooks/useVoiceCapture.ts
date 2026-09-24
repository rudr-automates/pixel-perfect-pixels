import { useCallback, useEffect, useRef, useState } from "react";

export type VoiceCaptureStatus =
  | "idle"
  | "requesting"
  | "recording"
  | "paused"
  | "captured"
  | "unavailable";

export interface VoiceCaptureState {
  status: VoiceCaptureStatus;
  seconds: number;
  /** Normalized 0..1 amplitude samples for the waveform. */
  levels: number[];
  audio: Blob | null;
  error: string | null;
}

const BAR_COUNT = 28;

/**
 * Real browser microphone capture (MediaRecorder + WebAudio level metering).
 * Transcription is a separate concern handled by the SpeechService.
 */
export function useVoiceCapture() {
  const [state, setState] = useState<VoiceCaptureState>({
    status: "idle",
    seconds: 0,
    levels: Array<number>(BAR_COUNT).fill(0.06),
    audio: null,
    error: null,
  });

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    void audioContextRef.current?.close().catch(() => undefined);
    audioContextRef.current = null;
    analyserRef.current = null;
    recorderRef.current = null;
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const meter = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const buffer = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(buffer);
    let sum = 0;
    for (const value of buffer) {
      const centered = (value - 128) / 128;
      sum += centered * centered;
    }
    const rms = Math.sqrt(sum / buffer.length);
    const level = Math.min(1, Math.max(0.06, rms * 3.2));
    setState((prev) => ({ ...prev, levels: [...prev.levels.slice(1), level] }));
    rafRef.current = requestAnimationFrame(meter);
  }, []);

  const start = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setState((prev) => ({
        ...prev,
        status: "unavailable",
        error: "Microphone unavailable in this browser.",
      }));
      return;
    }

    setState((prev) => ({ ...prev, status: "requesting", error: null }));

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        setState((prev) => ({ ...prev, status: "captured", audio: blob }));
      };
      recorder.start();
      recorderRef.current = recorder;

      const AudioCtx =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const context = new AudioCtx();
        const source = context.createMediaStreamSource(stream);
        const analyser = context.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        audioContextRef.current = context;
        analyserRef.current = analyser;
        rafRef.current = requestAnimationFrame(meter);
      }

      timerRef.current = setInterval(() => {
        setState((prev) =>
          prev.status === "recording" ? { ...prev, seconds: prev.seconds + 1 } : prev,
        );
      }, 1000);

      setState((prev) => ({
        ...prev,
        status: "recording",
        seconds: 0,
        audio: null,
        error: null,
      }));
    } catch {
      cleanup();
      setState((prev) => ({
        ...prev,
        status: "unavailable",
        error: "Microphone access was denied or is unavailable.",
      }));
    }
  }, [cleanup, meter]);

  const pause = useCallback(() => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.pause();
      setState((prev) => ({ ...prev, status: "paused" }));
    }
  }, []);

  const resume = useCallback(() => {
    if (recorderRef.current?.state === "paused") {
      recorderRef.current.resume();
      setState((prev) => ({ ...prev, status: "recording" }));
    }
  }, []);

  const stop = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    } else {
      setState((prev) => ({ ...prev, status: "captured" }));
    }
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  const reset = useCallback(() => {
    cleanup();
    setState({
      status: "idle",
      seconds: 0,
      levels: Array<number>(BAR_COUNT).fill(0.06),
      audio: null,
      error: null,
    });
  }, [cleanup]);

  return { ...state, start, stop, pause, resume, reset };
}
