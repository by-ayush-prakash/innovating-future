import corpus from '../src/data/ai-native-corpus.generated.json' with { type: 'json' };

const errors = [];
const positions = Object.entries(corpus.questions).flatMap(([question, records]) =>
  records.map((record) => ({ question, ...record })),
);
const claimIds = positions.map(({ claimId }) => claimId);

if (!positions.length) errors.push('The Record corpus has no published positions.');
if (new Set(claimIds).size !== claimIds.length) errors.push('The Record corpus contains duplicate claim IDs.');

for (const position of positions) {
  if (!position.claimId || !position.claim || !position.speaker || !position.timestamp) {
    errors.push(`${position.claimId || 'Unknown claim'} is missing required source metadata.`);
  }
  if (!position.sourceAvailable || !/^https?:\/\//.test(position.video || '')) {
    errors.push(`${position.claimId || 'Unknown claim'} does not have a public recording.`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Validated ${positions.length} source-linked Record positions.`);
