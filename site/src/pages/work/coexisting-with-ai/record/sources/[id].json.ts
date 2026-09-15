import { questions } from '../../../../../data/record-questions';
import excerpts from '../../../../../data/record-source-excerpts.generated.json';
export function getStaticPaths() {
  return questions.flatMap(q => q.evidence).map((item, index) => ({
    params: { id: String(index) },
    props: { turns: (item.storySource || excerpts[`${item.speaker}|${item.timestamp}` as keyof typeof excerpts]).turns }
  }));
}
export function GET({ props }: { props: { turns: unknown } }) {
  return new Response(JSON.stringify(props.turns), { headers: { 'Content-Type': 'application/json' } });
}
