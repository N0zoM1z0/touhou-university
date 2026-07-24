import {
  housingFacets,
  housingRooms,
  residences,
  roommateProfiles,
} from "../src/data/housing.js";

const locales = ["zh-Hant", "ja", "en"];
const errors = [];
const roomIds = new Set();
const residenceIds = new Set(residences.map((record) => record.id));
const roommateIds = new Set(roommateProfiles.map((record) => record.id));
const featureIds = new Set(Object.keys(housingFacets.features));

function translated(value, path) {
  for (const locale of locales) {
    if (!value?.[locale]?.trim()) errors.push(`${path}.${locale} is empty`);
  }
}

if (residences.length !== 5) errors.push(`expected 5 residences, found ${residences.length}`);
if (housingRooms.length !== 12) errors.push(`expected 12 rooms, found ${housingRooms.length}`);
if (roommateProfiles.length !== 9) errors.push(`expected 9 roommate profiles, found ${roommateProfiles.length}`);

for (const residence of residences) {
  for (const field of ["name", "area", "description", "warden", "notice", "distance"]) translated(residence[field], `residences.${residence.id}.${field}`);
  if (!housingRooms.some((room) => room.residence === residence.id)) errors.push(`${residence.id} has no rooms`);
  for (const feature of residence.features) {
    if (!featureIds.has(feature)) errors.push(`${residence.id} uses unknown feature ${feature}`);
  }
}

for (const room of housingRooms) {
  if (!room.id || roomIds.has(room.id)) errors.push(`duplicate or missing room id: ${room.id}`);
  roomIds.add(room.id);
  if (!residenceIds.has(room.residence)) errors.push(`${room.id} uses unknown residence ${room.residence}`);
  if (!housingFacets.roomTypes[room.type]) errors.push(`${room.id} uses unknown room type ${room.type}`);
  if (!Number.isInteger(room.fee) || room.fee < 10000) errors.push(`${room.id} has invalid fee`);
  if (!Number.isInteger(room.openBeds) || room.openBeds < 1 || room.openBeds > room.beds) errors.push(`${room.id} has invalid open beds`);
  if (room.roommate && !roommateIds.has(room.roommate)) errors.push(`${room.id} uses unknown roommate ${room.roommate}`);
  for (const feature of room.features) {
    if (!featureIds.has(feature)) errors.push(`${room.id} uses unknown feature ${feature}`);
  }
}

for (const profile of roommateProfiles) {
  for (const field of ["name", "kind", "school", "bio"]) translated(profile[field], `roommates.${profile.id}.${field}`);
  for (const field of ["sleep", "noise", "cleanliness", "cooking", "moon", "water", "flight", "wall", "familiar", "danmaku"]) {
    if (!profile.habits[field]) errors.push(`${profile.id}.habits.${field} is empty`);
  }
}

for (const [facet, values] of Object.entries(housingFacets)) {
  for (const [id, value] of Object.entries(values)) translated(value, `housingFacets.${facet}.${id}`);
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Housing data valid: ${residences.length} residences, ${housingRooms.length} rooms, ${roommateProfiles.length} roommate profiles.`);
