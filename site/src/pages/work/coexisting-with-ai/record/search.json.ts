import { questions } from '../../../../data/record-questions';
export function GET() {
  const transcripts = Object.fromEntries(questions.flatMap(q => q.evidence.map(item => [`${q.id}:${item.speaker}:${item.timestamp}`, item.transcript || ''])));
  return new Response(JSON.stringify(transcripts), {headers:{'Content-Type':'application/json'}});
}
