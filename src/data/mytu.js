import { text as catalogText } from "../generated/i18n/data/mytu.js";

export const identityKinds = {
  human: catalogText("identityKinds.human"),
  youkai: catalogText("identityKinds.youkai"),
  fairy: catalogText("identityKinds.fairy"),
  magician: catalogText("identityKinds.magician"),
  spirit: catalogText("identityKinds.spirit"),
  lunar: catalogText("identityKinds.lunar"),
  other: catalogText("identityKinds.other"),
};

export const originKinds = {
  gensokyo: catalogText("originKinds.gensokyo"),
  outside: catalogText("originKinds.outside"),
  lunar: catalogText("originKinds.lunar"),
  shifting: catalogText("originKinds.shifting"),
};

export const committeeBySchool = {
  boundary: ["yukari", "reimu", "keine"],
  history: ["keine", "aya", "reimu"],
  magic: ["patchouli", "marisa", "reimu"],
  medicine: ["eirin", "reimu", "keine"],
  engineering: ["nitori", "marisa", "aya"],
  journalism: ["aya", "keine", "reimu"],
  policy: ["byakuren", "kanako", "miko"],
};

export const reviewers = {
  reimu: {
    name: catalogText("reviewers.reimu.name"),
    role: catalogText("reviewers.reimu.role"),
    stance: "condition",
    note: catalogText("reviewers.reimu.note"),
  },
  yukari: {
    name: catalogText("reviewers.yukari.name"),
    role: catalogText("reviewers.yukari.role"),
    stance: "approve",
    note: catalogText("reviewers.yukari.note"),
  },
  keine: {
    name: catalogText("reviewers.keine.name"),
    role: catalogText("reviewers.keine.role"),
    stance: "revise",
    note: catalogText("reviewers.keine.note"),
  },
  patchouli: {
    name: catalogText("reviewers.patchouli.name"),
    role: catalogText("reviewers.patchouli.role"),
    stance: "revise",
    note: catalogText("reviewers.patchouli.note"),
  },
  marisa: {
    name: catalogText("reviewers.marisa.name"),
    role: catalogText("reviewers.marisa.role"),
    stance: "approve",
    note: catalogText("reviewers.marisa.note"),
  },
  eirin: {
    name: catalogText("reviewers.eirin.name"),
    role: catalogText("reviewers.eirin.role"),
    stance: "approve",
    note: catalogText("reviewers.eirin.note"),
  },
  nitori: {
    name: catalogText("reviewers.nitori.name"),
    role: catalogText("reviewers.nitori.role"),
    stance: "approve",
    note: catalogText("reviewers.nitori.note"),
  },
  aya: {
    name: catalogText("reviewers.aya.name"),
    role: catalogText("reviewers.aya.role"),
    stance: "revise",
    note: catalogText("reviewers.aya.note"),
  },
  byakuren: {
    name: catalogText("reviewers.byakuren.name"),
    role: catalogText("reviewers.byakuren.role"),
    stance: "approve",
    note: catalogText("reviewers.byakuren.note"),
  },
  kanako: {
    name: catalogText("reviewers.kanako.name"),
    role: catalogText("reviewers.kanako.role"),
    stance: "condition",
    note: catalogText("reviewers.kanako.note"),
  },
  miko: {
    name: catalogText("reviewers.miko.name"),
    role: catalogText("reviewers.miko.role"),
    stance: "revise",
    note: catalogText("reviewers.miko.note"),
  },
};

export const reviewerCommentary = {
  reimu: {
    question: catalogText("reviewerCommentary.reimu.question"),
    method: catalogText("reviewerCommentary.reimu.method"),
    needs: catalogText("reviewerCommentary.reimu.needs"),
  },
  yukari: {
    question: catalogText("reviewerCommentary.yukari.question"),
    method: catalogText("reviewerCommentary.yukari.method"),
    needs: catalogText("reviewerCommentary.yukari.needs"),
  },
  keine: {
    question: catalogText("reviewerCommentary.keine.question"),
    method: catalogText("reviewerCommentary.keine.method"),
    needs: catalogText("reviewerCommentary.keine.needs"),
  },
  patchouli: {
    question: catalogText("reviewerCommentary.patchouli.question"),
    method: catalogText("reviewerCommentary.patchouli.method"),
    needs: catalogText("reviewerCommentary.patchouli.needs"),
  },
  marisa: {
    question: catalogText("reviewerCommentary.marisa.question"),
    method: catalogText("reviewerCommentary.marisa.method"),
    needs: catalogText("reviewerCommentary.marisa.needs"),
  },
  eirin: {
    question: catalogText("reviewerCommentary.eirin.question"),
    method: catalogText("reviewerCommentary.eirin.method"),
    needs: catalogText("reviewerCommentary.eirin.needs"),
  },
  nitori: {
    question: catalogText("reviewerCommentary.nitori.question"),
    method: catalogText("reviewerCommentary.nitori.method"),
    needs: catalogText("reviewerCommentary.nitori.needs"),
  },
  aya: {
    question: catalogText("reviewerCommentary.aya.question"),
    method: catalogText("reviewerCommentary.aya.method"),
    needs: catalogText("reviewerCommentary.aya.needs"),
  },
  byakuren: {
    question: catalogText("reviewerCommentary.byakuren.question"),
    method: catalogText("reviewerCommentary.byakuren.method"),
    needs: catalogText("reviewerCommentary.byakuren.needs"),
  },
  kanako: {
    question: catalogText("reviewerCommentary.kanako.question"),
    method: catalogText("reviewerCommentary.kanako.method"),
    needs: catalogText("reviewerCommentary.kanako.needs"),
  },
  miko: {
    question: catalogText("reviewerCommentary.miko.question"),
    method: catalogText("reviewerCommentary.miko.method"),
    needs: catalogText("reviewerCommentary.miko.needs"),
  },
};
