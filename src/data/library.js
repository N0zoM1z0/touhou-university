import { text as catalogText } from "../generated/i18n/data/library.js";
const h = (id, callNumber, title, author, school, subject, edition, origin, location, will, danger, circulation, state, loanDays, renewalLimit, note, extras = {}) => ({
  id, callNumber, title, author, school, subject, edition, origin, location, will, danger, circulation, state, loanDays, renewalLimit, note, ...extras,
});

export const libraryFacets = {
  schools: {
    common: catalogText("libraryFacets.schools.common"),
    boundary: catalogText("libraryFacets.schools.boundary"),
    history: catalogText("libraryFacets.schools.history"),
    magic: catalogText("libraryFacets.schools.magic"),
    medicine: catalogText("libraryFacets.schools.medicine"),
    engineering: catalogText("libraryFacets.schools.engineering"),
    journalism: catalogText("libraryFacets.schools.journalism"),
    policy: catalogText("libraryFacets.schools.policy"),
  },
  dangers: {
    low: catalogText("libraryFacets.dangers.low"),
    guarded: catalogText("libraryFacets.dangers.guarded"),
    high: catalogText("libraryFacets.dangers.high"),
    sealed: catalogText("libraryFacets.dangers.sealed"),
  },
  states: {
    available: catalogText("libraryFacets.states.available"),
    onLoan: catalogText("libraryFacets.states.onLoan"),
    flight: catalogText("libraryFacets.states.flight"),
    negotiating: catalogText("libraryFacets.states.negotiating"),
    moon: catalogText("libraryFacets.states.moon"),
    reference: catalogText("libraryFacets.states.reference"),
    unwritten: catalogText("libraryFacets.states.unwritten"),
    erased: catalogText("libraryFacets.states.erased"),
  },
  wills: {
    none: catalogText("libraryFacets.wills.none"),
    mild: catalogText("libraryFacets.wills.mild"),
    mobile: catalogText("libraryFacets.wills.mobile"),
    argumentative: catalogText("libraryFacets.wills.argumentative"),
    unknown: catalogText("libraryFacets.wills.unknown"),
  },
};

export const libraryHoldings = [
  h("seven-day-reverse", "ML-MAG 133.43", catalogText("libraryHoldings.0.seven-day-reverse.2"), catalogText("libraryHoldings.0.seven-day-reverse.3"), "magic", catalogText("libraryHoldings.0.seven-day-reverse.5"), catalogText("libraryHoldings.0.seven-day-reverse.6"), catalogText("libraryHoldings.0.seven-day-reverse.7"), catalogText("libraryHoldings.0.seven-day-reverse.8"), "argumentative", "high", "loan", "available", 14, 1, catalogText("libraryHoldings.0.seven-day-reverse.15"), { accessCourses: ["MTP-111"] }),
  h("barrier-step-atlas", "ML-BIS 001.18", catalogText("libraryHoldings.1.barrier-step-atlas.2"), catalogText("libraryHoldings.1.barrier-step-atlas.3"), "boundary", catalogText("libraryHoldings.1.barrier-step-atlas.5"), catalogText("libraryHoldings.1.barrier-step-atlas.6"), catalogText("libraryHoldings.1.barrier-step-atlas.7"), catalogText("libraryHoldings.1.barrier-step-atlas.8"), "mild", "guarded", "loan", "available", 21, 2, catalogText("libraryHoldings.1.barrier-step-atlas.15")),
  h("three-yesterdays", "ML-HRS 142.03", catalogText("libraryHoldings.2.three-yesterdays.2"), catalogText("libraryHoldings.2.three-yesterdays.3"), "history", catalogText("libraryHoldings.2.three-yesterdays.5"), catalogText("libraryHoldings.2.three-yesterdays.6"), catalogText("libraryHoldings.2.three-yesterdays.7"), catalogText("libraryHoldings.2.three-yesterdays.8"), "none", "low", "loan", "available", 28, 2, catalogText("libraryHoldings.2.three-yesterdays.15")),
  h("flying-index", "ML-CAT 025.71", catalogText("libraryHoldings.3.flying-index.2"), catalogText("libraryHoldings.3.flying-index.3"), "common", catalogText("libraryHoldings.3.flying-index.5"), catalogText("libraryHoldings.3.flying-index.6"), catalogText("libraryHoldings.3.flying-index.7"), catalogText("libraryHoldings.3.flying-index.8"), "mobile", "guarded", "loan", "flight", 14, 1, catalogText("libraryHoldings.3.flying-index.15")),
  h("fourth-lantern-manual", "ML-KPE 404.04", catalogText("libraryHoldings.4.fourth-lantern-manual.2"), catalogText("libraryHoldings.4.fourth-lantern-manual.3"), "engineering", catalogText("libraryHoldings.4.fourth-lantern-manual.5"), catalogText("libraryHoldings.4.fourth-lantern-manual.6"), catalogText("libraryHoldings.4.fourth-lantern-manual.7"), catalogText("libraryHoldings.4.fourth-lantern-manual.8"), "none", "low", "loan", "available", 21, 2, catalogText("libraryHoldings.4.fourth-lantern-manual.15")),
  h("doll-remote-protocol", "ML-MTP 220.09", catalogText("libraryHoldings.5.doll-remote-protocol.2"), catalogText("libraryHoldings.5.doll-remote-protocol.3"), "magic", catalogText("libraryHoldings.5.doll-remote-protocol.5"), catalogText("libraryHoldings.5.doll-remote-protocol.6"), catalogText("libraryHoldings.5.doll-remote-protocol.7"), catalogText("libraryHoldings.5.doll-remote-protocol.8"), "mild", "guarded", "loan", "available", 14, 1, catalogText("libraryHoldings.5.doll-remote-protocol.15"), { accessCourses: ["MTP-111"] }),
  h("leak-that-powers", "ML-KPE 110.29", catalogText("libraryHoldings.6.leak-that-powers.2"), catalogText("libraryHoldings.6.leak-that-powers.3"), "engineering", catalogText("libraryHoldings.6.leak-that-powers.5"), catalogText("libraryHoldings.6.leak-that-powers.6"), catalogText("libraryHoldings.6.leak-that-powers.7"), catalogText("libraryHoldings.6.leak-that-powers.8"), "none", "low", "loan", "available", 21, 2, catalogText("libraryHoldings.6.leak-that-powers.15")),
  h("corrections-headlines", "ML-TJM 301.88", catalogText("libraryHoldings.7.corrections-headlines.2"), catalogText("libraryHoldings.7.corrections-headlines.3"), "journalism", catalogText("libraryHoldings.7.corrections-headlines.5"), catalogText("libraryHoldings.7.corrections-headlines.6"), catalogText("libraryHoldings.7.corrections-headlines.7"), catalogText("libraryHoldings.7.corrections-headlines.8"), "argumentative", "guarded", "loan", "onLoan", 14, 1, catalogText("libraryHoldings.7.corrections-headlines.15"), { availableAfterDays: 5 }),
  h("many-pulses", "ML-LML 102.16", catalogText("libraryHoldings.8.many-pulses.2"), catalogText("libraryHoldings.8.many-pulses.3"), "medicine", catalogText("libraryHoldings.8.many-pulses.5"), catalogText("libraryHoldings.8.many-pulses.6"), catalogText("libraryHoldings.8.many-pulses.7"), catalogText("libraryHoldings.8.many-pulses.8"), "none", "guarded", "loan", "available", 14, 1, catalogText("libraryHoldings.8.many-pulses.15")),
  h("ending-meetings", "ML-FCP 160.47", catalogText("libraryHoldings.9.ending-meetings.2"), catalogText("libraryHoldings.9.ending-meetings.3"), "policy", catalogText("libraryHoldings.9.ending-meetings.5"), catalogText("libraryHoldings.9.ending-meetings.6"), catalogText("libraryHoldings.9.ending-meetings.7"), catalogText("libraryHoldings.9.ending-meetings.8"), "none", "low", "loan", "available", 21, 2, catalogText("libraryHoldings.9.ending-meetings.15")),
  h("moon-sealed-senses", "ML-LML 166.FM", catalogText("libraryHoldings.10.moon-sealed-senses.2"), catalogText("libraryHoldings.10.moon-sealed-senses.3"), "medicine", catalogText("libraryHoldings.10.moon-sealed-senses.5"), catalogText("libraryHoldings.10.moon-sealed-senses.6"), catalogText("libraryHoldings.10.moon-sealed-senses.7"), catalogText("libraryHoldings.10.moon-sealed-senses.8"), "unknown", "high", "reference", "moon", 0, 0, catalogText("libraryHoldings.10.moon-sealed-senses.15")),
  h("missing-wednesday", "ML-HRS 250.00", catalogText("libraryHoldings.11.missing-wednesday.2"), catalogText("libraryHoldings.11.missing-wednesday.3"), "history", catalogText("libraryHoldings.11.missing-wednesday.5"), catalogText("libraryHoldings.11.missing-wednesday.6"), catalogText("libraryHoldings.11.missing-wednesday.7"), catalogText("libraryHoldings.11.missing-wednesday.8"), "unknown", "sealed", "reference", "erased", 0, 0, catalogText("libraryHoldings.11.missing-wednesday.15")),
  h("book-not-written", "ML-MTP 430.∞", catalogText("libraryHoldings.12.book-not-written.2"), catalogText("libraryHoldings.12.book-not-written.3"), "magic", catalogText("libraryHoldings.12.book-not-written.5"), catalogText("libraryHoldings.12.book-not-written.6"), catalogText("libraryHoldings.12.book-not-written.7"), catalogText("libraryHoldings.12.book-not-written.8"), "unknown", "guarded", "reference", "unwritten", 0, 0, catalogText("libraryHoldings.12.book-not-written.15")),
  h("spellcard-telegraph", "ML-BIS 204.50", catalogText("libraryHoldings.13.spellcard-telegraph.2"), catalogText("libraryHoldings.13.spellcard-telegraph.3"), "boundary", catalogText("libraryHoldings.13.spellcard-telegraph.5"), catalogText("libraryHoldings.13.spellcard-telegraph.6"), catalogText("libraryHoldings.13.spellcard-telegraph.7"), catalogText("libraryHoldings.13.spellcard-telegraph.8"), "none", "guarded", "loan", "available", 14, 1, catalogText("libraryHoldings.13.spellcard-telegraph.15"), { accessCourses: ["BIS-101"] }),
  h("outside-drift-catalogue", "ML-BIS 271.77", catalogText("libraryHoldings.14.outside-drift-catalogue.2"), catalogText("libraryHoldings.14.outside-drift-catalogue.3"), "boundary", catalogText("libraryHoldings.14.outside-drift-catalogue.5"), catalogText("libraryHoldings.14.outside-drift-catalogue.6"), catalogText("libraryHoldings.14.outside-drift-catalogue.7"), catalogText("libraryHoldings.14.outside-drift-catalogue.8"), "none", "low", "loan", "available", 21, 2, catalogText("libraryHoldings.14.outside-drift-catalogue.15")),
  h("mushroom-provenance", "ML-MTP 308.13", catalogText("libraryHoldings.15.mushroom-provenance.2"), catalogText("libraryHoldings.15.mushroom-provenance.3"), "magic", catalogText("libraryHoldings.15.mushroom-provenance.5"), catalogText("libraryHoldings.15.mushroom-provenance.6"), catalogText("libraryHoldings.15.mushroom-provenance.7"), catalogText("libraryHoldings.15.mushroom-provenance.8"), "argumentative", "high", "loan", "negotiating", 7, 0, catalogText("libraryHoldings.15.mushroom-provenance.15")),
  h("interview-with-minds", "ML-TJM 105.11", catalogText("libraryHoldings.16.interview-with-minds.2"), catalogText("libraryHoldings.16.interview-with-minds.3"), "journalism", catalogText("libraryHoldings.16.interview-with-minds.5"), catalogText("libraryHoldings.16.interview-with-minds.6"), catalogText("libraryHoldings.16.interview-with-minds.7"), catalogText("libraryHoldings.16.interview-with-minds.8"), "mild", "high", "loan", "available", 14, 1, catalogText("libraryHoldings.16.interview-with-minds.15")),
  h("two-simultaneous-editions", "ML-HRS 126.2A", catalogText("libraryHoldings.17.two-simultaneous-editions.2"), catalogText("libraryHoldings.17.two-simultaneous-editions.3"), "history", catalogText("libraryHoldings.17.two-simultaneous-editions.5"), catalogText("libraryHoldings.17.two-simultaneous-editions.6"), catalogText("libraryHoldings.17.two-simultaneous-editions.7"), catalogText("libraryHoldings.17.two-simultaneous-editions.8"), "none", "guarded", "loan", "available", 14, 1, catalogText("libraryHoldings.17.two-simultaneous-editions.15")),
  h("shelf-negotiation-minutes", "ML-CAT 129.07", catalogText("libraryHoldings.18.shelf-negotiation-minutes.2"), catalogText("libraryHoldings.18.shelf-negotiation-minutes.3"), "common", catalogText("libraryHoldings.18.shelf-negotiation-minutes.5"), catalogText("libraryHoldings.18.shelf-negotiation-minutes.6"), catalogText("libraryHoldings.18.shelf-negotiation-minutes.7"), catalogText("libraryHoldings.18.shelf-negotiation-minutes.8"), "argumentative", "low", "loan", "available", 14, 1, catalogText("libraryHoldings.18.shelf-negotiation-minutes.15")),
];

export function libraryHolding(id) {
  return libraryHoldings.find((holding) => holding.id === id);
}
