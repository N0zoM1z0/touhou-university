import { text as catalogText, trees as catalogTrees } from "../generated/i18n/data/phantasm-exam.js";

const q = (id, sectionId, points, evidence, prompt, options, answer, explanation) => ({
  id,
  sectionId,
  points,
  evidence,
  prompt,
  options,
  answer,
  explanation,
});

export const phantasmExamMeta = {
  id: "GKE-2026-PHANTASM-REVERSE",
  revision: 1,
  total: 150,
  questionCount: 9,
  requiredDifficulty: "extra",
  answerSchedule: [2, 0, 3, 1, 3, 0, 2, 1, 0],
};

export const phantasmExamSections = [
  {
    id: "reverse-archives",
    code: "PH-R",
    title: catalogText("phantasmExamSections.reverse-archives.title"),
    note: catalogText("phantasmExamSections.reverse-archives.note"),
  },
  {
    id: "boundary-logic",
    code: "PH-B",
    title: catalogText("phantasmExamSections.boundary-logic.title"),
    note: catalogText("phantasmExamSections.boundary-logic.note"),
  },
  {
    id: "untaken-causality",
    code: "PH-C",
    title: catalogText("phantasmExamSections.untaken-causality.title"),
    note: catalogText("phantasmExamSections.untaken-causality.note"),
  },
];

export const phantasmExamQuestions = [
  q(
    "PH-R01",
    "reverse-archives",
    16,
    catalogText("phantasmExamQuestions.0.PH-R01.3"),
    catalogText("phantasmExamQuestions.0.PH-R01.4"),
    [
      catalogText("phantasmExamQuestions.0.PH-R01.5.0"),
      catalogText("phantasmExamQuestions.0.PH-R01.5.1"),
      catalogText("phantasmExamQuestions.0.PH-R01.5.2"),
      catalogText("phantasmExamQuestions.0.PH-R01.5.3"),
    ],
    2,
    catalogText("phantasmExamQuestions.0.PH-R01.7"),
  ),
  q(
    "PH-R02",
    "reverse-archives",
    16,
    catalogText("phantasmExamQuestions.1.PH-R02.3"),
    catalogText("phantasmExamQuestions.1.PH-R02.4"),
    [
      catalogText("phantasmExamQuestions.1.PH-R02.5.0"),
      catalogText("phantasmExamQuestions.1.PH-R02.5.1"),
      catalogText("phantasmExamQuestions.1.PH-R02.5.2"),
      catalogText("phantasmExamQuestions.1.PH-R02.5.3"),
    ],
    0,
    catalogText("phantasmExamQuestions.1.PH-R02.7"),
  ),
  q(
    "PH-R03",
    "reverse-archives",
    16,
    catalogText("phantasmExamQuestions.2.PH-R03.3"),
    catalogText("phantasmExamQuestions.2.PH-R03.4"),
    [
      catalogText("phantasmExamQuestions.2.PH-R03.5.0"),
      catalogText("phantasmExamQuestions.2.PH-R03.5.1"),
      catalogText("phantasmExamQuestions.2.PH-R03.5.2"),
      catalogText("phantasmExamQuestions.2.PH-R03.5.3"),
    ],
    3,
    catalogText("phantasmExamQuestions.2.PH-R03.7"),
  ),
  q(
    "PH-B01",
    "boundary-logic",
    16,
    catalogText("phantasmExamQuestions.3.PH-B01.3"),
    catalogText("phantasmExamQuestions.3.PH-B01.4"),
    [
      catalogText("phantasmExamQuestions.3.PH-B01.5.0"),
      catalogText("phantasmExamQuestions.3.PH-B01.5.1"),
      catalogText("phantasmExamQuestions.3.PH-B01.5.2"),
      catalogText("phantasmExamQuestions.3.PH-B01.5.3"),
    ],
    1,
    catalogText("phantasmExamQuestions.3.PH-B01.7"),
  ),
  q(
    "PH-B02",
    "boundary-logic",
    16,
    catalogText("phantasmExamQuestions.4.PH-B02.3"),
    catalogText("phantasmExamQuestions.4.PH-B02.4"),
    [
      catalogText("phantasmExamQuestions.4.PH-B02.5.0"),
      catalogText("phantasmExamQuestions.4.PH-B02.5.1"),
      catalogText("phantasmExamQuestions.4.PH-B02.5.2"),
      catalogText("phantasmExamQuestions.4.PH-B02.5.3"),
    ],
    3,
    catalogText("phantasmExamQuestions.4.PH-B02.7"),
  ),
  q(
    "PH-B03",
    "boundary-logic",
    16,
    catalogText("phantasmExamQuestions.5.PH-B03.3"),
    catalogText("phantasmExamQuestions.5.PH-B03.4"),
    [
      catalogText("phantasmExamQuestions.5.PH-B03.5.0"),
      catalogText("phantasmExamQuestions.5.PH-B03.5.1"),
      catalogText("phantasmExamQuestions.5.PH-B03.5.2"),
      catalogText("phantasmExamQuestions.5.PH-B03.5.3"),
    ],
    0,
    catalogText("phantasmExamQuestions.5.PH-B03.7"),
  ),
  q(
    "PH-C01",
    "untaken-causality",
    18,
    catalogText("phantasmExamQuestions.6.PH-C01.3"),
    catalogText("phantasmExamQuestions.6.PH-C01.4"),
    [
      catalogText("phantasmExamQuestions.6.PH-C01.5.0"),
      catalogText("phantasmExamQuestions.6.PH-C01.5.1"),
      catalogText("phantasmExamQuestions.6.PH-C01.5.2"),
      catalogText("phantasmExamQuestions.6.PH-C01.5.3"),
    ],
    2,
    catalogText("phantasmExamQuestions.6.PH-C01.7"),
  ),
  q(
    "PH-C02",
    "untaken-causality",
    18,
    catalogText("phantasmExamQuestions.7.PH-C02.3"),
    catalogText("phantasmExamQuestions.7.PH-C02.4"),
    [
      catalogText("phantasmExamQuestions.7.PH-C02.5.0"),
      catalogText("phantasmExamQuestions.7.PH-C02.5.1"),
      catalogText("phantasmExamQuestions.7.PH-C02.5.2"),
      catalogText("phantasmExamQuestions.7.PH-C02.5.3"),
    ],
    1,
    catalogText("phantasmExamQuestions.7.PH-C02.7"),
  ),
  q(
    "PH-C03",
    "untaken-causality",
    18,
    catalogText("phantasmExamQuestions.8.PH-C03.3"),
    catalogText("phantasmExamQuestions.8.PH-C03.4"),
    [
      catalogText("phantasmExamQuestions.8.PH-C03.5.0"),
      catalogText("phantasmExamQuestions.8.PH-C03.5.1"),
      catalogText("phantasmExamQuestions.8.PH-C03.5.2"),
      catalogText("phantasmExamQuestions.8.PH-C03.5.3"),
    ],
    0,
    catalogText("phantasmExamQuestions.8.PH-C03.7"),
  ),
];

export const phantasmExamCopy = catalogTrees["phantasmExamCopy"];
