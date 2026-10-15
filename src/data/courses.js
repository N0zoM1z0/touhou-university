import { text as catalogText } from "../generated/i18n/data/courses.js";
import { schools } from "./schools.js";

const m = (instructor, day, period, room, capacity, occupied, prerequisites, note, extras = {}) => ({
  instructor,
  day,
  period,
  room,
  capacity,
  occupied,
  prerequisites,
  note,
  ...extras,
});

export const courseTerm = {
  id: "2026-autumn",
  label: catalogText("courseTerm.label"),
  addDeadline: catalogText("courseTerm.addDeadline"),
  dropDeadline: catalogText("courseTerm.dropDeadline"),
  creditLimit: 18,
};

export const courseDays = {
  mon: catalogText("courseDays.mon"),
  tue: catalogText("courseDays.tue"),
  wed: catalogText("courseDays.wed"),
  thu: catalogText("courseDays.thu"),
  fri: catalogText("courseDays.fri"),
  sat: catalogText("courseDays.sat"),
  lunar: catalogText("courseDays.lunar"),
  boundary: catalogText("courseDays.boundary"),
};

export const coursePeriods = {
  p1: ["08:30", "10:00"],
  p2: ["10:20", "11:50"],
  p3: ["13:10", "14:40"],
  p4: ["15:00", "16:30"],
  p5: ["17:20", "18:50"],
  p6: ["19:10", "20:40"],
};

const teachers = {
  reimu: catalogText("teachers.reimu"),
  yukari: catalogText("teachers.yukari"),
  keine: catalogText("teachers.keine"),
  akyuu: catalogText("teachers.akyuu"),
  patchouli: catalogText("teachers.patchouli"),
  marisa: catalogText("teachers.marisa"),
  alice: catalogText("teachers.alice"),
  eirin: catalogText("teachers.eirin"),
  reisen: catalogText("teachers.reisen"),
  nitori: catalogText("teachers.nitori"),
  aya: catalogText("teachers.aya"),
  hatate: catalogText("teachers.hatate"),
  sanae: catalogText("teachers.sanae"),
  byakuren: catalogText("teachers.byakuren"),
  miko: catalogText("teachers.miko"),
};

const meta = {
  "BIS-101": m(teachers.reimu, "mon", "p1", "BH-108", 48, 31, [], catalogText("meta.BIS-101.mon.7")),
  "BIS-132": m(teachers.keine, "tue", "p3", "BH-203", 36, 36, ["BIS-101"], catalogText("meta.BIS-132.tue.7")),
  "BIS-204": m(teachers.reimu, "thu", "p4", "BH-RING", 28, 19, ["BIS-101"], catalogText("meta.BIS-204.thu.7")),
  "BIS-271": m(teachers.yukari, "boundary", "p2", "BH-∞", 24, 17, ["BIS-101"], catalogText("meta.BIS-271.boundary.7"), { boundaryAdjacent: true }),
  "BIS-401": m(teachers.yukari, "fri", "p3", "FIELD", 12, 12, ["BIS-132", "BIS-204"], catalogText("meta.BIS-401.fri.7"), { noWaitlist: true }),

  "HRS-100": m(teachers.keine, "mon", "p2", "HH-302", 56, 56, [], catalogText("meta.HRS-100.mon.7")),
  "HRS-126": m(teachers.akyuu, "tue", "p2", "ML-INNER", 18, 18, ["HRS-100"], catalogText("meta.HRS-126.tue.7"), { conflictsWith: ["MTP-143"] }),
  "HRS-208": m(teachers.keine, "wed", "p4", "HH-204", 24, 11, ["HRS-100"], catalogText("meta.HRS-208.wed.7")),
  "HRS-250": m(teachers.keine, "wed", "p1", "TK-01", 30, 26, ["HRS-100"], catalogText("meta.HRS-250.wed.7")),
  "HRS-410": m(teachers.akyuu, "fri", "p5", "HH-VAULT", 10, 8, ["HRS-126", "HRS-208"], catalogText("meta.HRS-410.fri.7")),

  "MTP-111": m(teachers.patchouli, "mon", "p3", "SD-07", 40, 28, [], catalogText("meta.MTP-111.mon.7")),
  "MTP-143": m(teachers.patchouli, "thu", "p1", "ML-BOOK", 12, 12, ["MTP-111"], catalogText("meta.MTP-143.thu.7"), { conflictsWith: ["HRS-126"] }),
  "MTP-220": m(teachers.alice, "tue", "p4", "SD-DOLL", 24, 16, ["MTP-111"], catalogText("meta.MTP-220.tue.7")),
  "MTP-308": m(teachers.marisa, "fri", "p2", "SD-BLAST", 20, 20, ["MTP-111", "BIS-101"], catalogText("meta.MTP-308.fri.7")),
  "MTP-430": m(teachers.marisa, "sat", "p3", "SD-STAR", 10, 7, ["MTP-220", "MTP-308"], catalogText("meta.MTP-430.sat.7")),

  "LML-102": m(teachers.eirin, "mon", "p4", "EI-A1", 32, 21, [], catalogText("meta.LML-102.mon.7")),
  "LML-166": m(teachers.reisen, "lunar", "p6", "EI-MOON", 20, 20, ["LML-102"], catalogText("meta.LML-166.lunar.7")),
  "LML-240": m(teachers.eirin, "tue", "p5", "EI-SEALED", 16, 9, ["LML-102"], catalogText("meta.LML-240.tue.7")),
  "LML-351": m(teachers.reisen, "thu", "p6", "EI-EAST", 24, 18, ["LML-102", "BIS-101"], catalogText("meta.LML-351.thu.7")),
  "LML-602": m(teachers.eirin, "sat", "p6", "EI-CLINIC", 8, 8, ["LML-240", "LML-351"], catalogText("meta.LML-602.sat.7"), { noWaitlist: true }),

  "KPE-110": m(teachers.nitori, "mon", "p1", "KW-W2", 64, 47, [], catalogText("meta.KPE-110.mon.7")),
  "KPE-148": m(teachers.nitori, "tue", "p1", "KW-MET", 36, 30, ["KPE-110"], catalogText("meta.KPE-148.tue.7")),
  "KPE-215": m(teachers.nitori, "wed", "p3", "KW-REPAIR", 28, 28, ["KPE-110"], catalogText("meta.KPE-215.wed.7")),
  "KPE-322": m(teachers.nitori, "thu", "p3", "VILLAGE-3", 20, 13, ["KPE-148", "KPE-215"], catalogText("meta.KPE-322.thu.7")),
  "KPE-440": m(teachers.nitori, "sat", "p2", "KW-FALL", 12, 10, ["KPE-322"], catalogText("meta.KPE-440.sat.7")),

  "TJM-105": m(teachers.aya, "mon", "p6", "BN-201", 52, 39, [], catalogText("meta.TJM-105.mon.7")),
  "TJM-144": m(teachers.aya, "tue", "p3", "BN-ROOF", 24, 22, ["TJM-105"], catalogText("meta.TJM-144.tue.7")),
  "TJM-212": m(teachers.hatate, "boundary", "p4", "BN-DESK", 20, 20, ["TJM-105"], catalogText("meta.TJM-212.boundary.7"), { boundaryAdjacent: true }),
  "TJM-301": m(teachers.aya, "fri", "p1", "BN-CORR", 30, 14, ["TJM-105"], catalogText("meta.TJM-301.fri.7")),
  "TJM-420": m(teachers.aya, "sat", "p4", "BN-PRESS", 12, 12, ["TJM-144", "TJM-301"], catalogText("meta.TJM-420.sat.7")),

  "FCP-104": m(teachers.sanae, "tue", "p2", "FP-101", 44, 29, [], catalogText("meta.FCP-104.tue.7")),
  "FCP-160": m(teachers.byakuren, "wed", "p5", "FP-CIRCLE", 24, 24, ["FCP-104"], catalogText("meta.FCP-160.wed.7")),
  "FCP-233": m(teachers.miko, "thu", "p2", "FP-HEAR", 32, 23, ["FCP-104"], catalogText("meta.FCP-233.thu.7")),
  "FCP-310": m(teachers.sanae, "fri", "p4", "FESTIVAL", 36, 31, ["FCP-104", "BIS-101"], catalogText("meta.FCP-310.fri.7")),
  "FCP-402": m(teachers.byakuren, "sat", "p5", "FP-TABLE", 12, 6, ["FCP-160", "FCP-233"], catalogText("meta.FCP-402.sat.7")),
};

export const courseCatalogue = Object.entries(schools).flatMap(([schoolId, school]) =>
  school.courses.map(([code, title, credits]) => ({
    code,
    title,
    credits,
    schoolId,
    school: school.name,
    ...meta[code],
  })),
);

export function courseByCode(code) {
  return courseCatalogue.find((course) => course.code === code);
}
