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

/** The finalized recording, returned only after MediaRecorder.onstop has fired. */
export interface CompletedRecording {
  audio: Blob | null;
  durationSeconds: number;
}

const BAR_COUNT = 28;

/**
 * Real browser microphone capture (MediaRecorder + WebAudio level metering).
 * Transcription is a separate concern handled by the SpeechService.
 *
 * Contract: `const { audio } = await capture.stop()` resolves with the completed
 * Blob only after MediaRecorder has flushed its final chunk and `onstop` fired.
 * Callers must never read `capture.audio` immediately after stopping.
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
  /** Seconds tracked in a ref so stop() can resolve without stale React state. */
  const secondsRef = useRef(0);
  const stopResolverRef = useRef<((result: CompletedRecording) => void) | null>(null);

  const stopMetering = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    void audioContextRef.current?.close().catch(() => undefined);
    audioContextRef.current = null;
    analyserRef.current = null;
  }, []);

  const cleanup = useCallback(() => {
    stopMetering();
    const recorder = recorderRef.current;
    recorderRef.current = null;
    if (recorder && recorder.state !== "inactive") {
      recorder.onstop = null;
      recorder.stop();
    }
    stopResolverRef.current?.({ audio: null, durationSeconds: secondsRef.current });
    stopResolverRef.current = null;
  }, [stopMetering]);

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
      secondsRef.current = 0;

      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob =
          chunksRef.current.length > 0
            ? new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" })
            : null;
        const durationSeconds = secondsRef.current;
        setState((prev) => ({ ...prev, status: "captured", audio: blob, seconds: durationSeconds }));
        stopResolverRef.current?.({ audio: blob, durationSeconds });
        stopResolverRef.current = null;
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
        if (recorderRef.current?.state !== "recording") return;
        secondsRef.current += 1;
        setState((prev) => ({ ...prev, seconds: secondsRef.current }));
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

  /** Stops recording and resolves with the finalized Blob after onstop fires. */
  const stop = useCallback((): Promise<CompletedRecording> => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") {
      stopMetering();
      setState((prev) => ({ ...prev, status: "captured" }));
      return Promise.resolve({ audio: null, durationSeconds: secondsRef.current });
    }
    const completed = new Promise<CompletedRecording>((resolve) => {
      stopResolverRef.current = resolve;
    });
    recorder.stop(); // onstop resolves the promise with the final Blob
    recorderRef.current = null;
    stopMetering();
    return completed;
  }, [stopMetering]);

  const reset = useCallback(() => {
    cleanup();
    secondsRef.current = 0;
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
