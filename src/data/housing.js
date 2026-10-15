import { text as catalogText } from "../generated/i18n/data/housing.js";

export const housingFacets = {
  roomTypes: {
    single: catalogText("housingFacets.roomTypes.single"),
    twin: catalogText("housingFacets.roomTypes.twin"),
    cluster: catalogText("housingFacets.roomTypes.cluster"),
  },
  features: {
    moonShield: catalogText("housingFacets.features.moonShield"),
    waterAccess: catalogText("housingFacets.features.waterAccess"),
    wideFlight: catalogText("housingFacets.features.wideFlight"),
    broomRack: catalogText("housingFacets.features.broomRack"),
    phaseMarked: catalogText("housingFacets.features.phaseMarked"),
    familiarBay: catalogText("housingFacets.features.familiarBay"),
    quietWard: catalogText("housingFacets.features.quietWard"),
    workshop: catalogText("housingFacets.features.workshop"),
    kitchen: catalogText("housingFacets.features.kitchen"),
    garden: catalogText("housingFacets.features.garden"),
  },
};

export const residences = [
  {
    id: "hakurei-east",
    mark: "博",
    name: catalogText("residences.hakurei-east.name"),
    area: catalogText("residences.hakurei-east.area"),
    description: catalogText("residences.hakurei-east.description"),
    warden: catalogText("residences.hakurei-east.warden"),
    notice: catalogText("residences.hakurei-east.notice"),
    distance: catalogText("residences.hakurei-east.distance"),
    features: ["quietWard", "kitchen", "garden", "broomRack"],
  },
  {
    id: "misty-north",
    mark: "霧",
    name: catalogText("residences.misty-north.name"),
    area: catalogText("residences.misty-north.area"),
    description: catalogText("residences.misty-north.description"),
    warden: catalogText("residences.misty-north.warden"),
    notice: catalogText("residences.misty-north.notice"),
    distance: catalogText("residences.misty-north.distance"),
    features: ["waterAccess", "wideFlight", "familiarBay", "kitchen"],
  },
  {
    id: "bamboo-lantern",
    mark: "竹",
    name: catalogText("residences.bamboo-lantern.name"),
    area: catalogText("residences.bamboo-lantern.area"),
    description: catalogText("residences.bamboo-lantern.description"),
    warden: catalogText("residences.bamboo-lantern.warden"),
    notice: catalogText("residences.bamboo-lantern.notice"),
    distance: catalogText("residences.bamboo-lantern.distance"),
    features: ["moonShield", "quietWard", "garden", "familiarBay"],
  },
  {
    id: "youkai-workshop",
    mark: "工",
    name: catalogText("residences.youkai-workshop.name"),
    area: catalogText("residences.youkai-workshop.area"),
    description: catalogText("residences.youkai-workshop.description"),
    warden: catalogText("residences.youkai-workshop.warden"),
    notice: catalogText("residences.youkai-workshop.notice"),
    distance: catalogText("residences.youkai-workshop.distance"),
    features: ["workshop", "wideFlight", "broomRack", "waterAccess"],
  },
  {
    id: "boundary-annex",
    mark: "界",
    name: catalogText("residences.boundary-annex.name"),
    area: catalogText("residences.boundary-annex.area"),
    description: catalogText("residences.boundary-annex.description"),
    warden: catalogText("residences.boundary-annex.warden"),
    notice: catalogText("residences.boundary-annex.notice"),
    distance: catalogText("residences.boundary-annex.distance"),
    features: ["phaseMarked", "quietWard", "familiarBay", "kitchen"],
  },
];

export const housingRooms = [
  { id: "HE-203", residence: "hakurei-east", type: "twin", fee: 16800, beds: 2, openBeds: 1, features: ["quietWard", "kitchen", "broomRack"], roommate: "sumire" },
  { id: "HE-108", residence: "hakurei-east", type: "single", fee: 22600, beds: 1, openBeds: 1, features: ["quietWard", "garden"], roommate: null },
  { id: "HE-305", residence: "hakurei-east", type: "cluster", fee: 14200, beds: 3, openBeds: 1, features: ["kitchen", "broomRack", "familiarBay"], roommate: "rin" },
  { id: "MN-W12", residence: "misty-north", type: "twin", fee: 18100, beds: 2, openBeds: 1, features: ["waterAccess", "wideFlight"], roommate: "nagi" },
  { id: "MN-A07", residence: "misty-north", type: "cluster", fee: 15300, beds: 3, openBeds: 1, features: ["waterAccess", "familiarBay", "kitchen"], roommate: "lumi" },
  { id: "BL-E16", residence: "bamboo-lantern", type: "twin", fee: 17400, beds: 2, openBeds: 1, features: ["moonShield", "quietWard", "garden"], roommate: "tsukino" },
  { id: "BL-S03", residence: "bamboo-lantern", type: "single", fee: 23900, beds: 1, openBeds: 1, features: ["moonShield", "quietWard"], roommate: null },
  { id: "YW-C4", residence: "youkai-workshop", type: "cluster", fee: 14900, beds: 3, openBeds: 1, features: ["workshop", "wideFlight", "broomRack"], roommate: "kuroha" },
  { id: "YW-F9", residence: "youkai-workshop", type: "twin", fee: 18800, beds: 2, openBeds: 1, features: ["workshop", "waterAccess"], roommate: "suzu" },
  { id: "BA-2.5", residence: "boundary-annex", type: "twin", fee: 19300, beds: 2, openBeds: 1, features: ["phaseMarked", "quietWard", "familiarBay"], roommate: "matoi" },
  { id: "BA-404", residence: "boundary-annex", type: "single", fee: 24100, beds: 1, openBeds: 1, features: ["phaseMarked", "kitchen"], roommate: null },
  { id: "BA-YD", residence: "boundary-annex", type: "cluster", fee: 15700, beds: 3, openBeds: 1, features: ["phaseMarked", "familiarBay", "kitchen"], roommate: "chiya" },
];

export const roommateProfiles = [
  {
    id: "sumire", seal: "鈴", name: catalogText("roommateProfiles.sumire.name"), kind: catalogText("roommateProfiles.sumire.kind"),
    school: catalogText("roommateProfiles.sumire.school"),
    bio: catalogText("roommateProfiles.sumire.bio"),
    habits: { sleep: "early", noise: "quiet", cleanliness: "neat", cooking: "shared", moon: "ordinary", water: "dry", flight: "ground", wall: "solid", familiar: "small", danmaku: "outdoors" },
  },
  {
    id: "rin", seal: "燐", name: catalogText("roommateProfiles.rin.name"), kind: catalogText("roommateProfiles.rin.kind"),
    school: catalogText("roommateProfiles.rin.school"),
    bio: catalogText("roommateProfiles.rin.bio"),
    habits: { sleep: "shifting", noise: "social", cleanliness: "relaxed", cooking: "night", moon: "ordinary", water: "dry", flight: "ground", wall: "solid", familiar: "small", danmaku: "indoor" },
  },
  {
    id: "nagi", seal: "凪", name: catalogText("roommateProfiles.nagi.name"), kind: catalogText("roommateProfiles.nagi.kind"),
    school: catalogText("roommateProfiles.nagi.school"),
    bio: catalogText("roommateProfiles.nagi.bio"),
    habits: { sleep: "shifting", noise: "quiet", cleanliness: "neat", cooking: "shared", moon: "ordinary", water: "must", flight: "ground", wall: "solid", familiar: "none", danmaku: "outdoors" },
  },
  {
    id: "lumi", seal: "灯", name: catalogText("roommateProfiles.lumi.name"), kind: catalogText("roommateProfiles.lumi.kind"),
    school: catalogText("roommateProfiles.lumi.school"),
    bio: catalogText("roommateProfiles.lumi.bio"),
    habits: { sleep: "late", noise: "social", cleanliness: "relaxed", cooking: "night", moon: "active", water: "near", flight: "small", wall: "solid", familiar: "none", danmaku: "outdoors" },
  },
  {
    id: "tsukino", seal: "月", name: catalogText("roommateProfiles.tsukino.name"), kind: catalogText("roommateProfiles.tsukino.kind"),
    school: catalogText("roommateProfiles.tsukino.school"),
    bio: catalogText("roommateProfiles.tsukino.bio"),
    habits: { sleep: "shifting", noise: "quiet", cleanliness: "neat", cooking: "shared", moon: "sensitive", water: "dry", flight: "ground", wall: "solid", familiar: "none", danmaku: "none" },
  },
  {
    id: "kuroha", seal: "羽", name: catalogText("roommateProfiles.kuroha.name"), kind: catalogText("roommateProfiles.kuroha.kind"),
    school: catalogText("roommateProfiles.kuroha.school"),
    bio: catalogText("roommateProfiles.kuroha.bio"),
    habits: { sleep: "early", noise: "social", cleanliness: "relaxed", cooking: "no", moon: "ordinary", water: "dry", flight: "large", wall: "solid", familiar: "none", danmaku: "outdoors" },
  },
  {
    id: "suzu", seal: "河", name: catalogText("roommateProfiles.suzu.name"), kind: catalogText("roommateProfiles.suzu.kind"),
    school: catalogText("roommateProfiles.suzu.school"),
    bio: catalogText("roommateProfiles.suzu.bio"),
    habits: { sleep: "late", noise: "social", cleanliness: "neat", cooking: "night", moon: "ordinary", water: "must", flight: "ground", wall: "solid", familiar: "none", danmaku: "indoor" },
  },
  {
    id: "matoi", seal: "縫", name: catalogText("roommateProfiles.matoi.name"), kind: catalogText("roommateProfiles.matoi.kind"),
    school: catalogText("roommateProfiles.matoi.school"),
    bio: catalogText("roommateProfiles.matoi.bio"),
    habits: { sleep: "shifting", noise: "quiet", cleanliness: "relaxed", cooking: "no", moon: "ordinary", water: "dry", flight: "ground", wall: "phase", familiar: "none", danmaku: "none" },
  },
  {
    id: "chiya", seal: "茶", name: catalogText("roommateProfiles.chiya.name"), kind: catalogText("roommateProfiles.chiya.kind"),
    school: catalogText("roommateProfiles.chiya.school"),
    bio: catalogText("roommateProfiles.chiya.bio"),
    habits: { sleep: "early", noise: "quiet", cleanliness: "relaxed", cooking: "shared", moon: "ordinary", water: "near", flight: "ground", wall: "phase", familiar: "large", danmaku: "none" },
  },
];

export function residenceById(id) {
  return residences.find((residence) => residence.id === id);
}

export function housingRoom(id) {
  return housingRooms.find((room) => room.id === id);
}

export function roommateById(id) {
  return roommateProfiles.find((profile) => profile.id === id);
}
