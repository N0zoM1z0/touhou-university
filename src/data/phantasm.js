import { text as catalogText, trees as catalogTrees } from "../generated/i18n/data/phantasm.js";

export const phantasmSealOrder = [
  "coursework",
  "governance",
  "incident",
  "housing",
  "course",
  "unused-route",
];

export const phantasmSealCopy = {
  coursework: {
    mark: "答",
    name: catalogText("phantasmSealCopy.coursework.name"),
    missing: catalogText("phantasmSealCopy.coursework.missing"),
    found: catalogText("phantasmSealCopy.coursework.found"),
  },
  governance: {
    mark: "票",
    name: catalogText("phantasmSealCopy.governance.name"),
    missing: catalogText("phantasmSealCopy.governance.missing"),
    found: catalogText("phantasmSealCopy.governance.found"),
  },
  incident: {
    mark: "異",
    name: catalogText("phantasmSealCopy.incident.name"),
    missing: catalogText("phantasmSealCopy.incident.missing"),
    found: catalogText("phantasmSealCopy.incident.found"),
  },
  housing: {
    mark: "室",
    name: catalogText("phantasmSealCopy.housing.name"),
    missing: catalogText("phantasmSealCopy.housing.missing"),
    found: catalogText("phantasmSealCopy.housing.found"),
  },
  course: {
    mark: "退",
    name: catalogText("phantasmSealCopy.course.name"),
    missing: catalogText("phantasmSealCopy.course.missing"),
    found: catalogText("phantasmSealCopy.course.found"),
  },
  "unused-route": {
    mark: "未",
    name: catalogText("phantasmSealCopy.unused-route.name"),
    missing: catalogText("phantasmSealCopy.unused-route.missing"),
    found: catalogText("phantasmSealCopy.unused-route.found"),
  },
};

export const phantasmCourses = [
  {
    id: "PH-009",
    mark: "九",
    title: catalogText("phantasmCourses.PH-009.title"),
    teacher: catalogText("phantasmCourses.PH-009.teacher"),
    credits: catalogText("phantasmCourses.PH-009.credits"),
    room: catalogText("phantasmCourses.PH-009.room"),
    syllabus: catalogText("phantasmCourses.PH-009.syllabus"),
    assessment: catalogText("phantasmCourses.PH-009.assessment"),
    requires: "course",
  },
  {
    id: "DRM-404",
    mark: "夢",
    title: catalogText("phantasmCourses.DRM-404.title"),
    teacher: catalogText("phantasmCourses.DRM-404.teacher"),
    credits: catalogText("phantasmCourses.DRM-404.credits"),
    room: catalogText("phantasmCourses.DRM-404.room"),
    syllabus: catalogText("phantasmCourses.DRM-404.syllabus"),
    assessment: catalogText("phantasmCourses.DRM-404.assessment"),
    requires: "incident",
  },
  {
    id: "GOV-000",
    mark: "影",
    title: catalogText("phantasmCourses.GOV-000.title"),
    teacher: catalogText("phantasmCourses.GOV-000.teacher"),
    credits: catalogText("phantasmCourses.GOV-000.credits"),
    room: catalogText("phantasmCourses.GOV-000.room"),
    syllabus: catalogText("phantasmCourses.GOV-000.syllabus"),
    assessment: catalogText("phantasmCourses.GOV-000.assessment"),
    requires: "governance",
  },
  {
    id: "DOR-013",
    mark: "鍵",
    title: catalogText("phantasmCourses.DOR-013.title"),
    teacher: catalogText("phantasmCourses.DOR-013.teacher"),
    credits: catalogText("phantasmCourses.DOR-013.credits"),
    room: catalogText("phantasmCourses.DOR-013.room"),
    syllabus: catalogText("phantasmCourses.DOR-013.syllabus"),
    assessment: catalogText("phantasmCourses.DOR-013.assessment"),
    requires: "housing",
  },
  {
    id: "LIB-NULL",
    mark: "否",
    title: catalogText("phantasmCourses.LIB-NULL.title"),
    teacher: catalogText("phantasmCourses.LIB-NULL.teacher"),
    credits: catalogText("phantasmCourses.LIB-NULL.credits"),
    room: catalogText("phantasmCourses.LIB-NULL.room"),
    syllabus: catalogText("phantasmCourses.LIB-NULL.syllabus"),
    assessment: catalogText("phantasmCourses.LIB-NULL.assessment"),
    bonus: "book-returned",
  },
  {
    id: "BND-∞",
    mark: "裏",
    title: catalogText("phantasmCourses.BND--.title"),
    teacher: catalogText("phantasmCourses.BND--.teacher"),
    credits: catalogText("phantasmCourses.BND--.credits"),
    room: catalogText("phantasmCourses.BND--.room"),
    syllabus: catalogText("phantasmCourses.BND--.syllabus"),
    assessment: catalogText("phantasmCourses.BND--.assessment"),
    requires: "unused-route",
  },
];

export const phantasmNodes = [
  {
    id: "north-stair",
    mark: "階",
    title: catalogText("phantasmNodes.north-stair.title"),
    role: catalogText("phantasmNodes.north-stair.role"),
    body: catalogText("phantasmNodes.north-stair.body"),
    x: 18,
    y: 25,
  },
  {
    id: "shadow-senate",
    mark: "票",
    title: catalogText("phantasmNodes.shadow-senate.title"),
    role: catalogText("phantasmNodes.shadow-senate.role"),
    body: catalogText("phantasmNodes.shadow-senate.body"),
    x: 72,
    y: 20,
  },
  {
    id: "room-404",
    mark: "室",
    title: catalogText("phantasmNodes.room-404.title"),
    role: catalogText("phantasmNodes.room-404.role"),
    body: catalogText("phantasmNodes.room-404.body"),
    x: 82,
    y: 63,
  },
  {
    id: "reverse-library",
    mark: "書",
    title: catalogText("phantasmNodes.reverse-library.title"),
    role: catalogText("phantasmNodes.reverse-library.role"),
    body: catalogText("phantasmNodes.reverse-library.body"),
    x: 25,
    y: 70,
  },
  {
    id: "ninth-bell",
    mark: "鐘",
    title: catalogText("phantasmNodes.ninth-bell.title"),
    role: catalogText("phantasmNodes.ninth-bell.role"),
    body: catalogText("phantasmNodes.ninth-bell.body"),
    x: 50,
    y: 45,
  },
  {
    id: "unused-gate",
    mark: "未",
    title: catalogText("phantasmNodes.unused-gate.title"),
    role: catalogText("phantasmNodes.unused-gate.role"),
    body: catalogText("phantasmNodes.unused-gate.body"),
    x: 49,
    y: 84,
  },
];

export const phantasmExaminers = [
  {
    id: "doremy",
    name: catalogText("phantasmExaminers.doremy.name"),
    role: catalogText("phantasmExaminers.doremy.role"),
  },
  {
    id: "yukari",
    name: catalogText("phantasmExaminers.yukari.name"),
    role: catalogText("phantasmExaminers.yukari.role"),
  },
  {
    id: "keine",
    name: catalogText("phantasmExaminers.keine.name"),
    role: catalogText("phantasmExaminers.keine.role"),
  },
  {
    id: "reimu",
    name: catalogText("phantasmExaminers.reimu.name"),
    role: catalogText("phantasmExaminers.reimu.role"),
  },
];

export const phantasmBrandProfiles = {
  new: {
    mark: "無",
    name: catalogText("phantasmBrandProfiles.new.name"),
    short: catalogText("phantasmBrandProfiles.new.short"),
    motto: catalogText("phantasmBrandProfiles.new.motto"),
  },
  waxing: {
    mark: "九",
    name: catalogText("phantasmBrandProfiles.waxing.name"),
    short: catalogText("phantasmBrandProfiles.waxing.short"),
    motto: catalogText("phantasmBrandProfiles.waxing.motto"),
  },
  full: {
    mark: "夢",
    name: catalogText("phantasmBrandProfiles.full.name"),
    short: catalogText("phantasmBrandProfiles.full.short"),
    motto: catalogText("phantasmBrandProfiles.full.motto"),
  },
  waning: {
    mark: "未",
    name: catalogText("phantasmBrandProfiles.waning.name"),
    short: catalogText("phantasmBrandProfiles.waning.short"),
    motto: catalogText("phantasmBrandProfiles.waning.motto"),
  },
};

export const phantasmCopy = catalogTrees["phantasmCopy"];
