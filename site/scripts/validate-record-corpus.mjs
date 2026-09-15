import corpus from '../src/data/ai-native-corpus.generated.json' with { type: 'json' };
import excerpts from '../src/data/record-source-excerpts.generated.json' with { type: 'json' };

const errors = [];
const positions = Object.entries(corpus.questions).flatMap(([question, records]) =>
  records.map((record) => ({ question, ...record })),
);
const claimIds = positions.map(({ claimId }) => claimId);

if (!positions.length) errors.push('The Record corpus has no published positions.');
if (new Set(claimIds).size !== claimIds.length) errors.push('The Record corpus contains duplicate claim IDs.');

for (const position of positions) {
  const excerpt = excerpts[`${position.speaker}|${position.timestamp}`];
  if (!excerpt?.transcript || !excerpt.turns?.length || !excerpt.sourceFile || !/^[a-f0-9]{64}$/.test(excerpt.sourceSha256 || '')) {
    errors.push(`${position.claimId} is missing its source-backed transcript excerpt.`);
  }
  if ('transcript' in position || 'context' in position) {
    errors.push(`${position.claimId || 'Unknown claim'} exposes editorial notes as reader-facing source text. Keep notes in editorialNotes; transcript excerpts need a separate provenance-backed schema.`);
  }
  if (!position.claimId || !position.claim || !position.speaker || !position.timestamp) {
    errors.push(`${position.claimId || 'Unknown claim'} is missing required source metadata.`);
  }
  if (!position.sourceAvailable || !/^https?:\/\//.test(position.video || '')) {
    errors.push(`${position.claimId || 'Unknown claim'} does not have a public recording.`);
  }
}

for (const [key, excerpt] of Object.entries(excerpts)) {
  const rendered = excerpt.turns.map(turn => `${turn.speaker}, ${turn.timestamp.startsWith('00:') ? turn.timestamp.slice(3) : turn.timestamp}: ${turn.text}`).join('\n\n');
  if (rendered !== excerpt.transcript || excerpt.turns.some(turn => !turn.segmentId || !turn.text)) {
    errors.push(`${key} has inconsistent transcript segments.`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Validated ${positions.length} source-linked Record positions.`);
