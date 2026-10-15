import { text as catalogText } from "../generated/i18n/data/governance.js";

export const governanceProposals = [
  {
    id: "airspace-practicals",
    code: "TU-SEN-26-041",
    glyph: "空",
    sponsor: catalogText("governanceProposals.airspace-practicals.sponsor"),
    title: catalogText("governanceProposals.airspace-practicals.title"),
    summary: catalogText("governanceProposals.airspace-practicals.summary"),
    choices: [
      { id: "registrar", label: catalogText("governanceProposals.airspace-practicals.choices.registrar.label"), consequence: catalogText("governanceProposals.airspace-practicals.choices.registrar.consequence") },
      { id: "reimu", label: catalogText("governanceProposals.airspace-practicals.choices.reimu.label"), consequence: catalogText("governanceProposals.airspace-practicals.choices.reimu.consequence") },
      { id: "aya", label: catalogText("governanceProposals.airspace-practicals.choices.aya.label"), consequence: catalogText("governanceProposals.airspace-practicals.choices.aya.consequence") },
    ],
    reaction: catalogText("governanceProposals.airspace-practicals.reaction"),
  },
  {
    id: "fullmoon-library",
    code: "TU-SEN-26-044",
    glyph: "月",
    sponsor: catalogText("governanceProposals.fullmoon-library.sponsor"),
    title: catalogText("governanceProposals.fullmoon-library.title"),
    summary: catalogText("governanceProposals.fullmoon-library.summary"),
    choices: [
      { id: "split", label: catalogText("governanceProposals.fullmoon-library.choices.split.label"), consequence: catalogText("governanceProposals.fullmoon-library.choices.split.consequence") },
      { id: "appointment", label: catalogText("governanceProposals.fullmoon-library.choices.appointment.label"), consequence: catalogText("governanceProposals.fullmoon-library.choices.appointment.consequence") },
      { id: "books-vote", label: catalogText("governanceProposals.fullmoon-library.choices.books-vote.label"), consequence: catalogText("governanceProposals.fullmoon-library.choices.books-vote.consequence") },
    ],
    reaction: catalogText("governanceProposals.fullmoon-library.reaction"),
  },
  {
    id: "red-thread-appeal",
    code: "TU-SEN-26-047",
    glyph: "糸",
    sponsor: catalogText("governanceProposals.red-thread-appeal.sponsor"),
    title: catalogText("governanceProposals.red-thread-appeal.title"),
    summary: catalogText("governanceProposals.red-thread-appeal.summary"),
    choices: [
      { id: "same-size", label: catalogText("governanceProposals.red-thread-appeal.choices.same-size.label"), consequence: catalogText("governanceProposals.red-thread-appeal.choices.same-size.consequence") },
      { id: "red-border", label: catalogText("governanceProposals.red-thread-appeal.choices.red-border.label"), consequence: catalogText("governanceProposals.red-thread-appeal.choices.red-border.consequence") },
      { id: "headline", label: catalogText("governanceProposals.red-thread-appeal.choices.headline.label"), consequence: catalogText("governanceProposals.red-thread-appeal.choices.headline.consequence") },
    ],
    reaction: catalogText("governanceProposals.red-thread-appeal.reaction"),
  },
  {
    id: "canteen-names",
    code: "TU-SEN-26-050",
    glyph: "膳",
    sponsor: catalogText("governanceProposals.canteen-names.sponsor"),
    title: catalogText("governanceProposals.canteen-names.title"),
    summary: catalogText("governanceProposals.canteen-names.summary"),
    choices: [
      { id: "ingredient", label: catalogText("governanceProposals.canteen-names.choices.ingredient.label"), consequence: catalogText("governanceProposals.canteen-names.choices.ingredient.consequence") },
      { id: "footnote", label: catalogText("governanceProposals.canteen-names.choices.footnote.label"), consequence: catalogText("governanceProposals.canteen-names.choices.footnote.consequence") },
      { id: "mystery", label: catalogText("governanceProposals.canteen-names.choices.mystery.label"), consequence: catalogText("governanceProposals.canteen-names.choices.mystery.consequence") },
    ],
    reaction: catalogText("governanceProposals.canteen-names.reaction"),
  },
];

export function governanceProposal(id) {
  return governanceProposals.find((proposal) => proposal.id === id);
}
