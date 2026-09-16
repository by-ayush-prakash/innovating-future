import definitions from "../data/record-reflections.json";
import { node as el } from "./record-perspective";
export type ReflectionOption = {
  id: string;
  label: string;
  target: string;
  explanation: string;
};
type Answer = { choice: string; note: string };
const storageKey = "cif-private-reflections-v1";
const answers = new Map<string, Answer>();
try {
  const stored = JSON.parse(sessionStorage.getItem(storageKey) || "{}");
  if (stored && typeof stored === "object" && !Array.isArray(stored))
    for (const [key, value] of Object.entries(stored).slice(0, 300)) {
      const answer = value as Answer;
      if (
        typeof answer?.choice === "string" &&
        typeof answer?.note === "string"
      )
        answers.set(key, {
          choice: answer.choice,
          note: answer.note.slice(0, 1200),
        });
    }
} catch {}
const persist = () => {
  try {
    sessionStorage.setItem(
      storageKey,
      JSON.stringify(Object.fromEntries(answers)),
    );
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
  const answer: Answer = {
    choice: saved?.choice || "",
    note: saved?.note || "",
  };
  if (
    answer.choice !== "skip" &&
    !definition.options.some((o) => o.id === answer.choice)
  )
    answer.choice = "";
  const section = el("section", "", "journey-reflection");
  const heading = el("h3", definition.question);
  heading.id = `reflection-${++sequence}`;
  section.setAttribute("aria-labelledby", heading.id);
  const group = el("div", "", "reflection-options");
  group.setAttribute("role", "group");
  group.setAttribute("aria-labelledby", heading.id);
  const status = el("p", "", "reflection-status");
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  const buttons = definition.options.map((option) => {
    const button = el("button", "", "reflection-option");
    const check = el("span", "✓", "reflection-check");
    check.setAttribute("aria-hidden", "true");
    button.append(el("span", option.label), check);
    button.type = "button";
    button.dataset.reflectionOption = option.id;
    button.setAttribute("aria-pressed", String(answer.choice === option.id));
    button.addEventListener("click", () => {
      answer.choice = option.id;
      store();
      update();
      onChange(option);
    });
    group.append(button);
    return button;
  });
  const intro = el("header", "", "reflection-intro");
  intro.append(
    el("p", "Pause and reflect", "reflection-eyebrow"),
    heading,
    el(
      "p",
      "What matters to you after reading this perspective? There’s no right answer.",
      "reflection-intro-copy",
    ),
  );
  const body = el("div", "", "reflection-body");
  const guidance = el(
    "p",
    "Choose a response to find a connected idea. You can also add your own thoughts.",
    "reflection-guidance",
  );
  const note = el("div", "", "reflection-note");
  const label = el("label", "Your own thoughts (optional)");
  const field = el("textarea");
  field.id = `${heading.id}-note`;
  label.htmlFor = field.id;
  field.maxLength = 1200;
  field.rows = 3;
  field.value = answer.note;
  field.placeholder =
    "What would you want to keep, question, or think about further?";
  field.addEventListener("input", () => {
    answer.note = field.value;
    store();
  });
  const privacy = el(
    "p",
    "Your thoughts stay in this browser tab and aren’t included in shared links.",
    "reflection-privacy",
  );
  privacy.id = `${heading.id}-privacy`;
  field.setAttribute("aria-describedby", privacy.id);
  const clear = el("button", "Clear my note", "reflection-clear");
  clear.type = "button";
  clear.addEventListener("click", () => {
    answer.note = "";
    field.value = "";
    store();
    field.focus({ preventScroll: true });
  });
  note.append(label, field, privacy, clear);
  const proceed = el(
    "button",
    "Continue to connected ideas →",
    "reflection-continue",
  );
  proceed.type = "button";
  proceed.addEventListener("click", () => {
    if (!answer.choice) {
      answer.choice = "skip";
      store();
      onChange(undefined);
    }
    onContinue();
  });
  const store = () => {
    answers.set(privateKey, { ...answer });
    persist();
  };
  const update = () => {
    buttons.forEach((button, i) =>
      button.setAttribute(
        "aria-pressed",
        String(answer.choice === definition.options[i].id),
      ),
    );
    status.textContent =
      answer.choice === "skip"
        ? "You can answer later."
        : answer.choice
          ? "Selected. You can change your choice before continuing."
          : "";
  };
  update();
  body.append(guidance, group, status, note, proceed);
  section.append(intro, body);
  return {
    element: section,
    selected: definition.options.find((o) => o.id === answer.choice),
  };
}
