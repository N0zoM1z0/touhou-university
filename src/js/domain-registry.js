import { schools } from "../data/schools.js";
import { facultyProfiles } from "../data/faculty.js";
import { researchFiles } from "../data/research.js";
import { campusFeatures, clubs } from "../data/campus.js";
import { seededPosts } from "../data/community.js";
import { campusHistory } from "../data/campus-history.js";
import { courseCatalogue } from "../data/courses.js";
import { libraryHoldings } from "../data/library.js";
import { residences, roommateProfiles } from "../data/housing.js";
import { incidentCases } from "../data/incidents.js";
import { clinicMedicines, clinicTherapies } from "../data/clinic.js";
import { appraisalObjects } from "../data/appraisal.js";
import { spellPatterns } from "../data/spellcard-workshop.js";
import { ethicsCases, ethicsOutcomeLabels } from "../data/ethics.js";
import { festivalKinds, festivalLocalized, festivalRoutes } from "../data/festival.js";
import { fieldworkLocalized, fieldworkStations } from "../data/fieldwork.js";
import { propertyItems, propertyLocalized } from "../data/property.js";
import { academicCalendarEvents, academicCalendarLocalized } from "../data/academic-calendar.js";
import { alumniChapters, careerOpenings, careersLocalized } from "../data/careers.js";
import { employmentJobs, employmentLocalized } from "../data/employment.js";
import { phantasmCourses } from "../data/phantasm.js";
import {
  orientationFirstStops,
  orientationLocalized,
  orientationNoticePlans,
  orientationSeason,
  orientationStopSignals,
} from "../data/orientation.js";
import {
  dossiersForCharacter,
  dossiersForVersion,
  knowledgeCharacters,
  knowledgeDossiers,
  knowledgeVersions,
} from "../data/knowledge-graph.js";
import { incidentCommunityPosts } from "./incident-model.js";
import { governanceCommunityPosts } from "./governance-model.js";
import { academicCommunityPosts } from "./academic-model.js";
import { clinicCommunityPosts } from "./clinic-model.js";
import { appraisalCommunityPosts } from "./appraisal-model.js";
import { spellcardCommunityPosts } from "./spellcard-workshop-model.js";
import { ethicsCommunityPosts, ethicsProtocols } from "./ethics-model.js";
import {
  festivalCommunityPosts,
  festivalOutcomeLabels,
  festivalPlans,
} from "./festival-model.js";
import { fieldworkCommunityPosts, fieldworkPlacements } from "./fieldwork-model.js";
import { propertyClaims, propertyCommunityPosts } from "./property-model.js";
import { postCommunityPosts, postDispatches } from "./post-model.js";
import { academicCalendarBookmarks, academicCalendarCommunityPosts } from "./academic-calendar-model.js";
import {
  alumniProfile,
  careerPlans,
  careersCommunityPosts,
  graduationAudits,
  graduationDegrees,
} from "./careers-model.js";
import {
  employmentApplications,
  employmentAttestations,
  employmentCommunityPosts,
} from "./employment-model.js";
import { phantasmCommunityPosts } from "./phantasm-model.js";
import { phantasmGateProgress, phantasmGateState } from "./phantasm-gate.js";
import { orientationCommunityPosts, orientationDossiers } from "./orientation-model.js";

const entry = (route, category, title, description, source, priority = 0) => ({
  route,
  category,
  title,
  description,
  source,
  priority,
});

const domainManifests = [
  {
    id: "academics",
    search(locale) {
      return [
        ...Object.entries(schools).map(([id, school]) =>
          entry(`school-${id}`, "school", school.name[locale], school.overview[locale], school, 80)),
        ...Object.entries(facultyProfiles).map(([id, profile]) =>
          entry(`faculty-${id}`, "faculty", profile.name[locale], profile.role[locale], profile, 75)),
        ...courseCatalogue.map((course) =>
          entry(
            `course-${course.code}`,
            "course",
            `${course.code} · ${course.title[locale]}`,
            `${course.instructor[locale]} · ${course.note[locale]}`,
            course,
            72,
          )),
      ];
    },
    community: academicCommunityPosts,
    communityPriority: 30,
    changeEvents: ["tu:academicchange"],
  },
  {
    id: "orientation",
    search(locale) {
      const filed = locale === "ja" ? "到着記録" : locale === "en" ? "Arrival file" : "到着記錄";
      const open = locale === "ja" ? "手続中" : locale === "en" ? "Arrival in progress" : "報到辦理中";
      return [
        entry("welcome", "orientation", orientationLocalized(orientationSeason.title, locale), orientationLocalized(orientationSeason.premise, locale), orientationSeason, 84),
        ...orientationStopSignals.map((signal) => entry("orientation-boundary", "orientation", orientationLocalized(signal.name, locale), orientationLocalized(signal.detail, locale), signal, 64)),
        ...orientationNoticePlans.map((notice) => entry("orientation-boundary", "orientation", orientationLocalized(notice.name, locale), orientationLocalized(notice.detail, locale), notice, 62)),
        ...orientationFirstStops.map((stop) => entry("orientation-first-bell", "orientation", orientationLocalized(stop.name, locale), orientationLocalized(stop.detail, locale), stop, 66)),
        ...orientationDossiers().map((dossier) => entry(`orientation-dossier-${dossier.id}`, "orientation", `${dossier.status === "matriculated" ? filed : open} · ${dossier.id}`, orientationLocalized(orientationSeason.premise, locale), dossier, 88)),
      ];
    },
    community: orientationCommunityPosts,
    communityPriority: 67,
    changeEvents: ["tu:orientationchange"],
  },
  {
    id: "research",
    search(locale) {
      return [
        ...Object.entries(researchFiles).map(([id, file]) =>
          entry(`research-${id}`, "research", file.title[locale], file.summary[locale], file, 70)),
        ...spellPatterns.map((pattern) =>
          entry("spellcard-workshop", "workshop", pattern.name[locale], pattern.premise[locale], pattern, 71)),
      ];
    },
    community: spellcardCommunityPosts,
    communityPriority: 60,
    changeEvents: ["tu:spellcardchange"],
  },
  {
    id: "ethics",
    search(locale) {
      return [
        ...ethicsCases.map((caseFile) =>
          entry(
            `ethics-case-${caseFile.id}`,
            "ethics",
            `${caseFile.code} · ${caseFile.title[locale]}`,
            caseFile.conflict[locale],
            caseFile,
            82,
          )),
        ...ethicsProtocols().map((protocol) =>
          entry(
            `ethics-protocol-${protocol.id}`,
            "ethics",
            protocol.draft.title,
            `${ethicsOutcomeLabels[protocol.status === "withdrawn" ? "withdrawn" : protocol.outcome][locale]} · v${protocol.revision}`,
            protocol,
            86,
          )),
      ];
    },
    community: ethicsCommunityPosts,
    communityPriority: 65,
    changeEvents: ["tu:ethicschange"],
  },
  {
    id: "festival",
    search(locale) {
      return [
        ...festivalKinds.map((kind) =>
          entry(
            "festival-operations",
            "festival",
            `${kind.code} · ${festivalLocalized(kind.name, locale)}`,
            festivalLocalized(kind.premise, locale),
            kind,
            77,
          )),
        ...festivalRoutes.map((route) =>
          entry(
            "festival-operations",
            "festival",
            festivalLocalized(route.name, locale),
            festivalLocalized(route.detail, locale),
            route,
            54,
          )),
        ...festivalPlans().map((plan) =>
          entry(
            `festival-plan-${plan.id}`,
            "festival",
            plan.draft.title || festivalLocalized(
              festivalKinds.find(({ id }) => id === plan.draft.kindId)?.name,
              locale,
            ),
            `${festivalLocalized(festivalOutcomeLabels[plan.outcome], locale)} · ${plan.id}`,
            plan,
            83,
          )),
      ];
    },
    community: festivalCommunityPosts,
    communityPriority: 66,
    changeEvents: ["tu:festivalchange"],
  },
  {
    id: "fieldwork",
    search(locale) {
      return [
        ...fieldworkStations.map((station) =>
          entry(
            `fieldwork-station-${station.id}`,
            "fieldwork",
            `${station.code} · ${fieldworkLocalized(station.name, locale)}`,
            `${fieldworkLocalized(station.premise, locale)} · ${fieldworkLocalized(station.supervisor, locale)}`,
            station,
            79,
          )),
        ...fieldworkPlacements().map((placement) => {
          const station = fieldworkStations.find(({ id }) => id === placement.stationId);
          return entry(
            `fieldwork-placement-${placement.id}`,
            "fieldwork",
            `${station?.code || "FW"} · ${fieldworkLocalized(station?.name, locale)}`,
            `${placement.id} · ${placement.status}`,
            placement,
            85,
          );
        }),
      ];
    },
    community: fieldworkCommunityPosts,
    communityPriority: 68,
    changeEvents: ["tu:fieldworkchange"],
  },
  {
    id: "commons",
    search(locale) {
      return [
        ...propertyItems.map((item) =>
          entry(
            `property-item-${item.id}`,
            "property",
            `${item.code} · ${propertyLocalized(item.name, locale)}`,
            `${propertyLocalized(item.statement, locale)} · ${propertyLocalized(item.dispute, locale)}`,
            item,
            78,
          )),
        ...propertyClaims().map((claim) =>
          entry(
            `property-claim-${claim.id}`,
            "property",
            `${claim.id} · ${propertyLocalized(propertyItems.find(({ id }) => id === claim.itemId)?.name, locale)}`,
            `${claim.claimant} · ${claim.status}`,
            claim,
            84,
          )),
        ...postDispatches().map((dispatch) =>
          entry(
            `post-dispatch-${dispatch.id}`,
            "post",
            dispatch.subject,
            `${dispatch.recipient} · ${dispatch.body}`,
            dispatch,
            64,
          )),
      ];
    },
    community(locale) {
      return [...propertyCommunityPosts(locale), ...postCommunityPosts(locale)];
    },
    communityPriority: 69,
    changeEvents: ["tu:propertychange", "tu:postchange"],
  },
  {
    id: "calendar",
    search(locale) {
      const saved = new Set(academicCalendarBookmarks().map(({ eventId }) => eventId));
      return academicCalendarEvents.map((event) =>
        entry(
          `calendar-event-${event.id}`,
          "calendar",
          `${event.code} · ${academicCalendarLocalized(event.title, locale)}`,
          `${academicCalendarLocalized(event.window, locale)} · ${academicCalendarLocalized(event.premise, locale)}`,
          event,
          saved.has(event.id) ? 81 : 73,
        ));
    },
    community: academicCalendarCommunityPosts,
    communityPriority: 57,
    changeEvents: ["tu:calendarchange"],
  },
  {
    id: "careers",
    search(locale) {
      const profile = alumniProfile();
      return [
        ...careerOpenings.map((opening) =>
          entry(
            `career-opening-${opening.id}`,
            "career",
            `${opening.code} · ${careersLocalized(opening.title, locale)}`,
            `${careersLocalized(opening.institution, locale)} · ${careersLocalized(opening.friction, locale)}`,
            opening,
            78,
          )),
        ...employmentJobs.map((job) =>
          entry(
            `employment-job-${job.id}`,
            "career",
            `${job.code} · ${employmentLocalized(job.title, locale)}`,
            `${employmentLocalized(job.employer, locale)} · ${employmentLocalized(job.clause, locale)}`,
            job,
            81,
          )),
        ...alumniChapters.map((chapter) =>
          entry(
            `alumni-chapter-${chapter.id}`,
            "alumni",
            careersLocalized(chapter.name, locale),
            `${careersLocalized(chapter.steward, locale)} · ${careersLocalized(chapter.unresolved, locale)}`,
            chapter,
            69,
          )),
        ...graduationAudits().map((audit) =>
          entry(`graduation-audit-${audit.id}`, "graduation", audit.id, `${audit.schoolId} · ${audit.outcome}`, audit, 85)),
        ...graduationDegrees().map((degree) =>
          entry(`graduation-degree-${degree.id}`, "graduation", degree.degreeNumber, degree.unresolvedQuestion, degree, 87)),
        ...careerPlans().map((plan) =>
          entry(`career-plan-${plan.id}`, "career", plan.id, plan.profile.question, plan, 83)),
        ...employmentApplications().map((application) => {
          const job = employmentJobs.find(({ id }) => id === application.jobId);
          return entry(
            `employment-application-${application.id}`,
            "career",
            `${application.id} · ${employmentLocalized(job?.title, locale)}`,
            `${application.profile.displayName} · ${application.decisionId}`,
            application,
            86,
          );
        }),
        ...employmentAttestations().map((attestation) =>
          entry(
            "employment-outcomes",
            "career",
            attestation.displayName,
            `${attestation.outcomeId} · ${attestation.note}`,
            attestation,
            82,
          )),
        ...(profile ? [entry(`alumni-chapter-${profile.chapterId}`, "alumni", profile.displayName, profile.unresolvedQuestion, profile, 84)] : []),
      ];
    },
    community(locale) {
      return [...employmentCommunityPosts(locale), ...careersCommunityPosts(locale)];
    },
    communityPriority: 71,
    changeEvents: ["tu:careerschange", "tu:employmentchange"],
  },
  {
    id: "campus",
    search(locale) {
      return [
        ...Object.entries(clubs).map(([id, club]) =>
          entry(`club-${id}`, "club", club.name[locale], club.description[locale], club, 45)),
        ...seededPosts.map(([category, author, title, body], id) =>
          entry(`bbs-seed-${id}`, "bbs", title[locale], `${author[locale]} · ${body[locale]}`, [author, title, body, category], 20)),
        ...Object.entries(campusFeatures).map(([id, feature]) =>
          entry(`campus-${id}`, "section", feature.title[locale], feature.summary[locale], feature, 35)),
        ...campusHistory.map((record) =>
          entry(
            `chronicle-${record.id}`,
            "history",
            record.title[locale],
            `${record.era[locale]} · ${record.summary[locale]}`,
            record,
            55,
          )),
      ];
    },
  },
  {
    id: "library",
    search(locale) {
      return libraryHoldings.map((holding) =>
        entry(
          `library-${holding.id}`,
          "library",
          `${holding.callNumber} · ${holding.title[locale]}`,
          `${holding.author[locale]} · ${holding.note[locale]}`,
          holding,
          68,
        ));
    },
  },
  {
    id: "appraisal",
    search(locale) {
      return appraisalObjects.map((object) =>
        entry(
          `appraisal-object-${object.id}`,
          "appraisal",
          `${object.code} · ${object.name[locale]}`,
          `${object.workingTitle[locale]} · ${object.condition[locale]}`,
          object,
          70,
        ));
    },
    community: appraisalCommunityPosts,
    communityPriority: 50,
    changeEvents: ["tu:appraisalchange"],
  },
  {
    id: "housing",
    search(locale) {
      return [
        ...residences.map((residence) =>
          entry(
            `housing-residence-${residence.id}`,
            "housing",
            residence.name[locale],
            `${residence.area[locale]} · ${residence.description[locale]}`,
            residence,
            67,
          )),
        ...roommateProfiles.map((profile) =>
          entry(
            "housing-application",
            "housing",
            profile.name[locale],
            `${profile.kind[locale]} · ${profile.school[locale]} · ${profile.bio[locale]}`,
            profile,
            42,
          )),
      ];
    },
  },
  {
    id: "incidents",
    search(locale) {
      return [
        ...incidentCommunityPosts(locale).map((post) =>
          entry(`bbs-${post.id}`, "bbs", post.title, `${post.author} · ${post.body}`, post, 76)),
        ...incidentCases.map((incident) =>
          entry(
            `incident-case-${incident.id}`,
            "incident",
            `${incident.code} · ${incident.title[locale]}`,
            `${incident.location[locale]} · ${incident.lede[locale]}`,
            incident,
            78,
          )),
      ];
    },
    community: incidentCommunityPosts,
    communityPriority: 10,
    changeEvents: ["tu:incidentchange"],
  },
  {
    id: "hieda",
    search(locale) {
      return [
        ...knowledgeDossiers.map((dossier) =>
          entry(
            `hieda-event-${dossier.id}`,
            "knowledge",
            dossier.title[locale],
            `${dossier.code} · ${dossier.lead[locale]}`,
            dossier,
            84,
          )),
        ...knowledgeCharacters
          .filter((character) => dossiersForCharacter(character.id).length)
          .map((character) =>
            entry(
              `hieda-character-${character.id}`,
              "knowledge",
              character.name[locale],
              `${dossiersForCharacter(character.id).length} · ${character.role[locale]}`,
              character,
              79,
            )),
        ...knowledgeVersions().map((record) =>
          entry(
            `hieda-version-${record.id}`,
            "knowledge",
            record.title[locale],
            `${record.archiveId} · ${dossiersForVersion(record.id).length}`,
            record,
            65,
          )),
      ];
    },
    changeEvents: ["tu:ledgerchange"],
  },
  {
    id: "governance",
    community: governanceCommunityPosts,
    communityPriority: 20,
    changeEvents: ["tu:governancechange"],
  },
  {
    id: "clinic",
    search(locale) {
      return [
        ...Object.values(clinicMedicines).map((medicine) =>
          entry(
            `clinic-medicine-${medicine.id}`,
            "clinic",
            `${medicine.code} · ${medicine.name[locale]}`,
            `${medicine.indication[locale]} · ${medicine.caution[locale]}`,
            medicine,
            69,
          )),
        ...Object.values(clinicTherapies).map((therapy) =>
          entry(
            "clinic-recovery",
            "clinic",
            therapy.name[locale],
            `${therapy.clinician[locale]} · ${therapy.lead[locale]}`,
            therapy,
            61,
          )),
      ];
    },
    community: clinicCommunityPosts,
    communityPriority: 40,
    changeEvents: ["tu:clinicchange"],
  },
  {
    id: "phantasm",
    search(locale) {
      const progress = phantasmGateProgress();
      const state = phantasmGateState();
      if (state.unlockedAt) {
        return [
          entry(
            "phantasm-campus",
            "phantasm",
            locale === "ja" ? "夢境キャンパス／第九時限" : locale === "en" ? "Dream Campus / Ninth Period" : "夢境校區／第九節",
            locale === "ja"
              ? "未選経路学籍、裏側地図、夢科目と逆答弁"
              : locale === "en"
                ? "Untaken-route transcript, reverse map, dream courses, and reverse viva"
                : "未選路線學籍、裏側地圖、夢課與反向答辯",
            phantasmCourses,
            88,
          ),
          ...phantasmCourses.map((course) =>
            entry(
              `phantasm-course-${course.id}`,
              "phantasm",
              `${course.id} · ${course.title[locale]}`,
              `${course.teacher[locale]} · ${course.syllabus[locale]}`,
              course,
              58,
            )),
        ];
      }
      if (progress.eligible) {
        return [entry(
          "phantasm-campus",
          "phantasm",
          locale === "ja" ? "第九件（索引は否認）" : locale === "en" ? "Result Nine (index denies it)" : "第九筆（索引否認）",
          locale === "ja"
            ? "六つの裏印は揃ったが、検索先は日付・月相・当番鐘で移動する。"
            : locale === "en"
              ? "Six reverse seals are present, but the result moves with date, lunar phase, and duty bell."
              : "六枚反面印已齊，但查詢位置會隨日期、月相與當值校鐘移動。",
          ["第九節", "第九時限", "ninth period", "夢境", "dream", "phantasm", "反面", "reverse"],
          32,
        )];
      }
      if (progress.count >= 2) {
        return [entry(
          "my-tu",
          "phantasm",
          locale === "ja" ? "第九時限（登録なし）" : locale === "en" ? "Ninth Period (no registration)" : "第九節（無此課號）",
          locale === "ja"
            ? `検索索引の一行が削除を拒否。裏から印が${progress.count}個透けている。`
            : locale === "en"
              ? `One search-index row refuses deletion; ${progress.count} seals show through its reverse.`
              : `搜尋索引有一行拒絕刪除；背面透出 ${progress.count} 枚印章。`,
          ["第九節", "第九時限", "ninth period", "夢境校區", "dream campus", "phantasm"],
          14,
        )];
      }
      return [];
    },
    community: phantasmCommunityPosts,
    communityPriority: 70,
    changeEvents: ["tu:phantasmchange", "tu:phantasmboundarychange"],
    officialLedger: false,
  },
];

export const campusDomainRegistry = Object.freeze(
  domainManifests.map((manifest) => Object.freeze(manifest)),
);

export function domainSearchEntries(locale) {
  return campusDomainRegistry.flatMap((manifest) => manifest.search?.(locale) || []);
}

export function domainCommunityPosts(locale) {
  return campusDomainRegistry
    .slice()
    .sort((a, b) => (b.communityPriority || 0) - (a.communityPriority || 0))
    .flatMap((manifest) =>
    (manifest.community?.(locale) || []).map((post) => ({ ...post, domain: manifest.id })),
    );
}

export const domainCommunityChangeEvents = Object.freeze([
  ...new Set(campusDomainRegistry.flatMap((manifest) => manifest.changeEvents || [])),
]);

export function campusDomain(id) {
  return campusDomainRegistry.find((manifest) => manifest.id === id) || null;
}
