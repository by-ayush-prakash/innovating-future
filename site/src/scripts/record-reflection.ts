import definitions from '../data/record-reflections.json';
import { node as el } from './record-perspective';
export type ReflectionOption = { id: string; label: string; target: string; explanation: string };
type Answer = { choice: string; note: string };
const storageKey = 'cif-private-reflections-v1';
const answers = new Map<string, Answer>();
try {
  const stored = JSON.parse(sessionStorage.getItem(storageKey) || '{}');
  if (stored && typeof stored === 'object' && !Array.isArray(stored))
    for (const [key, value] of Object.entries(stored).slice(0, 300)) {
      const answer = value as Answer;
      if (typeof answer?.choice === 'string' && typeof answer?.note === 'string')
        answers.set(key, { choice: answer.choice, note: answer.note.slice(0, 1200) });
    }
} catch {}
const persist = () => {
  try {
    sessionStorage.setItem(storageKey, JSON.stringify(Object.fromEntries(answers)));
  } catch {}
};
let sequence = 0;
export function createReflection(
  root: string,
  key: string,
  onChange: (option: ReflectionOption | undefined) => void,
  onContinue: () => void,
) {
  const definition = definitions[key as keyof typeof definitions];
  if (!definition) return null;
  const privateKey = `${root}|${key}`;
  const saved = answers.get(privateKey);
  const answer: Answer = { choice: saved?.choice || '', note: saved?.note || '' };
  if (answer.choice !== 'skip' && !definition.options.some((o) => o.id === answer.choice))
    answer.choice = '';
  const section = el('section', '', 'journey-reflection');
  const heading = el('h3', definition.question);
  heading.id = `reflection-${++sequence}`;
  section.setAttribute('aria-labelledby', heading.id);
  const group = el('div', '', 'reflection-options');
  group.setAttribute('role', 'group');
  group.setAttribute('aria-labelledby', heading.id);
  const status = el('p', '', 'reflection-status');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  const buttons = definition.options.map((option) => {
    const button = el('button', '', 'reflection-option');
    const check = el('span', '✓', 'reflection-check');
    check.setAttribute('aria-hidden', 'true');
    button.append(el('span', option.label), check);
    button.type = 'button';
    button.dataset.reflectionOption = option.id;
    button.setAttribute('aria-pressed', String(answer.choice === option.id));
    button.addEventListener('click', () => {
      answer.choice = option.id;
      store();
      update();
      onChange(option);
    });
    group.append(button);
    return button;
  });
  const skip = el('button', 'Continue without answering', 'reflection-skip');
  skip.type = 'button';
  skip.addEventListener('click', () => {
    answer.choice = 'skip';
    store();
    update();
    onChange(undefined);
    onContinue();
  });
  const note = el('details', '', 'reflection-note');
  const noteToggle = el('summary', 'Put it in your own words');
  const label = el('label', 'Your note');
  const field = el('textarea');
  field.id = `${heading.id}-note`;
  label.htmlFor = field.id;
  field.maxLength = 1200;
  field.rows = 3;
  field.value = answer.note;
  field.placeholder = 'What are you trying to figure out?';
  field.addEventListener('input', () => {
    answer.note = field.value;
    store();
  });
  const privacy = el(
    'p',
    'Your note stays in this browser tab and is not included in shared links. Choose an option above to shape the next suggestion.',
    'reflection-privacy',
  );
  privacy.id = `${heading.id}-privacy`;
  field.setAttribute('aria-describedby', privacy.id);
  const clear = el('button', 'Clear my note', 'reflection-clear');
  clear.type = 'button';
  clear.addEventListener('click', () => {
    answer.note = '';
    field.value = '';
    store();
    field.focus({ preventScroll: true });
  });
  note.append(noteToggle, label, field, privacy, clear);
  const store = () => {
    answers.set(privateKey, { ...answer });
    persist();
  };
  const update = () => {
    buttons.forEach((button, i) =>
      button.setAttribute('aria-pressed', String(answer.choice === definition.options[i].id)),
    );
    status.textContent =
      answer.choice === 'skip'
        ? 'You can answer later.'
        : answer.choice
          ? 'Your next suggestion follows this choice. You can change it anytime.'
          : '';
  };
  update();
  section.append(heading, group, status, skip, note);
  return { element: section, selected: definition.options.find((o) => o.id === answer.choice) };
}
