import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const corpusPath = path.join(root, "src/data/ai-native-corpus.generated.json");
const corpus = JSON.parse(fs.readFileSync(corpusPath, "utf8"));

const questionClaims = {
  understanding: [
    "E15-C04", "E24-C21", "E28-C11", "E31-C06", "E16-C01", "E17-C03",
    "E25-C08", "E30-C02", "E06-C09", "E07-C10", "E19-C09", "E23-C06",
  ],
  evidence: [
    "E18-C03", "E20-C05", "E04-C01", "E13-C06", "E15-C08", "E28-C05",
  ],
  learning: [
    "E11-C05", "E01-C08", "E27-C13", "E34-C06", "E39-C05", "E03-C10",
    "E09-C07", "E16-C18", "E20-C01", "E27-C09",
  ],
  work: [
    "E12-C07", "E20-C08", "E29-C19", "E26-C02", "E12-C11", "E13-C02",
    "E14-C13", "E29-C18",
  ],
  creativity: [
    "E09-C01", "E28-C01", "E38-C17", "E41-C13", "E06-C04", "E19-C04",
    "E09-C08",
  ],
  relationships: [
    "E10-C06", "E14-C02", "E21-C12", "E22-C11", "E31-C18", "E25-C01",
    "E19-C01", "E21-C02", "E33-C01", "E38-C01", "E22-C06", "E31-C17",
  ],
  wellbeing: [
    "E33-C02", "E24-C19", "E37-C19", "E40-C15", "E10-C08", "E04-C07",
    "E10-C02", "E11-C03", "E37-C04", "E42-C10",
  ],
  judgment: [
    "E12-C12", "E42-C04", "E05-C01", "E32-C03", "E07-C08", "E11-C04",
    "E17-C11", "E23-C08", "E14-C04", "E13-C08",
  ],
  privacy: [
    "E30-C18", "E01-C05", "E02-C02", "E06-C03", "E18-C04", "E24-C09",
    "E32-C07",
  ],
  governance: [
    "E03-C02", "E05-C10", "E07-C02", "E16-C15", "E17-C07", "E23-C02",
    "E26-C03", "E30-C01", "E39-C22", "E40-C11", "E41-C03", "E15-C11",
    "E25-C11", "E34-C09",
  ],
};

const allClaims = Object.values(corpus.questions).flat();
const claimsById = new Map();
for (const claim of allClaims) {
  const existing = claimsById.get(claim.claimId);
  if (existing && JSON.stringify(existing) !== JSON.stringify(claim)) {
    throw new Error(`Conflicting duplicate claim ${claim.claimId}`);
  }
  claimsById.set(claim.claimId, claim);
}

const assigned = new Map();
for (const [questionId, claimIds] of Object.entries(questionClaims)) {
  for (const claimId of claimIds) {
    if (!claimsById.has(claimId)) throw new Error(`Unknown claim ${claimId}`);
    if (assigned.has(claimId)) throw new Error(`${claimId} assigned to both ${assigned.get(claimId)} and ${questionId}`);
    assigned.set(claimId, questionId);
  }
}

const missing = [...claimsById.keys()].filter((claimId) => !assigned.has(claimId));
if (missing.length) throw new Error(`Unassigned claims: ${missing.join(", ")}`);

const questions = Object.fromEntries(Object.entries(questionClaims).map(([questionId, claimIds]) => [
  questionId,
  claimIds.map((claimId) => claimsById.get(claimId)),
]));

fs.writeFileSync(corpusPath, `${JSON.stringify({ questions, speakers: corpus.speakers }, null, 2)}\n`);

console.log(`Reclassified ${claimsById.size} unique claims across ${Object.keys(questions).length} questions.`);
for (const [questionId, claims] of Object.entries(questions)) console.log(`${questionId}: ${claims.length}`);
