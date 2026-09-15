"""Build Record excerpts from supplied transcript segments, never analysis notes.
Run with --check to verify the checked-in excerpts against the source archive.
"""
import argparse
import hashlib
import json
import re
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--archive', type=Path, default=Path('/Users/ayushprakash/Documents/Codex/Co-Existing-with-AI-Report/02 - Interview Corpus'))
parser.add_argument('--check', action='store_true')
args = parser.parse_args()
site = Path(__file__).resolve().parents[1]
corpus = json.loads((site / 'src/data/ai-native-corpus.generated.json').read_text())
output = site / 'src/data/record-source-excerpts.generated.json'
pattern = re.compile(r'^\[([^\]]+)\] (E\d+-S\d+) \| ([^:]+): (.*)$', re.M)

def seconds(value):
    result = 0
    for part in value.split(':'):
        result = result * 60 + int(part)
    return result

def display_time(value):
    return value[3:] if value.startswith('00:') else value

packages = {}
for folder in args.archive.iterdir():
    transcript = folder / '02 - Clean Transcript/Transcript - Normalized.txt'
    if not transcript.exists():
        continue
    content = transcript.read_text()
    turns = [dict(timestamp=m[1], segmentId=m[2], speaker=m[3], text=m[4]) for m in pattern.finditer(content)]
    packages[folder.name.split(' - ')[0]] = (folder, transcript, turns)

result = {}
def save(key, package, index, claim_id=None):
    folder, transcript, turns = package
    selected = turns[max(0, index-1):index+1] if index and turns[index-1]['speaker'] == 'Ayush Prakash' else [turns[index]]
    result[key] = dict(
        claimId=claim_id,
        sourceFile=str(transcript.relative_to(args.archive)),
        sourceSha256=hashlib.sha256(transcript.read_bytes()).hexdigest(),
        reviewState='supplied_transcript_recording_review_pending',
        turns=selected,
        transcript='\n\n'.join(f"{t['speaker']}, {display_time(t['timestamp'])}: {t['text']}" for t in selected),
    )

for records in corpus['questions'].values():
    for record in records:
        package = packages[record['personId']]
        claims = json.loads((package[0] / '03 - Claims and Notes/Claims - Normalized.json').read_text())
        claim = next(c for c in claims if c['claimId'] == record['claimId'])
        index = next(i for i,t in enumerate(package[2]) if t['segmentId'] == claim['segmentId'])
        turn = package[2][index]
        assert turn['speaker'] == {'Nick Nadeau': 'Nicholas Nadeau'}.get(record['speaker'], record['speaker']), (record['claimId'], 'speaker mismatch')
        assert seconds(turn['timestamp']) <= seconds(record['timestamp']), (record['claimId'], 'claim precedes segment')
        if index + 1 < len(package[2]):
            assert seconds(record['timestamp']) < seconds(package[2][index+1]['timestamp']), (record['claimId'], 'claim follows segment')
        save(record['speaker']+'|'+record['timestamp'], package, index, record['claimId'])

seed = (site / 'src/data/ai-native-prototype.ts').read_text().split('const evidenceFromSeed')[0]
for speaker,timestamp in re.findall(r'speaker: "([^"]+)",\s*segment: "[^"]+",\s*timestamp: "([^"]+)"', seed):
    matches = [(p,i) for p in packages.values() for i,t in enumerate(p[2]) if t['speaker'] == speaker and seconds(t['timestamp']) == seconds(timestamp)]
    assert len(matches) == 1, (speaker,timestamp,len(matches))
    save(speaker+'|'+timestamp, *matches[0])

serialized = json.dumps(result, ensure_ascii=False, indent=2)+'\n'
if args.check:
    assert output.read_text() == serialized, 'Excerpts differ from supplied source segments. Rebuild and review the source changes.'
else:
    output.write_text(serialized)
print(f'{"Verified" if args.check else "Restored"} {len(result)} excerpts against supplied transcript segments.')
