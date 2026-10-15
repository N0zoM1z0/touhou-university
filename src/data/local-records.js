import { text as catalogText } from "../generated/i18n/data/local-records.js";

const record = (key, group, title, options = {}) => ({
  key,
  group,
  storage: "local",
  portable: true,
  kind: "record",
  scope: "device",
  encoding: "json",
  ...options,
  title,
});

export const localRecordGroups = [
  {
    id: "identity",
    mark: "籍",
    title: catalogText("localRecordGroups.identity.title"),
    note: catalogText("localRecordGroups.identity.note"),
  },
  {
    id: "admissions",
    mark: "願",
    title: catalogText("localRecordGroups.admissions.title"),
    note: catalogText("localRecordGroups.admissions.note"),
  },
  {
    id: "academics",
    mark: "課",
    title: catalogText("localRecordGroups.academics.title"),
    note: catalogText("localRecordGroups.academics.note"),
  },
  {
    id: "library",
    mark: "書",
    title: catalogText("localRecordGroups.library.title"),
    note: catalogText("localRecordGroups.library.note"),
  },
  {
    id: "campus",
    mark: "談",
    title: catalogText("localRecordGroups.campus.title"),
    note: catalogText("localRecordGroups.campus.note"),
  },
  {
    id: "research",
    mark: "研",
    title: catalogText("localRecordGroups.research.title"),
    note: catalogText("localRecordGroups.research.note"),
  },
  {
    id: "fieldwork",
    mark: "旅",
    title: catalogText("localRecordGroups.fieldwork.title"),
    note: catalogText("localRecordGroups.fieldwork.note"),
  },
  {
    id: "commons",
    mark: "便",
    title: catalogText("localRecordGroups.commons.title"),
    note: catalogText("localRecordGroups.commons.note"),
  },
  {
    id: "careers",
    mark: "卒",
    title: catalogText("localRecordGroups.careers.title"),
    note: catalogText("localRecordGroups.careers.note"),
  },
  {
    id: "preferences",
    mark: "栞",
    title: catalogText("localRecordGroups.preferences.title"),
    note: catalogText("localRecordGroups.preferences.note"),
  },
  {
    id: "system",
    mark: "簿",
    title: catalogText("localRecordGroups.system.title"),
    note: catalogText("localRecordGroups.system.note"),
  },
  {
    id: "dream",
    mark: "夢",
    title: catalogText("localRecordGroups.dream.title"),
    note: catalogText("localRecordGroups.dream.note"),
  },
  {
    id: "unknown",
    mark: "?",
    title: catalogText("localRecordGroups.unknown.title"),
    note: catalogText("localRecordGroups.unknown.note"),
  },
];

export const localRecordRegistry = [
  record("tu:identity", "identity", catalogText("localRecordRegistry.0.tu-identity.2")),
  record("tu:application:reviews", "identity", catalogText("localRecordRegistry.1.tu-application-reviews.2")),
  record("tu:orientation:dossiers", "identity", catalogText("localRecordRegistry.2.tu-orientation-dossiers.2")),

  record("tu:application:draft", "admissions", catalogText("localRecordRegistry.3.tu-application-draft.2"), { kind: "draft" }),
  record("tu:application:submissions", "admissions", catalogText("localRecordRegistry.4.tu-application-submissions.2")),
  record("tu:visit:draft", "admissions", catalogText("localRecordRegistry.5.tu-visit-draft.2"), { kind: "draft" }),
  record("tu:visits", "admissions", catalogText("localRecordRegistry.6.tu-visits.2")),
  record("tu:exam:history", "admissions", catalogText("localRecordRegistry.7.tu-exam-history.2")),
  record("tu:gaokao:draft", "admissions", catalogText("localRecordRegistry.8.tu-gaokao-draft.2"), { kind: "draft" }),
  record("tu:gaokao:attempts", "admissions", catalogText("localRecordRegistry.9.tu-gaokao-attempts.2")),

  record("tu:courses:registration", "academics", catalogText("localRecordRegistry.10.tu-courses-registration.2")),
  record("tu:courses:transcript", "academics", catalogText("localRecordRegistry.11.tu-courses-transcript.2")),
  record("tu:academics:drafts", "academics", catalogText("localRecordRegistry.12.tu-academics-drafts.2"), { kind: "draft" }),
  record("tu:academics:submissions", "academics", catalogText("localRecordRegistry.13.tu-academics-submissions.2")),
  record("tu:academics:exam-session", "academics", catalogText("localRecordRegistry.14.tu-academics-exam-session.2"), { kind: "draft" }),
  record("tu:academics:exam-attempts", "academics", catalogText("localRecordRegistry.15.tu-academics-exam-attempts.2")),
  record("tu:academics:projects", "academics", catalogText("localRecordRegistry.16.tu-academics-projects.2")),
  record("tu:academics:defences", "academics", catalogText("localRecordRegistry.17.tu-academics-defences.2")),
  record("tu:governance:votes", "academics", catalogText("localRecordRegistry.18.tu-governance-votes.2")),

  record("tu:library:loans", "library", catalogText("localRecordRegistry.19.tu-library-loans.2")),
  record("tu:library:holds", "library", catalogText("localRecordRegistry.20.tu-library-holds.2")),
  record("tu:appraisal:drafts", "library", catalogText("localRecordRegistry.21.tu-appraisal-drafts.2"), { kind: "draft" }),
  record("tu:appraisal:records", "library", catalogText("localRecordRegistry.22.tu-appraisal-records.2")),

  record("tu:bbs:draft", "campus", catalogText("localRecordRegistry.23.tu-bbs-draft.2"), { kind: "draft" }),
  record("tu:bbs:posts", "campus", catalogText("localRecordRegistry.24.tu-bbs-posts.2")),
  record("tu:housing:draft", "campus", catalogText("localRecordRegistry.25.tu-housing-draft.2"), { kind: "draft" }),
  record("tu:housing:applications", "campus", catalogText("localRecordRegistry.26.tu-housing-applications.2")),
  record("tu:housing:assignments", "campus", catalogText("localRecordRegistry.27.tu-housing-assignments.2")),
  record("tu:housing:room-changes", "campus", catalogText("localRecordRegistry.28.tu-housing-room-changes.2")),
  record("tu:clinic:triage-draft", "campus", catalogText("localRecordRegistry.29.tu-clinic-triage-draft.2"), { kind: "draft" }),
  record("tu:clinic:visits", "campus", catalogText("localRecordRegistry.30.tu-clinic-visits.2")),
  record("tu:clinic:prescriptions", "campus", catalogText("localRecordRegistry.31.tu-clinic-prescriptions.2")),
  record("tu:clinic:care-plans", "campus", catalogText("localRecordRegistry.32.tu-clinic-care-plans.2")),
  record("tu:incidents:workbench", "campus", catalogText("localRecordRegistry.33.tu-incidents-workbench.2"), { kind: "draft" }),
  record("tu:incidents:experiments", "campus", catalogText("localRecordRegistry.34.tu-incidents-experiments.2")),
  record("tu:incidents:resolutions", "campus", catalogText("localRecordRegistry.35.tu-incidents-resolutions.2")),
  record("tu:festival:draft", "campus", catalogText("localRecordRegistry.36.tu-festival-draft.2"), { kind: "draft" }),
  record("tu:festival:plans", "campus", catalogText("localRecordRegistry.37.tu-festival-plans.2")),
  record("tu:festival:operations", "campus", catalogText("localRecordRegistry.38.tu-festival-operations.2")),

  record("tu:spellcards:draft", "research", catalogText("localRecordRegistry.39.tu-spellcards-draft.2"), { kind: "draft" }),
  record("tu:spellcards:designs", "research", catalogText("localRecordRegistry.40.tu-spellcards-designs.2")),
  record("tu:spellcards:defences", "research", catalogText("localRecordRegistry.41.tu-spellcards-defences.2")),
  record("tu:ethics:drafts", "research", catalogText("localRecordRegistry.42.tu-ethics-drafts.2"), { kind: "draft" }),
  record("tu:ethics:protocols", "research", catalogText("localRecordRegistry.43.tu-ethics-protocols.2")),
  record("tu:ethics:reviews", "research", catalogText("localRecordRegistry.44.tu-ethics-reviews.2")),

  record("tu:fieldwork:draft", "fieldwork", catalogText("localRecordRegistry.45.tu-fieldwork-draft.2"), { kind: "draft" }),
  record("tu:fieldwork:placements", "fieldwork", catalogText("localRecordRegistry.46.tu-fieldwork-placements.2")),
  record("tu:fieldwork:passport", "fieldwork", catalogText("localRecordRegistry.47.tu-fieldwork-passport.2")),

  record("tu:property:claims", "commons", catalogText("localRecordRegistry.48.tu-property-claims.2")),
  record("tu:post:state", "commons", catalogText("localRecordRegistry.49.tu-post-state.2")),
  record("tu:post:dispatches", "commons", catalogText("localRecordRegistry.50.tu-post-dispatches.2")),
  record("tu:calendar:bookmarks", "commons", catalogText("localRecordRegistry.51.tu-calendar-bookmarks.2")),

  record("tu:graduation:audits", "careers", catalogText("localRecordRegistry.52.tu-graduation-audits.2")),
  record("tu:graduation:degrees", "careers", catalogText("localRecordRegistry.53.tu-graduation-degrees.2")),
  record("tu:careers:draft", "careers", catalogText("localRecordRegistry.54.tu-careers-draft.2"), { kind: "draft" }),
  record("tu:careers:plans", "careers", catalogText("localRecordRegistry.55.tu-careers-plans.2")),
  record("tu:employment:draft", "careers", catalogText("localRecordRegistry.56.tu-employment-draft.2"), { kind: "draft" }),
  record("tu:employment:applications", "careers", catalogText("localRecordRegistry.57.tu-employment-applications.2")),
  record("tu:employment:attestations", "careers", catalogText("localRecordRegistry.58.tu-employment-attestations.2")),
  record("tu:alumni:profile", "careers", catalogText("localRecordRegistry.59.tu-alumni-profile.2")),

  record("tu:locale", "preferences", catalogText("localRecordRegistry.60.tu-locale.2"), { kind: "preference", scope: "interface", encoding: "text" }),
  record("tu:audience", "preferences", catalogText("localRecordRegistry.61.tu-audience.2"), { kind: "preference", scope: "interface", encoding: "text" }),
  record("tu:mytu:selected-application", "preferences", catalogText("localRecordRegistry.62.tu-mytu-selected-application.2"), { kind: "preference", scope: "interface", encoding: "text" }),
  record("tu:academics:selected-assignment", "preferences", catalogText("localRecordRegistry.63.tu-academics-selected-assignment.2"), { kind: "preference", scope: "interface", encoding: "text" }),
  record("tu:academics:selected-project", "preferences", catalogText("localRecordRegistry.64.tu-academics-selected-project.2"), { kind: "preference", scope: "interface", encoding: "text" }),
  record("tu:governance:selected", "preferences", catalogText("localRecordRegistry.65.tu-governance-selected.2"), { kind: "preference", scope: "interface", encoding: "text" }),
  record("tu:incidents:last-case", "preferences", catalogText("localRecordRegistry.66.tu-incidents-last-case.2"), { kind: "preference", scope: "interface", encoding: "text" }),

  record("tu:campus:ledger", "system", catalogText("localRecordRegistry.67.tu-campus-ledger.2"), { kind: "ledger" }),

  record("tu:phantasm:state", "dream", catalogText("localRecordRegistry.68.tu-phantasm-state.2"), { scope: "dream" }),
  record("tu:phantasm:transcripts", "dream", catalogText("localRecordRegistry.69.tu-phantasm-transcripts.2"), { scope: "dream" }),
  record("tu:phantasm:exam:draft", "dream", catalogText("localRecordRegistry.70.tu-phantasm-exam-draft.2"), { kind: "draft", scope: "dream" }),
  record("tu:phantasm:exam:attempts", "dream", catalogText("localRecordRegistry.71.tu-phantasm-exam-attempts.2"), { scope: "dream" }),
  record("tu:phantasm:boundary", "dream", catalogText("localRecordRegistry.72.tu-phantasm-boundary.2"), { scope: "dream" }),
  record(
    "tu:phantasm:pass",
    "dream",
    catalogText("localRecordRegistry.73.tu-phantasm-pass.2"),
    { storage: "session", portable: false, kind: "session", scope: "session" },
  ),
];

export const localRecordKinds = {
  record: catalogText("localRecordKinds.record"),
  draft: catalogText("localRecordKinds.draft"),
  preference: catalogText("localRecordKinds.preference"),
  ledger: catalogText("localRecordKinds.ledger"),
  session: catalogText("localRecordKinds.session"),
};

export const localRecordScopes = {
  device: catalogText("localRecordScopes.device"),
  interface: catalogText("localRecordScopes.interface"),
  dream: catalogText("localRecordScopes.dream"),
  session: catalogText("localRecordScopes.session"),
};
