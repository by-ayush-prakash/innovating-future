import { bindContextChooser } from "./record-context";
export type ContextMode = "closed" | "read" | "listen";
export type Perspective = {
  key: string;
  editorialKey: string;
  question: string;
  questionSubtitle?: string;
  title: string;
  summary: string;
  standfirst: string;
  kind: string;
  source: {
    speaker: string;
    role: string;
    contribution: string;
    timestamp: string;
    video: string;
    turnsUrl?: string;
    turns: { speaker: string; timestamp: string; text: string }[];
  };
  related: { key: string; explanation: string; kind: string }[];
};
export const node = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  text = "",
  className = "",
) => {
  const el = document.createElement(tag);
  el.textContent = text;
  el.className = className;
  return el;
};
let sequence = 0;
export function createPerspective(
  story: Perspective,
  onMode: (mode: ContextMode) => void,
) {
  const element = node("section", "", "record-perspective");
  element.dataset.journeyKey = story.key;
  const id = `reading-${++sequence}`;
  const panel = node("div", "", "reading-panel");
  const title = node("h2", story.title, "reading-title");
  title.setAttribute("data-inspector-claim", "");
  title.tabIndex = -1;
  const standfirst = node("p", story.standfirst, "source-standfirst");
  standfirst.setAttribute("data-journey-standfirst", "");
  standfirst.hidden = !story.standfirst;
  const description = node("p", story.summary, "reading-description");
  description.setAttribute("data-journey-summary", "");
  const controls = node("div", "", "reading-controls");
  const profile = node("div", "", "reading-person reading-attribution");
  profile.tabIndex = 0;
  profile.setAttribute(
    "aria-label",
    `Perspective by ${story.source.speaker}. Focus to show more information.`,
  );
  const identity = node("div", "", "reading-attribution-person");
  const follow = node(
    "button",
    "See more in Follow →",
    "reading-follow-person",
  );
  follow.type = "button";
  follow.setAttribute(
    "aria-label",
    `See all of ${story.source.speaker}’s contributions in Follow`,
  );
  follow.addEventListener("click", () => {
    element.dispatchEvent(
      new CustomEvent("record:follow-person", {
        bubbles: true,
        detail: story.source.speaker,
      }),
    );
  });
  const attributionLine = node("p", "", "reading-attribution-line");
  attributionLine.append(
    node("span", "Perspective by: "),
    node("strong", story.source.speaker),
  );
  identity.append(attributionLine);
  profile.append(identity);
  const contribution = node("div", "", "reading-attribution-detail");
  contribution.append(
    node(
      "p",
      story.source.role || "Contributor to the Record",
      "reading-attribution-role",
    ),
  );
  if (story.source.contribution)
    contribution.append(
      node("p", story.source.contribution, "reading-attribution-focus"),
    );
  contribution.append(follow);
  profile.append(contribution);
  const context = node("details", "", "branch-context reading-context");
  const trigger = node("summary", "Listen or read the context");
  trigger.setAttribute("data-context-toggle", "");
  trigger.setAttribute("aria-controls", `${id}-options`);
  const plus = node("span", "+");
  plus.setAttribute("aria-hidden", "true");
  trigger.append(plus);
  const options = node("div", "", "context-options branch-context-options");
  options.id = `${id}-options`;
  const listen = node("button");
  listen.type = "button";
  listen.setAttribute("data-inspector-video", "");
  const read = node("button");
  read.type = "button";
  read.setAttribute("data-context-read", "");
  for (const [button, icon, label] of [
    [listen, "▶", "Listen"],
    [read, "≡", "Read"],
  ] as const) {
    const symbol = node("span", icon);
    symbol.setAttribute("aria-hidden", "true");
    button.append(symbol, node("span", label));
  }
  options.append(listen, read);
  context.append(trigger, options);
  const heading = node("div", "", "reading-heading");
  heading.append(profile, title);
  controls.append(context);
  panel.append(heading, standfirst, description, controls);
  element.append(panel);
  const reading = node("div", "", "reading-context-slot");
  reading.setAttribute("data-context-reading", "");
  reading.hidden = true;
  const transcript = node(
    "section",
    "",
    "source-conversation branch-transcript",
  );
  const transcriptHead = node("header", "", "source-conversation-head");
  const transcriptClose = node("button", "×", "source-conversation-close");
  transcriptClose.type = "button";
  transcriptClose.setAttribute("aria-label", "Close conversation");
  transcriptHead.append(node("h3", "In the conversation"), transcriptClose);
  transcript.append(transcriptHead);
  const turns = node("div", "", "reading-turns");
  turns.setAttribute("data-inspector-transcript", "");
  let sourceRequest: Promise<void> | null = null;
  const renderTurns = (sourceTurns: Perspective["source"]["turns"]) => {
    turns.replaceChildren();
    for (const turn of sourceTurns) {
      const article = node("article", "", "source-turn");
      article.dataset.initials = turn.speaker
        .split(/\s+/)
        .map((word) => word[0])
        .slice(0, 2)
        .join("");
      const header = node("header");
      header.append(
        node("strong", turn.speaker),
        node("span", turn.timestamp, "source-turn-time"),
      );
      article.append(header);
      const sentences = turn.text.match(
        /[^.!?]+[.!?]+(?:[’”"])?(?:\s+|$)|.+$/g,
      ) || [turn.text];
      let chunk = "";
      for (const sentence of sentences) {
        chunk += sentence;
        if (chunk.trim().split(/\s+/).length >= 85) {
          article.append(node("p", chunk.trim()));
          chunk = "";
        }
      }
      if (chunk.trim()) article.append(node("p", chunk.trim()));
      turns.append(article);
    }
  };
  const loadTurns = () => {
    if (sourceRequest) return sourceRequest;
    if (!story.source.turnsUrl) {
      renderTurns(story.source.turns);
      return Promise.resolve();
    }
    turns.setAttribute("aria-busy", "true");
    turns.replaceChildren(node("p", "Loading the source passage…"));
    sourceRequest = fetch(story.source.turnsUrl)
      .then((response) => {
        if (!response.ok) throw new Error("Source unavailable");
        return response.json();
      })
      .then(renderTurns)
      .catch(() => {
        sourceRequest = null;
        const retry = node("button", "Try loading the source again");
        retry.type = "button";
        retry.addEventListener("click", () => {
          void loadTurns();
        });
        turns.replaceChildren(
          node("p", "The source passage could not load."),
          retry,
        );
      })
      .finally(() => turns.removeAttribute("aria-busy"));
    return sourceRequest;
  };
  transcript.append(
    node(
      "p",
      "Original interview passage. The summary above is CIF’s interpretation.",
      "reading-provenance",
    ),
    turns,
  );
  reading.append(transcript);
  const recording = node("div", "", "branch-recording reading-recording");
  recording.setAttribute("data-inspector-media", "");
  recording.hidden = true;
  element.append(reading, recording);
  const chooser = bindContextChooser(context, trigger, options);
  let mode: ContextMode = "closed";
  const setMode = (next: ContextMode, notify = true) => {
    // Move focus before removing its active menu item from layout.
    if (notify) trigger.focus({ preventScroll: true });
    chooser.close();
    mode = next;
    reading.hidden = next !== "read";
    if (next === "read") void loadTurns();
    recording.hidden = next !== "listen";
    recording.querySelector("audio")?.pause();
    recording.replaceChildren();
    if (next === "listen") {
      const recordingHeader = node("header", "", "reading-source-head");
      const recordingHeading = node("div");
      recordingHeading.append(
        node("span", "Source recording", "reading-source-label"),
        node("h3", `Conversation with ${story.source.speaker}`),
        node("p", `This passage begins at ${story.source.timestamp}.`),
      );
      const close = node("button", "×");
      close.type = "button";
      close.setAttribute("aria-label", "Close recording");
      close.setAttribute("data-close-inspector-media", "");
      close.addEventListener("click", () => setMode("closed"));
      recordingHeader.append(recordingHeading, close);
      const media = node("div", "", "reading-media");
      const url = new URL(story.source.video);
      const videoId =
        url.hostname === "youtu.be"
          ? url.pathname.slice(1)
          : url.searchParams.get("v");
      if (videoId) {
        const frame = node("iframe");
        frame.title = `Conversation with ${story.source.speaker}`;
        const seconds = story.source.timestamp
          .split(":")
          .reduce((total, value) => total * 60 + Number(value), 0);
        frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?start=${seconds}&rel=0`;
        frame.allow = "encrypted-media; picture-in-picture";
        frame.allowFullscreen = true;
        media.append(frame);
      } else if (
        url.hostname === "anchor.fm" ||
        /\.(mp3|m4a|wav)(?:$|\?)/i.test(story.source.video)
      ) {
        const audio = node("audio");
        audio.controls = true;
        audio.preload = "metadata";
        audio.src = story.source.video;
        audio.setAttribute("data-inspector-audio", "");
        audio.addEventListener(
          "loadedmetadata",
          () => {
            audio.currentTime = story.source.timestamp
              .split(":")
              .reduce((total, value) => total * 60 + Number(value), 0);
          },
          { once: true },
        );
        media.append(audio);
      } else {
        const link = node("a", "Open the recording ↗");
        link.href = story.source.video;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        media.append(link);
      }
      recording.append(recordingHeader, media);
    }
    if (notify) onMode(next);
  };
  read.addEventListener("click", () => setMode("read"));
  listen.addEventListener("click", () => setMode("listen"));
  transcriptClose.addEventListener("click", () => setMode("closed"));
  return {
    element,
    setMode,
    getMode: () => mode,
    stop: () => {
      recording.querySelector("audio")?.pause();
      recording.replaceChildren();
      chooser.close();
    },
    focus: () => title.focus({ preventScroll: true }),
  };
}
