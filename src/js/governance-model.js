import { governanceProposal, governanceProposals } from "../data/governance.js";

const VOTE_KEY = "tu:governance:votes";
const MAX_VOTES = 80;

function hashValue(value) {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function readJson(key, fallback) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}

export function governanceVotes() {
  const records = readJson(VOTE_KEY, []);
  return Array.isArray(records)
    ? records.filter((record) => governanceProposal(record?.proposalId)?.choices.some((choice) => choice.id === record.choiceId))
    : [];
}

export function voteForProposal(proposalId) {
  return governanceVotes().findLast((record) => record.proposalId === proposalId) || null;
}

export function castGovernanceVote(proposalId, choiceId) {
  const proposal = governanceProposal(proposalId);
  if (!proposal?.choices.some((choice) => choice.id === choiceId)) return null;
  const castAt = new Date().toISOString();
  const existing = governanceVotes().filter((record) => record.proposalId !== proposalId);
  const record = {
    schema: 1,
    id: `TU-VOTE-${hashValue(`${proposalId}:${choiceId}:${castAt}`).toString(36).toUpperCase()}`,
    proposalId,
    choiceId,
    castAt,
  };
  existing.push(record);
  window.localStorage.setItem(VOTE_KEY, JSON.stringify(existing.slice(-MAX_VOTES)));
  window.dispatchEvent(new CustomEvent("tu:governancechange", { detail: record }));
  return record;
}

export function governanceTally(proposalId, date = new Date()) {
  const proposal = governanceProposal(proposalId);
  if (!proposal) return null;
  const day = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  const local = voteForProposal(proposalId);
  const counts = Object.fromEntries(
    proposal.choices.map((choice, index) => [
      choice.id,
      18 + (hashValue(`${day}:${proposalId}:${choice.id}:${index}`) % 74) + (local?.choiceId === choice.id ? 1 : 0),
    ]),
  );
  const total = Object.values(counts).reduce((sum, value) => sum + value, 0);
  const leader = proposal.choices.slice().sort((a, b) => counts[b.id] - counts[a.id])[0];
  return { counts, total, leader, local };
}

export function governanceCommunityPosts(locale) {
  return governanceVotes()
    .slice()
    .reverse()
    .map((vote) => {
      const proposal = governanceProposal(vote.proposalId);
      const choice = proposal?.choices.find((item) => item.id === vote.choiceId);
      if (!proposal || !choice) return null;
      return {
        id: `governance-${vote.id.toLowerCase()}`,
        governanceId: proposal.id,
        category: "notice",
        author: {
          "zh-Hant": "校務議事鐘速記席",
          ja: "学務議事鐘速記席",
          en: "Governance Bell Shorthand Desk",
        }[locale],
        title: proposal.reaction[locale],
        body: {
          "zh-Hant": `本機意見投給「${choice.label["zh-Hant"]}」。此票已進入公開計數，但沒有讓其他利益關係人突然變得同意。`,
          ja: `この端末の票は「${choice.label.ja}」。公開集計へ入ったが、他の利害関係者が突然同意したわけではない。`,
          en: `This device voted for “${choice.label.en}”. It entered the public count without making the other stakeholders suddenly agree.`,
        }[locale],
        replies: 9 + (hashValue(vote.id) % 43),
        createdAt: vote.castAt,
        generated: true,
        governance: true,
      };
    })
    .filter(Boolean);
}

export const governanceStorageKey = VOTE_KEY;
export { governanceProposals };
