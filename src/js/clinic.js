import { trees as catalogTrees } from "../generated/i18n/ui/clinic.js";
import {
  clinicCategories,
  clinicComplaint,
  clinicComplaints,
  clinicMedicine,
  clinicMedicines,
  clinicSites,
  clinicTherapy,
  clinicTherapies,
} from "../data/clinic.js";
import { recordCampusEvent } from "./campus-ledger.js";
import {
  CLINIC_KEYS,
  clinicCarePlans,
  clinicCommunityPosts,
  clinicDraft,
  clinicIdentity,
  clinicOperationalBoard,
  clinicPrescriptions,
  clinicStats,
  clinicVisits,
  completeClinicCareStep,
  completeClinicConsultation,
  dispenseClinicPrescription,
  prescriptionCourse,
  recordClinicDose,
  saveClinicDraft,
  startClinicCarePlan,
  submitClinicTriage,
} from "./clinic-model.js";
import { bindImeSafeInput } from "./ime-input.js";
import { getLocale } from "./i18n.js";
import { renderPreservingState } from "./render-state.js";
import { printDocument } from "./print-document.js";
import { showToast } from "./ui.js";
import { safeDecodeFragment } from "./url-state.js";

const copy = catalogTrees["copy"];

const app = document.querySelector("[data-clinic-app]");
let medicineSearch = "";
let medicineCategory = "all";
let draftTimer;
let clockTimer;

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value, locale, withTime = true) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, withTime ? { dateStyle: "medium", timeStyle: "short" } : { dateStyle: "medium" }).format(date);
}

function currentRoute() {
  return safeDecodeFragment(window.location.hash.slice(1) || "clinic");
}

function modeForRoute(route) {
  if (route === "clinic-pharmacy" || route.startsWith("clinic-medicine-")) return "pharmacy";
  if (route === "clinic-recovery") return "recovery";
  if (route === "clinic-account" || route.startsWith("clinic-visit-") || route.startsWith("clinic-prescription-")) return "account";
  return "triage";
}

function phaseName(phase, locale) {
  const values = catalogTrees["values"];
  return values[locale][phase] || values[locale][0];
}

function clinicHeader(locale, c, board, mode) {
  const stats = clinicStats();
  return `
    <header class="clinic-hero">
      <div class="clinic-hero-media">
        <img src="assets/images/map/eientei-clinic.webp" srcset="assets/images/map/eientei-clinic-mobile.webp 640w, assets/images/map/eientei-clinic.webp 1280w" sizes="(max-width: 700px) 100vw, 48vw" alt="" width="1280" height="853">
        <span>24H · TU-MED-88</span>
      </div>
      <div class="clinic-hero-copy">
        <p>${c.eyebrow}</p>
        <h2>${c.title}</h2>
        <span>${c.lead}</span>
        <a class="clinic-start-care" href="#clinic-triage-desk"><strong>${c.startCare}</strong><small>${c.startCareLead}</small><i aria-hidden="true">↓</i></a>
        <dl>
          <div><dt>${c.open}</dt><dd><i></i>${clinicSites.eientei.hours[locale].split("；")[0].split("・")[0].split(";")[0]}</dd></div>
          <div><dt>${c.load}</dt><dd>${c[board.load]}</dd></div>
          <div><dt>${c.moon}</dt><dd>${phaseName(board.snapshot.phase, locale)}</dd></div>
          <div><dt>${c.localRecords}</dt><dd>${stats.visits + stats.prescriptions + stats.activePlans + stats.completedPlans}</dd></div>
        </dl>
      </div>
    </header>
    <nav class="clinic-tabs" aria-label="${c.eyebrow}">
      <a href="#clinic" ${mode === "triage" ? 'aria-current="page"' : ""}>${c.navTriage}<span>${stats.waiting}</span></a>
      <a href="#clinic-pharmacy" ${mode === "pharmacy" ? 'aria-current="page"' : ""}>${c.navPharmacy}<span>${stats.activePrescriptions}</span></a>
      <a href="#clinic-recovery" ${mode === "recovery" ? 'aria-current="page"' : ""}>${c.navRecovery}<span>${stats.activePlans}</span></a>
      <a href="#clinic-account" ${mode === "account" ? 'aria-current="page"' : ""}>${c.navAccount}<span>${stats.visits}</span></a>
    </nav>`;
}

function siteCards(locale, c) {
  return `
    <section class="clinic-network">
      <header><div><p>CARE SITES / TU-MED</p><h3>${c.careNetwork}</h3></div><span>${c.careNetworkLead}</span></header>
      <div>${Object.values(clinicSites).map((site) => `
        <article>
          <header><i>${site.glyph}</i><div><small>${site.code}</small><h4>${site.name[locale]}</h4><span>${site.location[locale]}</span></div></header>
          <dl>
            <div><dt>${c.hours}</dt><dd>${site.hours[locale]}</dd></div>
            <div><dt>${c.scope}</dt><dd>${site.scope[locale]}</dd></div>
            <div><dt>${c.staff}</dt><dd>${site.staff[locale]}</dd></div>
          </dl>
          ${site.id === "eientei" ? `<a href="campus.html#map-eientei">${c.map}<span>↗</span></a>` : ""}
        </article>`).join("")}</div>
    </section>`;
}

function queueBoard(locale, c, board) {
  return `
    <section class="clinic-queue">
      <header><div><p>LIVE WAITING BOARD</p><h3>${c.waitingBoard}</h3></div><span>${c.waitingLead}</span></header>
      <div class="clinic-queue-grid" data-preserve-scroll="clinic-queue">
        ${board.queue.map((patient) => `
          <article class="${patient.local ? "local" : ""}">
            <span class="clinic-token"><i>${patient.glyph}</i><small>${c.token}</small><b>${escapeHtml(patient.token)}</b></span>
            <div><h4>${escapeHtml(patient.name[locale])}</h4><p>${escapeHtml(patient.reason[locale])}</p>
              <details><summary>${c.detail}</summary><span>${escapeHtml(patient.note[locale])}</span></details>
            </div>
            <strong>${c.estimated}<b>${patient.minutes}</b>${c.minutes}</strong>
            ${patient.visitId ? `<button type="button" data-clinic-consult="${escapeHtml(patient.visitId)}">${c.takeVisit}<span>→</span></button>` : ""}
          </article>`).join("")}
      </div>
    </section>`;
}

function triageForm(locale, c) {
  const draft = clinicDraft()?.answers || {
    complaints: [],
    intensity: 1,
    onset: "today",
    mobility: "independent",
    lunarSensitive: false,
    residueContained: true,
    notes: "",
  };
  return `
    <section class="clinic-triage" id="clinic-triage-desk">
      <header><div><p>TRIAGE DESK / 端末 01</p><h3>${c.triage}</h3></div><span>${c.triageLead}</span></header>
      <form data-clinic-triage-form>
        <fieldset class="clinic-complaints">
          <legend>${c.complaint}<small>${c.complaintHint}</small></legend>
          <div>${Object.values(clinicComplaints).map((complaint) => `
            <label>
              <input type="checkbox" name="complaints" value="${complaint.id}" ${draft.complaints.includes(complaint.id) ? "checked" : ""}>
              <i>${complaint.glyph}</i><span><strong>${complaint.name[locale]}</strong><small>${complaint.prompt[locale]}</small></span>
            </label>`).join("")}</div>
        </fieldset>
        <div class="clinic-triage-fields">
          <label>${c.intensity}
            <select name="intensity">${c.intensityOptions.map((label, index) => `<option value="${index + 1}" ${draft.intensity === index + 1 ? "selected" : ""}>${index + 1} · ${label}</option>`).join("")}</select>
          </label>
          <label>${c.onset}
            <select name="onset">${Object.entries(c.onsetOptions).map(([id, label]) => `<option value="${id}" ${draft.onset === id ? "selected" : ""}>${label}</option>`).join("")}</select>
          </label>
          <label>${c.mobility}
            <select name="mobility">${Object.entries(c.mobilityOptions).map(([id, label]) => `<option value="${id}" ${draft.mobility === id ? "selected" : ""}>${label}</option>`).join("")}</select>
          </label>
          <label class="clinic-triage-check"><input type="checkbox" name="lunarSensitive" ${draft.lunarSensitive ? "checked" : ""}><span>${c.lunarSensitive}</span></label>
          <label class="clinic-triage-check"><input type="checkbox" name="residueContained" ${draft.residueContained ? "checked" : ""}><span>${c.residueContained}</span></label>
          <label class="clinic-triage-notes">${c.notes}<textarea name="notes" rows="4" maxlength="500" placeholder="${c.notesPlaceholder}">${escapeHtml(draft.notes)}</textarea></label>
        </div>
        <footer>
          <span>${clinicIdentity()?.id ? `${escapeHtml(clinicIdentity().name)} · ${escapeHtml(clinicIdentity().id)}` : "LOCAL PATIENT · NO UPLOAD"}</span>
          <button class="button button-secondary" type="button" data-clinic-save-draft>${c.saveDraft}</button>
          <button class="button button-primary" type="submit">${c.checkIn}<span>→</span></button>
        </footer>
      </form>
    </section>`;
}

function activeVisitCard(locale, c) {
  const visit = clinicVisits().findLast((record) => record.status === "waiting");
  if (!visit) return "";
  return `
    <section class="clinic-active-visit" data-priority="${visit.band}">
      <span aria-hidden="true">${visit.band === "urgent" ? "急" : visit.band === "priority" ? "優" : "診"}</span>
      <div><p>${c.activeVisit} · ${escapeHtml(visit.id)}</p><h3>${c.priority[visit.band]}</h3>
        <dl>
          <div><dt>${c.site}</dt><dd>${clinicSites[visit.siteId].name[locale]}</dd></div>
          <div><dt>${c.wait}</dt><dd>${visit.waitMinutes} ${c.minutes}</dd></div>
          <div><dt>${c.clinician}</dt><dd>${c.clinicians[visit.clinicianId]}</dd></div>
          <div><dt>${c.assessment}</dt><dd>${visit.answers.complaints.map((id) => clinicComplaint(id)?.name[locale]).filter(Boolean).join("、")}</dd></div>
        </dl>
      </div>
      <button class="button button-primary" type="button" data-clinic-consult="${escapeHtml(visit.id)}">${c.consultation}<span>→</span></button>
    </section>`;
}

function renderTriage(locale, c, board) {
  return `${activeVisitCard(locale, c)}${siteCards(locale, c)}${queueBoard(locale, c, board)}${triageForm(locale, c)}`;
}

function selectedMedicineId(route) {
  const id = route.replace(/^clinic-medicine-/, "");
  return clinicMedicine(id) ? id : Object.keys(clinicMedicines)[0];
}

function medicineHaystack(medicine) {
  return Object.values(medicine).flatMap((value) => {
    if (typeof value === "string") return [value];
    if (value && typeof value === "object") return Object.values(value).filter((item) => typeof item === "string");
    return [];
  }).join(" ").toLocaleLowerCase();
}

function prescriptionsView(locale, c) {
  const prescriptions = clinicPrescriptions().slice().reverse();
  return `
    <section class="clinic-prescriptions">
      <header><div><p>MY PRESCRIPTIONS</p><h3>${c.myPrescriptions}</h3></div><span>${prescriptions.length}</span></header>
      ${prescriptions.length ? `<div>${prescriptions.map((prescription) => {
        const course = prescriptionCourse(prescription);
        const status = prescription.status === "issued" ? c.issued : prescription.status === "course-complete" ? c.completed : c.dispensed;
        return `
          <article>
            <header><div><small>${escapeHtml(prescription.id)}</small><h4>${clinicSites[prescription.siteId]?.short[locale] || prescription.siteId}</h4></div><b data-status="${prescription.status}">${status}</b></header>
            <div class="clinic-rx-progress"><span><i style="width:${course.percent}%"></i></span><b>${course.completed}/${course.required}</b><small>${c.progress}</small></div>
            <ul>${prescription.medicineIds.map((id) => {
              const medicine = clinicMedicine(id);
              const count = prescription.doseLog.filter((dose) => dose.medicineId === id).length;
              return `<li><i>${medicine.glyph}</i><span><strong>${medicine.name[locale]}</strong><small>${count}/${medicine.courseUnits} · ${medicine.directions[locale]}</small></span>
                ${prescription.status === "dispensed" && count < medicine.courseUnits ? `<button type="button" data-clinic-dose="${id}" data-prescription-id="${prescription.id}">${c.recordDose}</button>` : `<b>✓ ${c.doneDose}</b>`}
              </li>`;
            }).join("")}</ul>
            <footer>
              ${prescription.status === "issued" ? `<button class="button button-primary" type="button" data-clinic-dispense="${prescription.id}">${c.dispense}<span>→</span></button>` : ""}
              <button class="button button-secondary" type="button" data-clinic-receipt="${prescription.id}">${c.printSlip}</button>
            </footer>
          </article>`;
      }).join("")}</div>` : `<p class="clinic-empty">${c.noPrescriptions}</p>`}
    </section>`;
}

function renderPharmacy(locale, c, route) {
  const selectedId = selectedMedicineId(route);
  const selected = clinicMedicine(selectedId);
  const normalizedSearch = medicineSearch.trim().toLocaleLowerCase();
  const filtered = Object.values(clinicMedicines).filter((medicine) => {
    const categoryMatch = medicineCategory === "all" || medicine.category === medicineCategory;
    const searchMatch = !normalizedSearch || medicineHaystack(medicine).includes(normalizedSearch);
    return categoryMatch && searchMatch;
  });
  return `
    <section class="clinic-pharmacy" id="clinic-pharmacy">
      <header class="clinic-section-heading"><div><p>${c.pharmacyEyebrow}</p><h3>${c.pharmacyTitle}</h3></div><span>${c.pharmacyLead}</span></header>
      <div class="clinic-medicine-toolbar">
        <label><span aria-hidden="true">⌕</span><input type="search" value="${escapeHtml(medicineSearch)}" placeholder="${c.searchMedicine}" data-clinic-medicine-search data-preserve-focus="clinic-medicine-search"></label>
        <select data-clinic-category>${`<option value="all">${c.allCategories}</option>` + Object.entries(clinicCategories).map(([id, label]) => `<option value="${id}" ${medicineCategory === id ? "selected" : ""}>${label[locale]}</option>`).join("")}</select>
        <b>${filtered.length} ${c.medicineCount}</b>
      </div>
      <div class="clinic-pharmacy-layout">
        <nav class="clinic-medicine-list" data-preserve-scroll="clinic-medicines">
          ${filtered.length ? filtered.map((medicine) => `
            <a href="#clinic-medicine-${medicine.id}" class="${medicine.id === selectedId ? "active" : ""}">
              <i>${medicine.glyph}</i><span><small>${medicine.code} · ${clinicCategories[medicine.category][locale]}</small><strong>${medicine.name[locale]}</strong></span><b>→</b>
            </a>`).join("") : `<p>${c.noMedicine}</p>`}
        </nav>
        <article class="clinic-medicine-file">
          <header><i>${selected.glyph}</i><div><p>${selected.code} · ${clinicCategories[selected.category][locale]}</p><h4>${selected.name[locale]}</h4></div></header>
          <dl>
            <div><dt>${c.maker}</dt><dd>${selected.maker[locale]}</dd></div>
            <div><dt>${c.indication}</dt><dd>${selected.indication[locale]}</dd></div>
            <div><dt>${c.directions}</dt><dd>${selected.directions[locale]}</dd></div>
            <div class="caution"><dt>${c.caution}</dt><dd>${selected.caution[locale]}</dd></div>
            <div><dt>${c.courseUnits}</dt><dd>${selected.courseUnits} ${c.units}</dd></div>
          </dl>
        </article>
      </div>
    </section>
    ${prescriptionsView(locale, c)}`;
}

function suggestedTherapies() {
  return [...new Set(clinicPrescriptions().flatMap((record) => record.therapyIds || []))];
}

function renderRecovery(locale, c) {
  const plans = clinicCarePlans().slice().reverse();
  const suggested = new Set(suggestedTherapies());
  return `
    <section class="clinic-recovery" id="clinic-recovery">
      <header class="clinic-section-heading"><div><p>${c.recoveryEyebrow}</p><h3>${c.recoveryTitle}</h3></div><span>${c.recoveryLead}</span></header>
      <div class="clinic-therapy-catalogue">
        ${Object.values(clinicTherapies).map((therapy) => {
          const active = plans.some((plan) => plan.therapyId === therapy.id && plan.status === "active");
          return `<article class="${suggested.has(therapy.id) ? "suggested" : ""}">
            <header><i>${therapy.glyph}</i><div>${suggested.has(therapy.id) ? `<small>${c.prescribedTherapies}</small>` : ""}<h4>${therapy.name[locale]}</h4></div></header>
            <p>${therapy.lead[locale]}</p>
            <dl><div><dt>${c.therapyClinician}</dt><dd>${therapy.clinician[locale]}</dd></div><div><dt>${c.steps}</dt><dd>${therapy.steps.length}</dd></div></dl>
            <button class="button ${active ? "button-secondary" : "button-primary"}" type="button" data-clinic-start-therapy="${therapy.id}" ${active ? "disabled" : ""}>${active ? c.activePlans : c.startTherapy}<span>→</span></button>
          </article>`;
        }).join("")}
      </div>
      <section class="clinic-care-plans">
        <header><div><p>ACTIVE CARE SLIPS</p><h3>${c.activePlans}</h3></div><span>${plans.filter((plan) => plan.status === "active").length}</span></header>
        ${plans.length ? plans.map((plan) => {
          const therapy = clinicTherapy(plan.therapyId);
          const progress = Math.round((plan.completedSteps.length / therapy.steps.length) * 100);
          return `<article class="${plan.status === "completed" ? "completed" : ""}">
            <header><div><small>${escapeHtml(plan.id)}</small><h4>${therapy.name[locale]}</h4><span>${therapy.clinician[locale]}</span></div><strong>${progress}%</strong></header>
            <ol>${therapy.steps.map((step, index) => {
              const done = plan.completedSteps.includes(index);
              return `<li class="${done ? "done" : ""}"><span>${done ? "✓" : String(index + 1).padStart(2, "0")}</span><p>${step[locale]}</p>
                ${!done && plan.status === "active" ? `<button type="button" data-clinic-care-step="${index}" data-plan-id="${plan.id}">${c.markStep}</button>` : `<b>${c.stepDone}</b>`}
              </li>`;
            }).join("")}</ol>
          </article>`;
        }).join("") : `<p class="clinic-empty">${c.noPlans}</p>`}
      </section>
    </section>`;
}

function renderAccount(locale, c) {
  const visits = clinicVisits().slice().reverse();
  const prescriptions = clinicPrescriptions().slice().reverse();
  const plans = clinicCarePlans().slice().reverse();
  const posts = clinicCommunityPosts(locale);
  return `
    <section class="clinic-account" id="clinic-account">
      <header class="clinic-section-heading"><div><p>${c.accountEyebrow}</p><h3>${c.accountTitle}</h3></div><span>${c.accountLead}</span></header>
      <div class="clinic-account-grid">
        <section><header><h4>${c.visits}</h4><b>${visits.length}</b></header>
          ${visits.length ? visits.map((visit) => `<article>
            <span data-status="${visit.status}">${visit.status === "waiting" ? c.waiting : c.consultedStatus}</span>
            <h5>${escapeHtml(visit.id)}</h5>
            <p>${visit.answers.complaints.map((id) => clinicComplaint(id)?.name[locale]).filter(Boolean).join("、")}</p>
            <dl><div><dt>${c.site}</dt><dd>${clinicSites[visit.siteId]?.short[locale]}</dd></div><div><dt>${c.checkedIn}</dt><dd>${formatDate(visit.checkedInAt, locale)}</dd></div></dl>
            ${visit.status === "waiting" ? `<button type="button" data-clinic-consult="${visit.id}">${c.takeVisit}<span>→</span></button>` : ""}
          </article>`).join("") : `<p class="clinic-empty">${c.noVisits}</p>`}
        </section>
        <section><header><h4>${c.prescriptions}</h4><b>${prescriptions.length}</b></header>
          ${prescriptions.length ? prescriptions.map((prescription) => {
            const course = prescriptionCourse(prescription);
            return `<article><span data-status="${prescription.status}">${prescription.status === "issued" ? c.issued : prescription.status === "course-complete" ? c.completed : c.dispensed}</span>
              <h5>${escapeHtml(prescription.id)}</h5><p>${prescription.medicineIds.map((id) => clinicMedicine(id)?.name[locale]).join("、")}</p>
              <dl><div><dt>${c.issuedAt}</dt><dd>${formatDate(prescription.issuedAt, locale)}</dd></div><div><dt>${c.progress}</dt><dd>${course.percent}%</dd></div></dl>
              <button type="button" data-clinic-receipt="${prescription.id}">${c.printSlip}<span>↗</span></button>
            </article>`;
          }).join("") : `<p class="clinic-empty">${c.noAccountPrescriptions}</p>`}
        </section>
        <section><header><h4>${c.plans}</h4><b>${plans.length}</b></header>
          ${plans.length ? plans.map((plan) => {
            const therapy = clinicTherapy(plan.therapyId);
            return `<article><span data-status="${plan.status}">${plan.status === "completed" ? c.completed : c.activePlans}</span>
              <h5>${escapeHtml(plan.id)}</h5><p>${therapy.name[locale]}</p>
              <dl><div><dt>${c.startedAt}</dt><dd>${formatDate(plan.startedAt, locale)}</dd></div><div><dt>${c.progress}</dt><dd>${plan.completedSteps.length}/${therapy.steps.length}</dd></div></dl>
              <a href="#clinic-recovery">${c.navRecovery}<span>→</span></a>
            </article>`;
          }).join("") : `<p class="clinic-empty">${c.noAccountPlans}</p>`}
        </section>
      </div>
      <section class="clinic-bbs-echoes">
        <header><div><p>CAMPUS BBS / MEDICAL ECHOES</p><h3>${c.bbsEchoes}</h3></div><span>${c.bbsLead}</span></header>
        <div>${posts.length ? posts.slice(0, 4).map((post) => `<article><span>${post.category.toUpperCase()}</span><h4>${escapeHtml(post.title)}</h4><p>${escapeHtml(post.body)}</p><small>${escapeHtml(post.author)} · ${formatDate(post.createdAt, locale)}</small></article>`).join("") : `<p class="clinic-empty">${c.bbsLead}</p>`}</div>
        <a class="button button-primary" href="campus.html#bbs">${c.openBbs}<span>→</span></a>
      </section>
    </section>`;
}

function triageAnswers(form) {
  const formData = new FormData(form);
  return {
    complaints: formData.getAll("complaints"),
    intensity: Number(formData.get("intensity")),
    onset: formData.get("onset"),
    mobility: formData.get("mobility"),
    lunarSensitive: form.elements.lunarSensitive.checked,
    residueContained: form.elements.residueContained.checked,
    notes: formData.get("notes"),
  };
}

function recordVisitEvent(visit) {
  recordCampusEvent(
    "clinic.visit.checked-in",
    { visitId: visit.id, siteId: visit.siteId, band: visit.band, waitMinutes: visit.waitMinutes },
    { id: `clinic.visit.checked-in:${visit.id}`, timestamp: visit.checkedInAt },
  );
}

function handleConsultation(visitId, c) {
  const result = completeClinicConsultation(visitId);
  if (!result) return;
  recordCampusEvent(
    "clinic.consultation.completed",
    { visitId: result.visit.id, prescriptionId: result.prescription.id, siteId: result.visit.siteId },
    { id: `clinic.consultation.completed:${result.visit.id}`, timestamp: result.visit.consultedAt },
  );
  showToast(c.consulted);
  window.location.hash = "clinic-pharmacy";
}

function renderReceipt(prescriptionId) {
  const prescription = clinicPrescriptions().find((record) => record.id === prescriptionId);
  const visit = clinicVisits().find((record) => record.id === prescription?.visitId);
  if (!prescription || !visit) return;
  const locale = getLocale();
  const c = copy[locale];
  const d = c.receipt;
  const dialog = app.querySelector("[data-clinic-receipt-dialog]");
  const identity = clinicIdentity();
  dialog.querySelector("[data-clinic-receipt-body]").innerHTML = `
    <header><div class="clinic-receipt-mark">診</div><div><p>${d.university}</p><span>TU-MED · LOCAL CLINICAL COPY</span></div><code>${escapeHtml(prescription.id)}</code></header>
    <section><p>${d.title}</p><h2>${escapeHtml(identity?.name || visit.patientLabel)}</h2><span>${escapeHtml(identity?.id || "LOCAL PATIENT")}</span></section>
    <dl>
      <div><dt>${d.visit}</dt><dd>${escapeHtml(visit.id)}</dd></div>
      <div><dt>${d.prescription}</dt><dd>${escapeHtml(prescription.id)}</dd></div>
      <div><dt>${d.site}</dt><dd>${clinicSites[visit.siteId].name[locale]}</dd></div>
      <div><dt>${d.clinician}</dt><dd>${c.clinicians[visit.clinicianId]}</dd></div>
      <div><dt>${d.issued}</dt><dd>${formatDate(prescription.issuedAt, locale)}</dd></div>
      <div><dt>${c.priority[visit.band]}</dt><dd>${visit.answers.complaints.map((id) => clinicComplaint(id)?.name[locale]).filter(Boolean).join("、")}</dd></div>
    </dl>
    <section class="clinic-receipt-rx"><h3>${d.medicines}</h3>${prescription.medicineIds.map((id) => {
      const medicine = clinicMedicine(id);
      return `<article><i>${medicine.glyph}</i><div><strong>${medicine.name[locale]}</strong><span>${medicine.directions[locale]}</span><small>${medicine.caution[locale]}</small></div></article>`;
    }).join("")}</section>
    <section class="clinic-receipt-care"><h3>${d.care}</h3><ul>${(prescription.therapyIds || []).map((id) => `<li>${clinicTherapy(id)?.name[locale]}</li>`).join("") || "<li>—</li>"}</ul></section>
    <footer><p>${d.note}</p><span>${escapeHtml(visit.snapshotKey)}</span></footer>`;
  dialog.querySelectorAll("[data-clinic-receipt-close]").forEach((button) => {
    button.setAttribute("aria-label", d.close);
    button.textContent = button.classList.contains("dialog-close") ? "×" : d.close;
  });
  dialog.querySelector("[data-clinic-receipt-print]").childNodes[0].nodeValue = `${d.print} `;
  if (!dialog.open) dialog.showModal();
}

function bind(locale, c, mode) {
  const form = app.querySelector("[data-clinic-triage-form]");
  const saveDraft = () => {
    if (!form) return;
    saveClinicDraft(triageAnswers(form));
  };
  form?.addEventListener("input", () => {
    window.clearTimeout(draftTimer);
    draftTimer = window.setTimeout(saveDraft, 260);
  });
  form?.addEventListener("change", saveDraft);
  app.querySelector("[data-clinic-save-draft]")?.addEventListener("click", () => {
    saveDraft();
    showToast(c.draftSaved);
  });
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const answers = triageAnswers(form);
    if (!answers.complaints.length) {
      showToast(c.needsComplaint);
      form.querySelector(".clinic-complaints").focus?.();
      return;
    }
    const visit = submitClinicTriage(answers);
    if (!visit) return;
    recordVisitEvent(visit);
    showToast(c.visitCreated);
    render();
  });
  app.querySelectorAll("[data-clinic-consult]").forEach((button) => {
    button.addEventListener("click", () => handleConsultation(button.dataset.clinicConsult, c));
  });
  const medicineInput = app.querySelector("[data-clinic-medicine-search]");
  if (medicineInput) {
    bindImeSafeInput(medicineInput, (value) => {
      medicineSearch = value;
      render();
    });
  }
  app.querySelector("[data-clinic-category]")?.addEventListener("change", (event) => {
    medicineCategory = event.currentTarget.value;
    render();
  });
  app.querySelectorAll("[data-clinic-dispense]").forEach((button) => {
    button.addEventListener("click", () => {
      const prescription = dispenseClinicPrescription(button.dataset.clinicDispense);
      if (!prescription) return;
      recordCampusEvent(
        "clinic.prescription.dispensed",
        { prescriptionId: prescription.id, visitId: prescription.visitId, medicineIds: prescription.medicineIds },
        { id: `clinic.prescription.dispensed:${prescription.id}`, timestamp: prescription.dispensedAt },
      );
      showToast(c.prescriptionDispensed);
      render();
    });
  });
  app.querySelectorAll("[data-clinic-dose]").forEach((button) => {
    button.addEventListener("click", () => {
      const result = recordClinicDose(button.dataset.prescriptionId, button.dataset.clinicDose);
      if (!result) return;
      recordCampusEvent(
        "clinic.dose.recorded",
        {
          doseId: result.dose.id,
          prescriptionId: result.prescription.id,
          visitId: result.prescription.visitId,
          medicineId: result.dose.medicineId,
          sequence: result.dose.sequence,
        },
        { id: `clinic.dose.recorded:${result.dose.id}`, timestamp: result.dose.recordedAt },
      );
      showToast(c.dosageRecorded);
      render();
    });
  });
  app.querySelectorAll("[data-clinic-start-therapy]").forEach((button) => {
    button.addEventListener("click", () => {
      const recentVisit = clinicVisits().findLast((record) => record.status === "consulted");
      const plan = startClinicCarePlan(button.dataset.clinicStartTherapy, { visitId: recentVisit?.id || null });
      if (!plan) return;
      recordCampusEvent(
        "clinic.therapy.started",
        { planId: plan.id, therapyId: plan.therapyId, visitId: plan.visitId },
        { id: `clinic.therapy.started:${plan.id}`, timestamp: plan.startedAt },
      );
      showToast(c.therapyStarted);
      render();
    });
  });
  app.querySelectorAll("[data-clinic-care-step]").forEach((button) => {
    button.addEventListener("click", () => {
      const result = completeClinicCareStep(button.dataset.planId, Number(button.dataset.clinicCareStep));
      if (!result || !result.plan) return;
      recordCampusEvent(
        result.completedNow ? "clinic.therapy.completed" : "clinic.therapy.step.completed",
        {
          planId: result.plan.id,
          therapyId: result.plan.therapyId,
          visitId: result.plan.visitId,
          step: Number(button.dataset.clinicCareStep),
        },
        {
          id: result.completedNow
            ? `clinic.therapy.completed:${result.plan.id}`
            : `clinic.therapy.step.completed:${result.plan.id}:${button.dataset.clinicCareStep}`,
          timestamp: result.plan.updatedAt,
        },
      );
      if (result.completedNow) showToast(c.planComplete);
      render();
    });
  });
  app.querySelectorAll("[data-clinic-receipt]").forEach((button) => {
    button.addEventListener("click", () => renderReceipt(button.dataset.clinicReceipt));
  });
  const receiptDialog = app.querySelector("[data-clinic-receipt-dialog]");
  receiptDialog?.querySelectorAll("[data-clinic-receipt-close]").forEach((button) => {
    button.addEventListener("click", () => receiptDialog.close());
  });
  receiptDialog?.addEventListener("click", (event) => {
    if (event.target === receiptDialog) receiptDialog.close();
  });
  receiptDialog?.querySelector("[data-clinic-receipt-print]")?.addEventListener("click", () => {
    printDocument(receiptDialog.querySelector("[data-clinic-receipt-body]"), {
      title: receiptDialog.querySelector("h1, h2")?.textContent || document.title,
    });
  });
}

function render() {
  if (!app) return;
  const locale = getLocale();
  const c = copy[locale];
  const route = currentRoute();
  const mode = modeForRoute(route);
  const board = clinicOperationalBoard();
  renderPreservingState(app, () => {
    app.innerHTML = `
      ${clinicHeader(locale, c, board, mode)}
      ${mode === "triage" ? renderTriage(locale, c, board) : mode === "pharmacy" ? renderPharmacy(locale, c, route) : mode === "recovery" ? renderRecovery(locale, c) : renderAccount(locale, c)}
      <dialog class="clinic-receipt-dialog" data-clinic-receipt-dialog>
        <button class="dialog-close" type="button" aria-label="${c.receipt.close}" data-clinic-receipt-close>×</button>
        <div class="clinic-receipt" data-clinic-receipt-body></div>
        <footer><button class="button button-secondary" type="button" data-clinic-receipt-close>${c.receipt.close}</button><button class="button button-primary" type="button" data-clinic-receipt-print>${c.receipt.print} <span>↗</span></button></footer>
      </dialog>`;
  }, { preserveWindow: true });
  bind(locale, c, mode);
}

export function initClinic() {
  if (!app) return;
  window.addEventListener("tu:languagechange", render);
  window.addEventListener("tu:festivalchange", render);
  window.addEventListener("hashchange", () => {
    if (window.location.hash.startsWith("#clinic")) render();
  });
  clockTimer = window.setInterval(() => {
    if (modeForRoute(currentRoute()) === "triage") render();
  }, 60_000);
  window.addEventListener("pagehide", () => {
    window.clearInterval(clockTimer);
    window.clearTimeout(draftTimer);
  }, { once: true });
  render();
}
