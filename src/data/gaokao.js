import { text as catalogText } from "../generated/i18n/data/gaokao.js";
import { advancedGaokaoQuestions } from "./gaokao-advanced.js";

const q = (id, points, prompt, options, answer, explanation) => ({
  id,
  points,
  prompt,
  options,
  answer,
  explanation,
});

export const gaokaoSubjects = {
  language: {
    code: "GKL-01",
    name: catalogText("gaokaoSubjects.language.name"),
    note: catalogText("gaokaoSubjects.language.note"),
    questions: [
      q(
        "L01", 6,
        catalogText("gaokaoSubjects.language.questions.0.L01.2"),
        [catalogText("gaokaoSubjects.language.questions.0.L01.3.0"), catalogText("gaokaoSubjects.language.questions.0.L01.3.1"), catalogText("gaokaoSubjects.language.questions.0.L01.3.2"), catalogText("gaokaoSubjects.language.questions.0.L01.3.3")], 1,
        catalogText("gaokaoSubjects.language.questions.0.L01.5"),
      ),
      q(
        "L02", 6,
        catalogText("gaokaoSubjects.language.questions.1.L02.2"),
        [catalogText("gaokaoSubjects.language.questions.1.L02.3.0"), catalogText("gaokaoSubjects.language.questions.1.L02.3.1"), catalogText("gaokaoSubjects.language.questions.1.L02.3.2"), catalogText("gaokaoSubjects.language.questions.1.L02.3.3")], 1,
        catalogText("gaokaoSubjects.language.questions.1.L02.5"),
      ),
      q(
        "L03", 6,
        catalogText("gaokaoSubjects.language.questions.2.L03.2"),
        [catalogText("gaokaoSubjects.language.questions.2.L03.3.0"), catalogText("gaokaoSubjects.language.questions.2.L03.3.1"), catalogText("gaokaoSubjects.language.questions.2.L03.3.2"), catalogText("gaokaoSubjects.language.questions.2.L03.3.3")], 1,
        catalogText("gaokaoSubjects.language.questions.2.L03.5"),
      ),
      q(
        "L04", 6,
        catalogText("gaokaoSubjects.language.questions.3.L04.2"),
        [catalogText("gaokaoSubjects.language.questions.3.L04.3.0"), catalogText("gaokaoSubjects.language.questions.3.L04.3.1"), catalogText("gaokaoSubjects.language.questions.3.L04.3.2"), catalogText("gaokaoSubjects.language.questions.3.L04.3.3")], 1,
        catalogText("gaokaoSubjects.language.questions.3.L04.5"),
      ),
      q(
        "L05", 6,
        catalogText("gaokaoSubjects.language.questions.4.L05.2"),
        [catalogText("gaokaoSubjects.language.questions.4.L05.3.0"), catalogText("gaokaoSubjects.language.questions.4.L05.3.1"), catalogText("gaokaoSubjects.language.questions.4.L05.3.2"), catalogText("gaokaoSubjects.language.questions.4.L05.3.3")], 2,
        catalogText("gaokaoSubjects.language.questions.4.L05.5"),
      ),
      q(
        "L06", 6,
        catalogText("gaokaoSubjects.language.questions.5.L06.2"),
        [catalogText("gaokaoSubjects.language.questions.5.L06.3.0"), catalogText("gaokaoSubjects.language.questions.5.L06.3.1"), catalogText("gaokaoSubjects.language.questions.5.L06.3.2"), catalogText("gaokaoSubjects.language.questions.5.L06.3.3")], 0,
        catalogText("gaokaoSubjects.language.questions.5.L06.5"),
      ),
    ],
  },
  mathematics: {
    code: "GKM-02",
    name: catalogText("gaokaoSubjects.mathematics.name"),
    note: catalogText("gaokaoSubjects.mathematics.note"),
    questions: [
      q("M01", 7, catalogText("gaokaoSubjects.mathematics.questions.0.M01.2"), [catalogText("gaokaoSubjects.mathematics.questions.0.M01.3.0"), catalogText("gaokaoSubjects.mathematics.questions.0.M01.3.1"), catalogText("gaokaoSubjects.mathematics.questions.0.M01.3.2"), catalogText("gaokaoSubjects.mathematics.questions.0.M01.3.3")], 2, catalogText("gaokaoSubjects.mathematics.questions.0.M01.5")),
      q("M02", 7, catalogText("gaokaoSubjects.mathematics.questions.1.M02.2"), [catalogText("gaokaoSubjects.mathematics.questions.1.M02.3.0"), catalogText("gaokaoSubjects.mathematics.questions.1.M02.3.1"), catalogText("gaokaoSubjects.mathematics.questions.1.M02.3.2"), catalogText("gaokaoSubjects.mathematics.questions.1.M02.3.3")], 1, catalogText("gaokaoSubjects.mathematics.questions.1.M02.5")),
      q("M03", 7, catalogText("gaokaoSubjects.mathematics.questions.2.M03.2"), [catalogText("gaokaoSubjects.mathematics.questions.2.M03.3.0"), catalogText("gaokaoSubjects.mathematics.questions.2.M03.3.1"), catalogText("gaokaoSubjects.mathematics.questions.2.M03.3.2"), catalogText("gaokaoSubjects.mathematics.questions.2.M03.3.3")], 0, catalogText("gaokaoSubjects.mathematics.questions.2.M03.5")),
      q("M04", 7, catalogText("gaokaoSubjects.mathematics.questions.3.M04.2"), [catalogText("gaokaoSubjects.mathematics.questions.3.M04.3.0"), catalogText("gaokaoSubjects.mathematics.questions.3.M04.3.1"), catalogText("gaokaoSubjects.mathematics.questions.3.M04.3.2"), catalogText("gaokaoSubjects.mathematics.questions.3.M04.3.3")], 2, catalogText("gaokaoSubjects.mathematics.questions.3.M04.5")),
      q("M05", 7, catalogText("gaokaoSubjects.mathematics.questions.4.M05.2"), [catalogText("gaokaoSubjects.mathematics.questions.4.M05.3.0"), catalogText("gaokaoSubjects.mathematics.questions.4.M05.3.1"), catalogText("gaokaoSubjects.mathematics.questions.4.M05.3.2"), catalogText("gaokaoSubjects.mathematics.questions.4.M05.3.3")], 1, catalogText("gaokaoSubjects.mathematics.questions.4.M05.5")),
      q("M06", 7, catalogText("gaokaoSubjects.mathematics.questions.5.M06.2"), [catalogText("gaokaoSubjects.mathematics.questions.5.M06.3.0"), catalogText("gaokaoSubjects.mathematics.questions.5.M06.3.1"), catalogText("gaokaoSubjects.mathematics.questions.5.M06.3.2"), catalogText("gaokaoSubjects.mathematics.questions.5.M06.3.3")], 1, catalogText("gaokaoSubjects.mathematics.questions.5.M06.5")),
    ],
  },
  common: {
    code: "GKC-03",
    name: catalogText("gaokaoSubjects.common.name"),
    note: catalogText("gaokaoSubjects.common.note"),
    questions: [
      q("C01", 5, catalogText("gaokaoSubjects.common.questions.0.C01.2"), [catalogText("gaokaoSubjects.common.questions.0.C01.3.0"), catalogText("gaokaoSubjects.common.questions.0.C01.3.1"), catalogText("gaokaoSubjects.common.questions.0.C01.3.2"), catalogText("gaokaoSubjects.common.questions.0.C01.3.3")], 1, catalogText("gaokaoSubjects.common.questions.0.C01.5")),
      q("C02", 5, catalogText("gaokaoSubjects.common.questions.1.C02.2"), [catalogText("gaokaoSubjects.common.questions.1.C02.3.0"), catalogText("gaokaoSubjects.common.questions.1.C02.3.1"), catalogText("gaokaoSubjects.common.questions.1.C02.3.2"), catalogText("gaokaoSubjects.common.questions.1.C02.3.3")], 1, catalogText("gaokaoSubjects.common.questions.1.C02.5")),
      q("C03", 5, catalogText("gaokaoSubjects.common.questions.2.C03.2"), [catalogText("gaokaoSubjects.common.questions.2.C03.3.0"), catalogText("gaokaoSubjects.common.questions.2.C03.3.1"), catalogText("gaokaoSubjects.common.questions.2.C03.3.2"), catalogText("gaokaoSubjects.common.questions.2.C03.3.3")], 1, catalogText("gaokaoSubjects.common.questions.2.C03.5")),
      q("C04", 5, catalogText("gaokaoSubjects.common.questions.3.C04.2"), [catalogText("gaokaoSubjects.common.questions.3.C04.3.0"), catalogText("gaokaoSubjects.common.questions.3.C04.3.1"), catalogText("gaokaoSubjects.common.questions.3.C04.3.2"), catalogText("gaokaoSubjects.common.questions.3.C04.3.3")], 1, catalogText("gaokaoSubjects.common.questions.3.C04.5")),
      q("C05", 5, catalogText("gaokaoSubjects.common.questions.4.C05.2"), [catalogText("gaokaoSubjects.common.questions.4.C05.3.0"), catalogText("gaokaoSubjects.common.questions.4.C05.3.1"), catalogText("gaokaoSubjects.common.questions.4.C05.3.2"), catalogText("gaokaoSubjects.common.questions.4.C05.3.3")], 1, catalogText("gaokaoSubjects.common.questions.4.C05.5")),
      q("C06", 5, catalogText("gaokaoSubjects.common.questions.5.C06.2"), [catalogText("gaokaoSubjects.common.questions.5.C06.3.0"), catalogText("gaokaoSubjects.common.questions.5.C06.3.1"), catalogText("gaokaoSubjects.common.questions.5.C06.3.2"), catalogText("gaokaoSubjects.common.questions.5.C06.3.3")], 0, catalogText("gaokaoSubjects.common.questions.5.C06.5")),
    ],
  },
  humanities: {
    code: "GKH-04",
    name: catalogText("gaokaoSubjects.humanities.name"),
    note: catalogText("gaokaoSubjects.humanities.note"),
    questions: [
      q("H01", 7, catalogText("gaokaoSubjects.humanities.questions.0.H01.2"), [catalogText("gaokaoSubjects.humanities.questions.0.H01.3.0"), catalogText("gaokaoSubjects.humanities.questions.0.H01.3.1"), catalogText("gaokaoSubjects.humanities.questions.0.H01.3.2"), catalogText("gaokaoSubjects.humanities.questions.0.H01.3.3")], 1, catalogText("gaokaoSubjects.humanities.questions.0.H01.5")),
      q("H02", 7, catalogText("gaokaoSubjects.humanities.questions.1.H02.2"), [catalogText("gaokaoSubjects.humanities.questions.1.H02.3.0"), catalogText("gaokaoSubjects.humanities.questions.1.H02.3.1"), catalogText("gaokaoSubjects.humanities.questions.1.H02.3.2"), catalogText("gaokaoSubjects.humanities.questions.1.H02.3.3")], 1, catalogText("gaokaoSubjects.humanities.questions.1.H02.5")),
      q("H03", 7, catalogText("gaokaoSubjects.humanities.questions.2.H03.2"), [catalogText("gaokaoSubjects.humanities.questions.2.H03.3.0"), catalogText("gaokaoSubjects.humanities.questions.2.H03.3.1"), catalogText("gaokaoSubjects.humanities.questions.2.H03.3.2"), catalogText("gaokaoSubjects.humanities.questions.2.H03.3.3")], 1, catalogText("gaokaoSubjects.humanities.questions.2.H03.5"),
      ),
      q("H04", 7, catalogText("gaokaoSubjects.humanities.questions.3.H04.2"), [catalogText("gaokaoSubjects.humanities.questions.3.H04.3.0"), catalogText("gaokaoSubjects.humanities.questions.3.H04.3.1"), catalogText("gaokaoSubjects.humanities.questions.3.H04.3.2"), catalogText("gaokaoSubjects.humanities.questions.3.H04.3.3")], 1, catalogText("gaokaoSubjects.humanities.questions.3.H04.5")),
      q("H05", 7, catalogText("gaokaoSubjects.humanities.questions.4.H05.2"), [catalogText("gaokaoSubjects.humanities.questions.4.H05.3.0"), catalogText("gaokaoSubjects.humanities.questions.4.H05.3.1"), catalogText("gaokaoSubjects.humanities.questions.4.H05.3.2"), catalogText("gaokaoSubjects.humanities.questions.4.H05.3.3")], 1, catalogText("gaokaoSubjects.humanities.questions.4.H05.5")),
      q("H06", 7, catalogText("gaokaoSubjects.humanities.questions.5.H06.2"), [catalogText("gaokaoSubjects.humanities.questions.5.H06.3.0"), catalogText("gaokaoSubjects.humanities.questions.5.H06.3.1"), catalogText("gaokaoSubjects.humanities.questions.5.H06.3.2"), catalogText("gaokaoSubjects.humanities.questions.5.H06.3.3")], 1, catalogText("gaokaoSubjects.humanities.questions.5.H06.5")),
    ],
  },
  science: {
    code: "GKS-04",
    name: catalogText("gaokaoSubjects.science.name"),
    note: catalogText("gaokaoSubjects.science.note"),
    questions: [
      q("S01", 7, catalogText("gaokaoSubjects.science.questions.0.S01.2"), [catalogText("gaokaoSubjects.science.questions.0.S01.3.0"), catalogText("gaokaoSubjects.science.questions.0.S01.3.1"), catalogText("gaokaoSubjects.science.questions.0.S01.3.2"), catalogText("gaokaoSubjects.science.questions.0.S01.3.3")], 1, catalogText("gaokaoSubjects.science.questions.0.S01.5")),
      q("S02", 7, catalogText("gaokaoSubjects.science.questions.1.S02.2"), [catalogText("gaokaoSubjects.science.questions.1.S02.3.0"), catalogText("gaokaoSubjects.science.questions.1.S02.3.1"), catalogText("gaokaoSubjects.science.questions.1.S02.3.2"), catalogText("gaokaoSubjects.science.questions.1.S02.3.3")], 1, catalogText("gaokaoSubjects.science.questions.1.S02.5")),
      q("S03", 7, catalogText("gaokaoSubjects.science.questions.2.S03.2"), [catalogText("gaokaoSubjects.science.questions.2.S03.3.0"), catalogText("gaokaoSubjects.science.questions.2.S03.3.1"), catalogText("gaokaoSubjects.science.questions.2.S03.3.2"), catalogText("gaokaoSubjects.science.questions.2.S03.3.3")], 1, catalogText("gaokaoSubjects.science.questions.2.S03.5")),
      q("S04", 7, catalogText("gaokaoSubjects.science.questions.3.S04.2"), [catalogText("gaokaoSubjects.science.questions.3.S04.3.0"), catalogText("gaokaoSubjects.science.questions.3.S04.3.1"), catalogText("gaokaoSubjects.science.questions.3.S04.3.2"), catalogText("gaokaoSubjects.science.questions.3.S04.3.3")], 1, catalogText("gaokaoSubjects.science.questions.3.S04.5")),
      q("S05", 7, catalogText("gaokaoSubjects.science.questions.4.S05.2"), [catalogText("gaokaoSubjects.science.questions.4.S05.3.0"), catalogText("gaokaoSubjects.science.questions.4.S05.3.1"), catalogText("gaokaoSubjects.science.questions.4.S05.3.2"), catalogText("gaokaoSubjects.science.questions.4.S05.3.3")], 1, catalogText("gaokaoSubjects.science.questions.4.S05.5")),
      q("S06", 7, catalogText("gaokaoSubjects.science.questions.5.S06.2"), [catalogText("gaokaoSubjects.science.questions.5.S06.3.0"), catalogText("gaokaoSubjects.science.questions.5.S06.3.1"), catalogText("gaokaoSubjects.science.questions.5.S06.3.2"), catalogText("gaokaoSubjects.science.questions.5.S06.3.3")], 1, catalogText("gaokaoSubjects.science.questions.5.S06.5")),
    ],
  },
};

export const gaokaoTracks = {
  humanities: {
    glyph: "文",
    name: catalogText("gaokaoTracks.humanities.name"),
    subjects: ["language", "mathematics", "common", "humanities"],
  },
  science: {
    glyph: "理",
    name: catalogText("gaokaoTracks.science.name"),
    subjects: ["language", "mathematics", "common", "science"],
  },
};

export const gaokaoMeta = {
  year: 2026,
  edition: "GKE-2026",
  revision: 2,
  total: 150,
};

export const gaokaoDifficulties = {
  normal: {
    label: "NORMAL",
    glyph: "N",
    duration: 90 * 60,
    description: catalogText("gaokaoDifficulties.normal.description"),
  },
  hard: {
    label: "HARD",
    glyph: "H",
    duration: 105 * 60,
    description: catalogText("gaokaoDifficulties.hard.description"),
  },
  lunatic: {
    label: "LUNATIC",
    glyph: "L",
    duration: 120 * 60,
    description: catalogText("gaokaoDifficulties.lunatic.description"),
  },
  extra: {
    label: "EXTRA",
    glyph: "EX",
    duration: 135 * 60,
    description: catalogText("gaokaoDifficulties.extra.description"),
  },
};

function rotateAnswer(question, target) {
  const shift = (target - question.answer + question.options.length) % question.options.length;
  const options = Array(question.options.length);
  question.options.forEach((option, index) => {
    options[(index + shift) % question.options.length] = option;
  });
  return { ...question, options, answer: target };
}

const answerSchedules = {
  humanities: {
    normal: [2, 0, 3, 1, 0, 2, 1, 3, 2, 0, 3, 1, 3, 1, 0, 2, 1, 3, 2, 0, 0, 2, 1, 3],
    hard: [2, 0, 3, 1, 3, 1, 0, 2, 1, 3, 2, 0],
    lunatic: [1, 3, 0, 2, 0, 2, 3, 1, 2, 0, 3, 1],
    extra: [3, 1, 0, 2, 1, 3, 2, 0, 2, 0, 3, 1],
  },
  science: {
    normal: [1, 3, 0, 2, 3, 1, 2, 0, 1, 3, 0, 2, 0, 2, 3, 1, 2, 0, 1, 3, 3, 1, 2, 0],
    hard: [1, 3, 0, 2, 0, 2, 3, 1, 2, 0, 1, 3],
    lunatic: [3, 0, 2, 1, 2, 1, 0, 3, 1, 3, 0, 2],
    extra: [0, 2, 3, 1, 3, 0, 1, 2, 1, 3, 0, 2],
  },
};

export function gaokaoQuestionsFor(trackId, difficultyId = "normal") {
  const track = gaokaoTracks[trackId];
  const difficulty = gaokaoDifficulties[difficultyId] ? difficultyId : "normal";
  if (!track) return [];
  const questions = track.subjects.flatMap((subjectId) => {
    const source =
      difficulty === "normal"
        ? gaokaoSubjects[subjectId].questions
        : advancedGaokaoQuestions[subjectId].filter((question) => question.difficulty === difficulty);
    return source.map((question) => ({ ...question, subjectId }));
  });
  const schedule = answerSchedules[trackId]?.[difficulty];
  return questions.map((question, index) => rotateAnswer(question, schedule?.[index] ?? index % 4));
}
