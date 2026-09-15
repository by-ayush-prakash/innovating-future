"""Resolve editorial reading passages to exact supplied transcript segments.
Run with --check to reject drift in the source text or its provenance.
"""
from pathlib import Path
import json,re,hashlib,sys
site=Path(__file__).resolve().parents[1]
archive=Path('/Users/ayushprakash/Documents/Codex/Co-Existing-with-AI-Report/02 - Interview Corpus')
stories=json.loads((site/'src/data/record-editorial.json').read_text())
excerpts=json.loads((site/'src/data/record-source-excerpts.generated.json').read_text())
out={}
for key,story in stories.items():
 question,speaker,time=key.split(':',2)
 old=excerpts[f'{speaker}|{time}']
 f=archive/old['sourceFile'];text=f.read_text()
 turns=[dict(timestamp=m[1],segmentId=m[2],speaker=m[3],text=m[4]) for m in re.finditer(r'^\[([^\]]+)\] (E\d+-S\d+) \| ([^:]+): (.*)$',text,re.M)]
 ids=story.get('segments',[t['segmentId'] for t in old['turns']])
 selected=[t for t in turns if t['segmentId'] in ids]
 assert [t['segmentId'] for t in selected]==ids,(key,'Missing or out-of-order source segments')
 guest=next(t for t in selected if t['speaker']!='Ayush Prakash')
 assert guest['speaker']=={'Nick Nadeau':'Nicholas Nadeau'}.get(speaker,speaker)
 out[key]={'sourceFile':old['sourceFile'],'sourceSha256':hashlib.sha256(f.read_bytes()).hexdigest(),'timestamp':guest['timestamp'].removeprefix('00:'),'turns':selected,'transcript':'\n\n'.join(f"{t['speaker']}, {t['timestamp'].removeprefix('00:')}: {t['text']}" for t in selected)}
serialized=json.dumps(out,ensure_ascii=False,indent=2)+'\n'
f=site/'src/data/record-editorial-sources.generated.json'
if '--check' in sys.argv:assert f.read_text()==serialized,'Editorial source provenance has changed'
else:f.write_text(serialized)
print(f'Verified {len(out)} editorial passages against original transcript files.')
