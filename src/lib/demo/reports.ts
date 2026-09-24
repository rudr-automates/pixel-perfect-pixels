import type { CommunityReport, OutcomeValue } from "../domain/types";

interface ReportSeed {
  recordId: string;
  positive: number;
  neutral: number;
  negative: number;
  locations: string[];
  reporters: string[];
  startedAt: string;
}

/**
 * Community reports are generated deterministically from these seeds so that
 * every count shown in the UI is derived from real underlying report rows,
 * not from a hard-coded summary number.
 */
const seeds: ReportSeed[] = [
  {
    recordId: "k-01",
    positive: 24,
    neutral: 4,
    negative: 3,
    locations: ["Tikamgarh", "Jhansi", "Chhatarpur", "Lalitpur", "Sagar", "Datia", "Banda"],
    reporters: ["c-01", "c-02", "c-07", "c-11", "c-12"],
    startedAt: "2026-03-13T06:00:00.000Z",
  },
  {
    recordId: "k-02",
    positive: 9,
    neutral: 3,
    negative: 2,
    locations: ["Jhansi", "Tikamgarh", "Datia"],
    reporters: ["c-02", "c-01", "c-10"],
    startedAt: "2026-03-15T06:00:00.000Z",
  },
  {
    recordId: "k-03",
    positive: 7,
    neutral: 2,
    negative: 1,
    locations: ["Yavatmal", "Akola"],
    reporters: ["c-03", "c-12", "c-09"],
    startedAt: "2026-03-17T06:00:00.000Z",
  },
  {
    recordId: "k-04",
    positive: 14,
    neutral: 3,
    negative: 1,
    locations: ["Madhubani", "Darbhanga", "Samastipur", "Sitamarhi"],
    reporters: ["c-10", "c-11", "c-14", "c-02", "c-06"],
    startedAt: "2026-03-04T06:00:00.000Z",
  },
  {
    recordId: "k-05",
    positive: 16,
    neutral: 2,
    negative: 2,
    locations: ["Dhamtari", "Raipur", "Durg", "Bemetara"],
    reporters: ["c-14", "c-11", "c-10", "c-09", "c-06"],
    startedAt: "2026-03-01T06:00:00.000Z",
  },
  {
    recordId: "k-06",
    positive: 11,
    neutral: 4,
    negative: 3,
    locations: ["Dhamtari", "Raipur", "Warangal"],
    reporters: ["c-14", "c-04", "c-09", "c-11"],
    startedAt: "2026-03-02T06:00:00.000Z",
  },
  {
    recordId: "k-07",
    positive: 8,
    neutral: 2,
    negative: 1,
    locations: ["Bathinda", "Mansa", "Barnala"],
    reporters: ["c-05", "c-13", "c-09"],
    startedAt: "2026-02-22T06:00:00.000Z",
  },
  {
    recordId: "k-08",
    positive: 12,
    neutral: 3,
    negative: 2,
    locations: ["Tikamgarh", "Jhansi", "Bathinda", "Beed"],
    reporters: ["c-01", "c-05", "c-09", "c-02", "c-12"],
    startedAt: "2026-02-24T06:00:00.000Z",
  },
  {
    recordId: "k-09",
    positive: 10,
    neutral: 2,
    negative: 1,
    locations: ["Chhatarpur", "Tikamgarh", "Gumla"],
    reporters: ["c-07", "c-01", "c-11"],
    startedAt: "2026-02-27T06:00:00.000Z",
  },
  {
    recordId: "k-10",
    positive: 9,
    neutral: 3,
    negative: 2,
    locations: ["Chhatarpur", "Beed", "Akola"],
    reporters: ["c-07", "c-09", "c-12"],
    startedAt: "2026-03-06T06:00:00.000Z",
  },
  {
    recordId: "k-11",
    positive: 13,
    neutral: 2,
    negative: 1,
    locations: ["Madhubani", "Darbhanga", "Gumla", "Dhamtari"],
    reporters: ["c-10", "c-11", "c-14", "c-06", "c-02"],
    startedAt: "2026-03-08T06:00:00.000Z",
  },
  {
    recordId: "k-12",
    positive: 6,
    neutral: 2,
    negative: 1,
    locations: ["Dhamtari", "Raipur"],
    reporters: ["c-14", "c-11", "c-10"],
    startedAt: "2026-03-09T06:00:00.000Z",
  },
  {
    recordId: "k-13",
    positive: 12,
    neutral: 3,
    negative: 2,
    locations: ["Akola", "Yavatmal", "Beed", "Junagadh"],
    reporters: ["c-12", "c-03", "c-09", "c-13", "c-04"],
    startedAt: "2026-03-11T06:00:00.000Z",
  },
  {
    recordId: "k-14",
    positive: 8,
    neutral: 2,
    negative: 2,
    locations: ["Jhansi", "Tikamgarh", "Gumla"],
    reporters: ["c-02", "c-01", "c-11"],
    startedAt: "2026-03-12T06:00:00.000Z",
  },
  {
    recordId: "k-15",
    positive: 7,
    neutral: 3,
    negative: 2,
    locations: ["Junagadh", "Rajkot"],
    reporters: ["c-13", "c-04", "c-09"],
    startedAt: "2026-03-13T06:00:00.000Z",
  },
  {
    recordId: "k-16",
    positive: 10,
    neutral: 2,
    negative: 1,
    locations: ["Warangal", "Karimnagar", "Nizamabad"],
    reporters: ["c-04", "c-08", "c-13"],
    startedAt: "2026-02-28T06:00:00.000Z",
  },
  {
    recordId: "k-17",
    positive: 9,
    neutral: 4,
    negative: 2,
    locations: ["Warangal", "Nalgonda", "Beed"],
    reporters: ["c-04", "c-09", "c-12"],
    startedAt: "2026-02-25T06:00:00.000Z",
  },
  {
    recordId: "k-18",
    positive: 11,
    neutral: 2,
    negative: 1,
    locations: ["Wayanad", "Kozhikode", "Kannur"],
    reporters: ["c-08", "c-04", "c-06"],
    startedAt: "2026-03-15T06:00:00.000Z",
  },
  {
    // Deliberately conflicting: community reports do not agree.
    recordId: "k-19",
    positive: 18,
    neutral: 7,
    negative: 6,
    locations: ["Gumla", "Ranchi", "Simdega", "Madhubani", "Dhamtari"],
    reporters: ["c-11", "c-10", "c-14", "c-06", "c-02", "c-12"],
    startedAt: "2026-03-16T06:00:00.000Z",
  },
  {
    recordId: "k-20",
    positive: 6,
    neutral: 2,
    negative: 1,
    locations: ["Gumla", "Ranchi"],
    reporters: ["c-11", "c-07", "c-06"],
    startedAt: "2026-03-18T06:00:00.000Z",
  },
  {
    recordId: "k-21",
    positive: 5,
    neutral: 1,
    negative: 0,
    locations: ["Madhubani", "Darbhanga"],
    reporters: ["c-10", "c-02", "c-06"],
    startedAt: "2026-02-19T06:00:00.000Z",
  },
  {
    recordId: "k-22",
    positive: 4,
    neutral: 1,
    negative: 1,
    locations: ["Dhamtari", "Raipur"],
    reporters: ["c-14", "c-11"],
    startedAt: "2026-02-18T06:00:00.000Z",
  },
  {
    recordId: "k-23",
    positive: 7,
    neutral: 1,
    negative: 1,
    locations: ["Bathinda", "Mansa"],
    reporters: ["c-05", "c-09", "c-13"],
    startedAt: "2026-03-19T06:00:00.000Z",
  },
  {
    recordId: "k-24",
    positive: 3,
    neutral: 1,
    negative: 0,
    locations: ["Beed", "Akola"],
    reporters: ["c-09", "c-12"],
    startedAt: "2026-03-20T06:00:00.000Z",
  },
  {
    recordId: "k-25",
    positive: 9,
    neutral: 2,
    negative: 2,
    locations: ["Beed", "Akola", "Junagadh"],
    reporters: ["c-09", "c-12", "c-13"],
    startedAt: "2026-03-21T06:00:00.000Z",
  },
  {
    recordId: "k-26",
    positive: 6,
    neutral: 3,
    negative: 3,
    locations: ["Nalbari", "Barpeta", "Gumla"],
    reporters: ["c-06", "c-11", "c-10"],
    startedAt: "2026-03-22T06:00:00.000Z",
  },
  {
    recordId: "k-27",
    positive: 4,
    neutral: 1,
    negative: 0,
    locations: ["Nalbari", "Barpeta"],
    reporters: ["c-06", "c-08"],
    startedAt: "2026-03-23T06:00:00.000Z",
  },
  {
    recordId: "k-28",
    positive: 8,
    neutral: 2,
    negative: 1,
    locations: ["Gumla", "Simdega", "Ranchi"],
    reporters: ["c-11", "c-14", "c-10"],
    startedAt: "2026-03-24T06:00:00.000Z",
  },
  {
    recordId: "k-29",
    positive: 3,
    neutral: 2,
    negative: 0,
    locations: ["Tikamgarh", "Jhansi"],
    reporters: ["c-01", "c-02"],
    startedAt: "2026-03-25T06:00:00.000Z",
  },
  {
    recordId: "k-30",
    positive: 7,
    neutral: 2,
    negative: 2,
    locations: ["Junagadh", "Rajkot", "Bathinda"],
    reporters: ["c-13", "c-05", "c-04"],
    startedAt: "2026-03-26T06:00:00.000Z",
  },
];

const DAY_MS = 24 * 60 * 60 * 1000;

const NOTES: Partial<Record<OutcomeValue, string[]>> = {
  positive: [
    "Worked on my plot, repeated it the next week.",
    "Damage reduced noticeably after two applications.",
    "Simple to prepare with what we already keep at home.",
  ],
  neutral: [
    "Some change, but hard to say it was only this.",
    "Tried once, will report again next season.",
  ],
  negative: [
    "No visible difference on my plot.",
    "Preparation was difficult and results were poor.",
  ],
};

function buildReports(seed: ReportSeed): CommunityReport[] {
  const outcomes: OutcomeValue[] = [
    ...Array<OutcomeValue>(seed.positive).fill("positive"),
    ...Array<OutcomeValue>(seed.neutral).fill("neutral"),
    ...Array<OutcomeValue>(seed.negative).fill("negative"),
  ];
  const start = new Date(seed.startedAt).getTime();

  return outcomes.map((outcome, index) => {
    const notes = NOTES[outcome] ?? [];
    return {
      id: `${seed.recordId}-r${String(index + 1).padStart(2, "0")}`,
      knowledgeRecordId: seed.recordId,
      reporterId: seed.reporters[index % seed.reporters.length],
      outcome,
      notes: index % 3 === 0 && notes.length > 0 ? notes[index % notes.length] : null,
      audioUrl: null,
      location: seed.locations[index % seed.locations.length],
      createdAt: new Date(start + index * DAY_MS * 0.6).toISOString(),
      isDemo: true,
    };
  });
}

export const demoCommunityReports: CommunityReport[] = seeds.flatMap(buildReports);
