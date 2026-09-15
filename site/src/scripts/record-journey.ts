import { initRecordMotion } from './record-motion';
import { createReflection, type ReflectionOption } from './record-reflection';
import {
  createPerspective,
  node as el,
  type Perspective,
  type ContextMode,
} from './record-perspective';
type Entry = { key: string; mode: ContextMode };
type Stage = 'perspectives' | 'reading' | 'reflection' | 'connections';
type State = { v: 1; root: string; entries: Entry[]; cursor?: { key: string; stage: Stage }; visited?: { key: string; stage: Stage }[] };
export function initRecordJourney() {
  const root = document.querySelector<HTMLElement>('[data-prototype]');
  const data = document.querySelector('#record-journey-data');
  if (!root || !data) return;
  initRecordMotion(root);
  const stories: Perspective[] = JSON.parse(data.textContent || '[]');
  const landingParams = new URLSearchParams(location.search);
  const isWelcome = !['question','view','journey','evidence','person','compare'].some(key => landingParams.has(key));
  const welcome = root.querySelector<HTMLElement>('.explore-welcome');
  let questionIndex: HTMLElement | null = null;
  if (isWelcome && welcome) {
    root.classList.add('show-welcome');
    welcome.hidden = false;

  }

  const featured = stories.filter((s) => s.standfirst);
  const byKey = new Map(stories.map((s) => [s.key, s]));
  const byEditorial = new Map(stories.map((s) => [s.editorialKey, s]));
  const states = new Map<string, State>();
  const panels = new Map<string, ReturnType<typeof createPerspective>>();
  let restoring = false;
  let activeRoot = 'understanding';
  const questionId = (key: string) => key.split(':')[0];
  const viewFor = (id: string) =>
    root.querySelector<HTMLElement>(`.question-view[data-view="${CSS.escape(id)}"]`)!;
  let viewportLockFrame = 0;
  const syncViewportLock = () => {
    cancelAnimationFrame(viewportLockFrame);
    viewportLockFrame = requestAnimationFrame(() => {
      const view = viewFor(activeRoot);
      const panel = view?.querySelector<HTMLElement>('.record-perspective:not([hidden]) .reading-panel');
      const expanded = !!view?.querySelector('.reading-context-slot:not([hidden]),.reading-recording:not([hidden])');
      const topbarHeight = root.querySelector<HTMLElement>('.topbar')?.getBoundingClientRect().height || 0;
      const fits = !!panel && panel.scrollHeight + topbarHeight + 36 <= innerHeight;
      root.classList.toggle('reading-viewport-locked', view?.dataset.journeyStage === 'reading' && !expanded && innerWidth > 900 && fits);
      if (root.classList.contains('reading-viewport-locked')) window.scrollTo({top:0,behavior:'instant'});
    });
  };
  initJourneyScroll(root);
  root.classList.add('journey-horizontal');
  // Size the perspective list from its actual position below the header.
  let pickerFrame = 0;
  const sizePerspectiveLists = () => {
    cancelAnimationFrame(pickerFrame);
    pickerFrame = requestAnimationFrame(() => {
      root.querySelectorAll<HTMLElement>('.journey-screen-picker').forEach(picker => {
        if (!picker.getClientRects().length) return;
        const available = Math.max(180, innerHeight - picker.getBoundingClientRect().top - 24);
        const value = `${available}px`;
        if (picker.style.getPropertyValue('--picker-height') !== value) picker.style.setProperty('--picker-height', value);
        const list = picker.querySelector<HTMLElement>('.onward-previews');
        if (list) { list.tabIndex = 0; list.setAttribute('aria-label', 'Perspectives'); list.setAttribute('role', 'region'); }
      });
    });
  };
  const pickerObserver = new MutationObserver(sizePerspectiveLists);
  pickerObserver.observe(root, {subtree:true,childList:true,attributes:true,attributeFilter:['hidden','class','data-journey-stage']});
  window.addEventListener('resize', () => { sizePerspectiveLists(); syncViewportLock(); });

  const nav = el('details', '', 'journey-revisit');
  nav.append(el('summary', 'History'));
  const list = el('nav');
  list.setAttribute('aria-label', 'Questions in your journey');
  nav.append(list);
  root.append(nav);
  nav.hidden = true;
  document.addEventListener(
    'click',
    (event) => {
      if (nav.open && !nav.contains(event.target as Node)) nav.open = false;
    },
    true,
  );
  nav.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.open) {
      event.stopPropagation();
      nav.open = false;
      nav.querySelector('summary')?.focus({ preventScroll: true });
    }
  });
  const stageLabels: Record<Stage, string> = {
    perspectives: 'Choose a perspective',
    reading: 'Read the perspective',
    reflection: 'Reflect',
    connections: 'Choose what comes next',
  };
  const makeJourneySteps = (
    visits: { key: string; stage: Stage }[],
    currentLabel: string,
    isCurrent: (visit: { key: string; stage: Stage }) => boolean,
    openVisit: (visit: { key: string; stage: Stage }) => void,
  ) => {
    const steps = el('details', '', 'journey-screen-steps') as HTMLDetailsElement;
    steps.style.setProperty('--journey-open-width', `${112 + (visits.length + 2) * 30}px`);
    const summary = el('summary');
    summary.setAttribute('aria-label', `Open journey. Current screen: ${currentLabel}`);
    summary.append(el('span', 'My Journey', 'journey-pill-label'));
    summary.append(el('span', '', 'journey-stage-dot'));
    steps.append(summary);
    steps.addEventListener('toggle', () => {
      summary.setAttribute('aria-label', `${steps.open ? 'Close' : 'Open'} journey. Current screen: ${currentLabel}`);
    });
    steps.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && steps.open) {
        steps.open = false;
        summary.focus({ preventScroll: true });
      }
    });
    const track = el('div', '', 'journey-dot-track');
    const home = el('button'); home.type = 'button';
    home.setAttribute('aria-label', 'Explore introduction');
    if (currentLabel === 'Explore') home.setAttribute('aria-current', 'step');
    home.append(el('span', '', 'journey-stage-dot'));
    home.onclick = () => { steps.open = false; history.pushState({}, '', location.pathname); returnToWelcome(); };
    track.append(home);
    const questions = el('button'); questions.type = 'button';
    questions.setAttribute('aria-label', 'Browse all questions');
    if (currentLabel === 'Questions') questions.setAttribute('aria-current', 'step');
    questions.append(el('span', '', 'journey-stage-dot'));
    questions.onclick = () => { steps.open = false; showQuestionIndex(); };
    track.append(questions);
    visits.forEach((visit) => {
      const button = el('button'); button.type = 'button';
      const label = stageLabels[visit.stage];
      button.setAttribute('aria-label', label);
      button.append(el('span', '', 'journey-stage-dot'));
      if (isCurrent(visit)) button.setAttribute('aria-current', 'step');
      button.onclick = () => { steps.open = false; openVisit(visit); };
      track.append(button);
    });
    steps.append(track);
    return steps;
  };
  document.addEventListener('pointerdown', (event) => {
    root.querySelectorAll<HTMLDetailsElement>('.journey-screen-steps[open]').forEach((steps) => {
      if (!steps.contains(event.target as Node)) steps.open = false;
    });
  }, true);
  const save = (replace = false) => {
    if (restoring || root.dataset.restoringNavigation === 'true') return;
    const state = states.get(activeRoot);
    if (!state) return;
    const url = new URL(location.href);
    url.searchParams.set('view', 'explore');
    url.searchParams.set('question', activeRoot);
    url.searchParams.delete('evidence');
    url.searchParams.set(
      'journey',
      JSON.stringify({
        ...state,
        entries: state.entries.map((e) => ({ ...e, key: byKey.get(e.key)!.editorialKey })),
      }),
    );
    history[replace ? 'replaceState' : 'pushState'](
      { ...history.state, journeyScroll: scrollY },
      '',
      url,
    );
    try {
      sessionStorage.setItem('cif-explore-journey-v1', JSON.stringify(state));
    } catch {}
  };
  let stageTransition = 0;
  const showStage = async (key: string, stage: Stage, direction = 1, persist = true) => {
    root.classList.remove('show-question-index');
    if (questionIndex) questionIndex.hidden = true;
    root.classList.remove('reading-viewport-locked');
    const state = states.get(activeRoot);
    if (!state) return;
    cancelJourneyMotion();
    const view = viewFor(activeRoot);
    const transitionId = ++stageTransition;
    const currentStage = view.dataset.journeyStage as Stage | undefined;
    const currentTarget = currentStage === 'perspectives'
      ? view.querySelector<HTMLElement>('.journey-screen-picker:not(.initial-perspective-picker)')
      : currentStage
        ? view.querySelector<HTMLElement>(`.journey-history > section:not([hidden]) ${currentStage === 'reading' ? '.record-perspective:not([hidden])' : currentStage === 'reflection' ? '.journey-reflection' : '.reflection-next'}`)
        : null;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (persist && currentStage && currentStage !== 'perspectives' && currentStage !== stage && currentTarget && !reducedMotion) {
      currentTarget.getAnimations().forEach(animation => animation.cancel());
      const outgoing = currentTarget.animate(
        [
          { opacity: 1, transform: 'translateX(0)' },
          { opacity: .28, transform: `translateX(${-direction * 34}px)` },
        ],
        { duration: 300, easing: 'cubic-bezier(.4,0,.6,1)', fill: 'forwards' },
      );
      await outgoing.finished.catch(() => {});
      outgoing.cancel();
      if (transitionId !== stageTransition) return;
    }
    state.cursor = { key, stage };
    view.dataset.journeyStage = stage;
    view.querySelectorAll<HTMLElement>('.journey-history > section').forEach((chapter) => {
      chapter.hidden = stage === 'perspectives' || chapter.dataset.journeyQuestion !== questionId(key);
      const picker = chapter.querySelector<HTMLElement>('.journey-siblings');
      if (picker) picker.hidden = true;
    });
    for (const [panelKey, panel] of panels) {
      if (panelKey !== `${activeRoot}|${key}` || stage !== 'reading') panel.stop();
    }
    let bar = view.querySelector<HTMLElement>('.journey-screen-nav');
    if (!bar) { bar = el('nav', '', 'journey-screen-nav'); view.prepend(bar); }
    bar.classList.remove('journey-entry-nav');
    bar.setAttribute('aria-label', 'Journey navigation');
    const visits = state.visited ||= [{ key: state.entries[0].key, stage: 'perspectives' }];
    const visitIndex = visits.findIndex(visit => visit.stage === stage && (stage === 'perspectives' ? questionId(visit.key) === questionId(key) : visit.key === key));
    if (visitIndex === -1) visits.push({ key, stage });
    const isCurrentVisit = (visit: { key: string; stage: Stage }) =>
      visit.stage === stage && (stage === 'perspectives' ? questionId(visit.key) === questionId(key) : visit.key === key);
    const steps = makeJourneySteps(
      visits,
      stageLabels[stage],
      isCurrentVisit,
      (visit) => showStage(visit.key, visit.stage, -1),
    );
    bar.replaceChildren(nav, steps);
    let screenPicker = view.querySelector<HTMLElement>('.journey-screen-picker:not(.initial-perspective-picker)');
    if (!screenPicker) { screenPicker = el('section', '', 'journey-screen-picker'); bar.after(screenPicker); }
    screenPicker.hidden = stage !== 'perspectives';
    if (stage === 'perspectives') {
      const cards = el('div', '', 'onward-previews');
      featured.filter(story => questionId(story.key) === questionId(key)).forEach(story => cards.append(makeCard(story, () => select(activeRoot, story.key, false))));
      const intro = el('header', '', 'perspective-intro');
      intro.append(el('h2', byKey.get(key)!.question), el('p', 'Different people notice different things. Choose an idea to explore, then follow it back to the conversation.'));
      screenPicker.replaceChildren(intro, cards);
    }
    if (stage === 'reading') {
      const readingHeading = view.querySelector<HTMLElement>('.journey-history > section:not([hidden]) .reading-heading');
      if (readingHeading) {
        let continuation = readingHeading.querySelector<HTMLElement>('.reading-next-steps');
        if (!continuation) {
          continuation = el('nav', '', 'reading-next-steps');
          continuation.setAttribute('aria-label', 'Continue exploring this perspective');
          readingHeading.append(continuation);
        }
        const hasReflection = !!view.querySelector('.journey-history > section:not([hidden]) .journey-reflection');
        const reflect = el('button', 'Reflect on this →', 'reading-reflect');
        reflect.type = 'button';
        reflect.onclick = () => showStage(key, 'reflection');
        const others = el('button', 'Hear another perspective →', 'reading-another');
        others.type = 'button';
        others.onclick = () => showStage(key, 'perspectives');
        const connected = el('button', 'Explore connected ideas →', 'reading-connected');
        connected.type = 'button';
        connected.onclick = () => showStage(key, 'connections');
        continuation.replaceChildren(...(hasReflection ? [reflect, others, connected] : [others, connected]));
      }
    }
    let forward = view.querySelector<HTMLButtonElement>('.journey-screen-forward');
    if (!forward) { forward = el('button', '', 'journey-screen-forward'); forward.type = 'button'; view.append(forward); }
    forward.hidden = stage !== 'reflection';
    forward.textContent = 'Explore next →';
    forward.onclick = () => showStage(key, stage === 'reading' ? 'reflection' : 'connections');
    // Keep a single active screen, with natural vertical reading inside that screen.
    const target = stage === 'perspectives' ? view.querySelector<HTMLElement>('.journey-screen-picker:not(.initial-perspective-picker)') :
      view.querySelector<HTMLElement>(`.journey-history > section:not([hidden]) ${stage === 'reading' ? '.record-perspective:not([hidden])' : stage === 'reflection' ? '.journey-reflection' : '.reflection-next'}`);
    if (target) {
      target.tabIndex = -1;
      target.focus({ preventScroll: true });
      target.getAnimations().forEach(animation => animation.cancel());
      if (!reducedMotion)
        target.animate(
          [
            { opacity: .2, transform: `translateX(${direction * 42}px)` },
            { opacity: 1, transform: 'translateX(0)' },
          ],
          { duration: 520, easing: 'cubic-bezier(.16,1,.3,1)' },
        );
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    syncViewportLock();
    if (persist) save();
  };
  const reveal = (target: HTMLElement) => {
    const chapter = target.closest<HTMLElement>('[data-journey-question]');
    const state = states.get(activeRoot);
    const entry = state?.entries.find(e => questionId(e.key) === chapter?.dataset.journeyQuestion);
    if (entry) showStage(entry.key, target.classList.contains('reflection-next') ? 'connections' : 'reading');
  };
  const updateNav = () => {
    list.replaceChildren();
    const state = states.get(activeRoot);
    nav.hidden = !state?.entries.length;
    if (!state) return;
    state.entries.forEach((entry) => {
      const story = byKey.get(entry.key)!;
      const button = el('button');
      button.type = 'button';
      button.append(el('strong', story.question), el('span', story.source.speaker));
      button.addEventListener('click', () => {
        nav.open = false;
        const panel = panels.get(`${activeRoot}|${entry.key}`);
        if (panel) reveal(panel.element);
      });
      list.append(button);
    });
  };
  const modeChanged = (id: string, key: string, mode: ContextMode) => {
    cancelJourneyMotion();
    const entry = states.get(id)?.entries.find((e) => e.key === key);
    if (entry) {
      entry.mode = mode;
      save();
    }
    syncViewportLock();
  };
  const makeCard = (story: Perspective, onClick: () => void, explanation = '') => {
    const item = el('article', '', 'onward-preview');
    const heading = el('div', '', 'onward-card-heading');
    heading.append(el('h4', story.title));
    const speaker = el('div', '', 'onward-speaker');
    const speakerCopy = el('span', '', 'onward-speaker-copy');
    speakerCopy.append(
      el('strong', story.source.speaker),
      el('span', story.source.role || 'Contributor to the Record', 'onward-speaker-role'),
    );
    speaker.append(
      el(
        'span',
        story.source.speaker
          .split(/\s+/)
          .map((w) => w[0])
          .slice(0, 2)
          .join(''),
        'onward-avatar',
      ),
      speakerCopy,
    );
    const action = el('button', '', 'onward-source');
    action.type = 'button';
    action.dataset.question = questionId(story.key);
    action.dataset.journeyKey = story.key;
    action.setAttribute('aria-label', `Read ${story.source.speaker}’s perspective`);
    action.append(el('span', 'Read this perspective'), el('span', '→', 'onward-arrow'));
    let opening = false;
    action.addEventListener('click', async () => {
      if (opening) return;
      opening = true;
      const screen = item.closest<HTMLElement>('.journey-screen-picker');
      const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
      try {
        if (screen && !reducedMotion) {
          const animation = screen.animate(
            [
              { opacity: 1, transform: 'translateX(0)' },
              { opacity: .28, transform: 'translateX(-34px)' },
            ],
            { duration: 300, easing: 'cubic-bezier(.4,0,.6,1)', fill: 'forwards' },
          );
          await animation.finished.catch(() => {});
        }
        onClick();
      } finally {
        screen?.getAnimations().forEach(animation => animation.cancel());
        opening = false;
      }
    });
    item.addEventListener('click', (e) => {
      if (!(e.target as Element).closest('button')) action.click();
    });
    item.append(heading, speaker, el('p', story.standfirst, 'onward-description'));
    if (explanation) item.append(el('p', explanation, 'onward-relation'));
    item.append(action);
    return item;
  };
  const renderConnections = (
    container: HTMLElement,
    story: Perspective,
    state: State,
    preferred?: ReflectionOption,
  ) => {
    container.replaceChildren();
    const visited = new Set(state.entries.map((e) => questionId(e.key)));
    const links = story.related
      .map((link) => ({ ...link, story: byEditorial.get(link.key) }))
      .filter((link) => link.story && !visited.has(questionId(link.story.key)));
    const related = el('section', '', 'journey-connection');
    const recommended = preferred ? byEditorial.get(preferred.target) : undefined;
    const alreadyVisited =
      recommended &&
      (states.get(state.root) || state).entries.some(
        (e) => questionId(e.key) === questionId(recommended.key),
      );
    related.append(
      el(
        'h3',
        recommended
          ? 'Follow your question'
          : links.length
            ? 'Keep exploring'
            : 'Choose another question',
      ),
    );
    if (recommended) {
      const preview = el('div', '', 'onward-previews');
      const card = makeCard(
        recommended,
        () => select(state.root, recommended.key, true),
        preferred!.explanation,
      );
      if (alreadyVisited) {
        related.append(
          el(
            'p',
            'This question is already in your journey. You can explore this perspective there.',
            'reflection-revisit',
          ),
        );
      }
      preview.append(card);
      related.append(preview);
    } else if (links.length) {
      const preview = el('div', '', 'onward-previews');
      for (const link of links.slice(0, 3)) {
        const next = link.story!;
        preview.append(makeCard(next, () => select(state.root, next.key, true), link.explanation));
      }
      related.append(
        el('p', 'Connections between these passages are suggested by CIF.', 'connection-credit'),
        preview,
      );
    } else {
      related.append(
        el(
          'p',
          'The direct connections from this perspective are already in your journey. There are other questions to explore.',
        ),
      );
    }
    const browse = el('details', '', 'journey-browse');
    browse.append(
      el('summary', recommended || links.length ? 'Explore other questions' : 'Browse questions'),
    );
    const choices = el('div', '', 'journey-question-choices');
    const ids = [...new Set(featured.map((s) => questionId(s.key)))];
    for (const id of ids) {
      const candidate = featured.find((s) => questionId(s.key) === id)!;
      const button = el('button', candidate.question);
      button.type = 'button';
      if (visited.has(id)) {
        button.append(el('span', 'Revisit'));
        button.addEventListener('click', () => {
          const entry = state.entries.find((e) => questionId(e.key) === id)!;
          reveal(panels.get(`${state.root}|${entry.key}`)!.element);
        });
      } else button.addEventListener('click', () => select(state.root, candidate.key, true));
      choices.append(button);
    }
    browse.append(choices);
    if (!links.length && !recommended) browse.open = true;
    related.append(browse);
    container.append(related);
  };
  const renderContinuation = (container: HTMLElement, story: Perspective, state: State) => {
    container.replaceChildren();
    const next = el('div', '', 'reflection-next');
    const reflection = createReflection(
      state.root,
      story.editorialKey,
      (option) => {
        cancelJourneyMotion();
        renderConnections(next, story, state, option);
      },
      () => reveal(next),
    );
    if (reflection) container.append(reflection.element);
    container.append(next);
    renderConnections(next, story, state, reflection?.selected);
  };
  const render = (state: State) => {
    const view = viewFor(state.root);
    if (!view) return;
    view.querySelector<HTMLElement>('.journey-history')?.removeAttribute('hidden');
    view.classList.add('views-revealed');
    view.dispatchEvent(new Event('reveal-perspectives'));
    let historyNode = view.querySelector<HTMLElement>(':scope > .journey-history');
    if (!historyNode) {
      historyNode = el('div', '', 'journey-history');
      view.append(historyNode);
    }
    state.entries.forEach((entry, index) => {
      const story = byKey.get(entry.key)!;
      const id = questionId(entry.key);
      let chapter = Array.from(historyNode!.children).find(
        (n) => (n as HTMLElement).dataset.journeyQuestion === id,
      ) as HTMLElement | undefined;
      if (!chapter) {
        chapter = el('section', '', index === 0 ? 'source-section open' : 'journey-chapter');
        chapter.dataset.journeyQuestion = id;
        historyNode!.append(chapter);
        if (!restoring && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
          chapter.classList.add('journey-arriving-line');
          chapter.addEventListener(
            'animationend',
            () => chapter!.classList.remove('journey-arriving-line'),
            { once: true },
          );
        }
        const change = el('button', '↑ Change perspective', 'reading-change');
        change.type = 'button';
        change.addEventListener('click', () => {
          const picker = chapter!.querySelector<HTMLElement>('.journey-siblings');
          if (picker) {
            showStage(states.get(state.root)!.entries.find(e => questionId(e.key) === id)!.key, 'perspectives', -1);
            return;
          }
        });
        chapter.append(change);
        const picker = el('div', '', 'journey-siblings onward-previews');
        picker.hidden = true;
        featured
          .filter((s) => questionId(s.key) === id)
          .forEach((s) =>
            picker.append(
              makeCard(s, () => {
                select(state.root, s.key, false);
                picker.hidden = true;
              }),
            ),
          );
        chapter.append(picker);
      }
      chapter.hidden = false;
      let panel = panels.get(`${state.root}|${entry.key}`);
      if (!panel) {
        panel = createPerspective(story, (mode) => modeChanged(state.root, entry.key, mode));
        panel.element.classList.add('journey-branch-source');
        panels.set(`${state.root}|${entry.key}`, panel);
        chapter.append(panel.element);
        if (!restoring && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
          panel.element.classList.add('journey-arriving');
          panel.element.addEventListener(
            'animationend',
            () => panel!.element.classList.remove('journey-arriving'),
            { once: true },
          );
        }
      }
      for (const [key, other] of panels) {
        if (
          key.startsWith(`${state.root}|`) &&
          questionId(key.slice(state.root.length + 1)) === id
        ) {
          const hidden = other !== panel;
          other.element.hidden = hidden;
          if (hidden) other.stop();
        }
      }
      if (
        panel.getMode() !== entry.mode ||
        (entry.mode === 'listen' && !panel.element.querySelector('iframe,audio'))
      )
        panel.setMode(entry.mode, false);
      let continuations = chapter.querySelector<HTMLElement>(':scope > .journey-continuations');
      if (!continuations) {
        continuations = el('div', '', 'journey-continuations');
        chapter.append(continuations);
      }
      chapter.insertBefore(panel.element, continuations);
      continuations.hidden = false;
      if (continuations.dataset.sourceKey !== entry.key) {
        renderContinuation(continuations, story, {
          ...state,
          entries: state.entries.slice(0, index + 1),
        });
        continuations.dataset.sourceKey = entry.key;
      }
    });
    Array.from(historyNode.children).forEach((n) => {
      const chapter = n as HTMLElement;
      chapter.hidden = !state.entries.some(
        (e) => questionId(e.key) === chapter.dataset.journeyQuestion,
      );
    });
    updateNav();
    const cursor = state.cursor;
    if (cursor) showStage(cursor.key, cursor.stage, 1, false);
  };
  const select = (id: string, key: string, append: boolean) => {
    if (!byKey.has(key)) return;
    cancelJourneyMotion();
    activeRoot = id;
    let state = states.get(id);
    if (!state) {
      state = { v: 1, root: id, entries: [] };
      states.set(id, state);
    }
    const qid = questionId(key);
    const existing = state.entries.find((e) => questionId(e.key) === qid);
    if (existing?.key === key) {
      if (!restoring) reveal(panels.get(`${id}|${key}`)!.element);
      return;
    }
    if (existing) {
      existing.key = key;
      existing.mode = 'closed';
    } else if (append || !state.entries.length) state.entries.push({ key, mode: 'closed' });
    else return;
    state.cursor = { key, stage: 'reading' };
    render(state);
    save();
    if (!restoring) reveal(panels.get(`${id}|${key}`)!.element);
  };
  const showQuestionPicker = (id: string) => {
    root.classList.remove('reading-viewport-locked');
    root.classList.remove('show-question-index');
    if (questionIndex) questionIndex.hidden = true;
    try { sessionStorage.setItem('cif-last-question', id); } catch {}
    const view = viewFor(id);
    if (!view || view.dataset.journeyStage) return;
    view.classList.add('selection-editorial');
    let picker = view.querySelector<HTMLElement>('.initial-perspective-picker');
    if (!picker) {
      picker = el('section', '', 'journey-screen-picker initial-perspective-picker');
      const intro = el('header', '', 'perspective-intro');
      intro.append(el('h2', featured.find(story => questionId(story.key) === id)!.question), el('p', 'Different people notice different things. Choose an idea to explore, then follow it back to the conversation.'));
      const cards = el('div', '', 'onward-previews');
      featured.filter(story => questionId(story.key) === id).forEach(story => cards.append(makeCard(story, () => select(id, story.key, false))));
      picker.append(intro, cards);
      view.prepend(picker);
    }
    let bar = view.querySelector<HTMLElement>('.journey-screen-nav');
    if (!bar) {
      bar = el('nav', '', 'journey-screen-nav journey-entry-nav');
      bar.setAttribute('aria-label', 'Journey navigation');
      const steps = makeJourneySteps(
        [{ key: featured.find(story => questionId(story.key) === id)!.key, stage: 'perspectives' }],
        stageLabels.perspectives,
        (visit) => visit.stage === 'perspectives',
        () => {},
      );
      bar.append(steps);
      view.prepend(bar);
    }
  };
  root.addEventListener('record:source', (event) => {
    const key = (event as CustomEvent<string>).detail;
    if (!byKey.has(key)) return;
    const id = questionId(key);
    const view = viewFor(id);
    if (view.hidden) {
      root.dataset.restoringNavigation = 'true';
      root.querySelector<HTMLButtonElement>(`[data-question="${CSS.escape(id)}"]`)?.click();
      delete root.dataset.restoringNavigation;
    }
    select(id, key, false);
  });
  root.addEventListener('record:leave', () => {
    for (const panel of panels.values()) panel.stop();
  });
  root.addEventListener('record:question', (event) => {
    if (restoring || root.dataset.restoringNavigation === 'true') return;
    activeRoot = (event as CustomEvent<string>).detail;
    const state = states.get(activeRoot);
    if (state) {
      render(state);
      save(true);
    } else {
      const url = new URL(location.href);
      url.searchParams.delete('journey');
      history.replaceState({ ...history.state }, '', url);
    }
    updateNav();
    showQuestionPicker(activeRoot);
  });
  const parse = (raw: string | null): State | null => {
    try {
      const value = JSON.parse(raw || 'null');
      if (
        value?.v !== 1 ||
        !viewFor(value.root) ||
        !Array.isArray(value.entries) ||
        !value.entries.length ||
        value.entries.length > 10
      )
        return null;
      const seen = new Set<string>();
      const entries: Entry[] = [];
      for (const rawEntry of value.entries) {
        const story = byKey.get(rawEntry.key) || byEditorial.get(rawEntry.key);
        const e = { ...rawEntry, key: story?.key };
        if (
          !byKey.has(e.key) ||
          !['closed', 'read', 'listen'].includes(e.mode) ||
          seen.has(questionId(e.key))
        )
          return null;
        seen.add(questionId(e.key));
        entries.push({ key: e.key, mode: e.mode });
      }
      if (questionId(entries[0].key) !== value.root) return null;
      const cursorStory = byKey.get(value.cursor?.key) || byEditorial.get(value.cursor?.key);
      const cursor = cursorStory && entries.some(e => e.key === cursorStory.key) && ['perspectives','reading','reflection','connections'].includes(value.cursor?.stage) ? { key: cursorStory.key, stage: value.cursor.stage } : { key: entries.at(-1)!.key, stage: 'reading' as Stage };
      const visited = Array.isArray(value.visited) ? value.visited.flatMap((visit: {key:string;stage:Stage}) => {
        const story = byKey.get(visit.key) || byEditorial.get(visit.key);
        return story && entries.some(e => e.key === story.key) && ['perspectives','reading','reflection','connections'].includes(visit.stage) ? [{key:story.key,stage:visit.stage}] : [];
      }) : undefined;
      return { v: 1, root: value.root, entries, cursor, visited };
    } catch {
      return null;
    }
  };
  const restore = (initial = false) => {
    const params = new URLSearchParams(location.search);
    if (params.get('view') && params.get('view') !== 'explore') return;
    let state = parse(params.get('journey'));
    if (initial && !state && !params.has('journey') && !params.has('question'))
      try {
        state = parse(sessionStorage.getItem('cif-explore-journey-v1'));
      } catch {}
    if (!state) {
      if (!initial) {
        for (const p of panels.values()) p.stop();
        root.querySelectorAll<HTMLElement>('.journey-history').forEach((n) => (n.hidden = true));
        nav.hidden = true;
        root.querySelectorAll<HTMLElement>('[data-journey-stage]').forEach(v => { delete v.dataset.journeyStage; v.querySelector('.journey-screen-nav')?.remove(); v.querySelector('.journey-screen-forward')?.remove(); });
      }
      return;
    }
    restoring = true;
    cancelJourneyMotion();
    for (const p of panels.values()) p.stop();
    activeRoot = state.root;
    states.set(state.root, state);
    root.dataset.restoringNavigation = 'true';
    root.querySelector<HTMLButtonElement>(`[data-question="${CSS.escape(state.root)}"]`)?.click();
    render(state);
    delete root.dataset.restoringNavigation;
    restoring = false;
    save(true);
  };
  const renderWelcomeHistory = () => {
    if (!welcome) return;
    let state = states.get(activeRoot);
    let lastQuestion: string | null = null;
    try {
      lastQuestion = sessionStorage.getItem('cif-last-question');
      if (!state) {
        const saved = parse(sessionStorage.getItem('cif-explore-journey-v1'));
        if (saved && (!lastQuestion || saved.root === lastQuestion)) {
          state = saved; activeRoot = saved.root; states.set(saved.root, saved);
        }
      }
    } catch {}
    const id = state?.root || lastQuestion;
    let bar = welcome.querySelector<HTMLElement>('.welcome-journey-nav');
    if (!bar) { bar = el('nav', '', 'journey-screen-nav welcome-journey-nav'); bar.setAttribute('aria-label', 'Your journey'); welcome.prepend(bar); }
    const visits = state?.visited?.length ? state.visited : id ? [{key:state?.entries[0]?.key || '',stage:'perspectives' as Stage}] : [];
    const steps = makeJourneySteps(
      visits,
      'Explore',
      () => false,
      (visit) => {
        if (!id || !viewFor(id)) return;
        root.classList.remove('show-welcome'); welcome.hidden = true;
        root.querySelector<HTMLButtonElement>(`[data-question="${CSS.escape(id)}"]`)?.click();
        if (state && visit.key) showStage(visit.key, visit.stage, -1);
        else showQuestionPicker(id);
      },
    );
    bar.replaceChildren(steps);
  };
  const returnToWelcome = () => {
    welcome?.getAnimations().forEach(animation => animation.cancel());
    for (const panel of panels.values()) panel.stop();
    root.classList.add('show-welcome');
    root.classList.remove('reading-viewport-locked');
    root.classList.remove('show-question-index');
    if (questionIndex) questionIndex.hidden = true;
    if (welcome) welcome.hidden = false;
    renderWelcomeHistory();
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  root.addEventListener('record:return-to-welcome', () => {
    history.pushState({}, '', location.pathname);
    returnToWelcome();
  });
  const showQuestionIndex = () => {
    for (const panel of panels.values()) panel.stop();
    root.classList.remove('show-welcome');
    root.classList.remove('reading-viewport-locked');
    if (welcome) welcome.hidden = true;
    if (!questionIndex) {
      questionIndex = el('section', '', 'journey-question-index');
      questionIndex.setAttribute('aria-labelledby', 'journey-question-index-title');
      const header = el('header');
      const eyebrow = el('p', 'The Co-Existence Record by CIF');
      const title = el('h1', 'What do you want to explore?');
      title.id = 'journey-question-index-title';
      header.append(eyebrow, title, el('p', 'Choose a question, then explore how different people answer it.'));
      const grid = el('div', '', 'journey-question-grid');
      const seen = new Set<string>();
      featured.forEach((story) => {
        const id = questionId(story.key);
        if (seen.has(id)) return;
        seen.add(id);
        const source = root.querySelector<HTMLButtonElement>(`[data-question="${CSS.escape(id)}"]`);
        const card = el('button', '', `journey-question-card journey-question-card--${id}`);
        card.type = 'button';
        const number = source?.querySelector(':scope > span')?.textContent?.trim() || String(seen.size).padStart(2, '0');
        card.append(el('span', number), el('strong', story.question), el('i', '→'));
        card.onclick = () => {
          root.classList.remove('show-question-index');
          questionIndex!.hidden = true;
          source?.click();
          const existing = states.get(id);
          if (existing?.entries[0]) {
            void showStage(existing.entries[0].key, 'perspectives');
          } else {
            showQuestionPicker(id);
            const url = new URL(location.href);
            url.searchParams.set('question', id);
            url.searchParams.set('choose', '1');
            history.pushState(history.state, '', url);
          }
        };
        grid.append(card);
      });
      questionIndex.append(header, grid);
      root.querySelector('.workspace')?.append(questionIndex);
    }
    let journey = questionIndex.querySelector<HTMLElement>('.journey-question-index-nav');
    if (!journey) {
      journey = el('nav', '', 'journey-screen-nav journey-question-index-nav');
      journey.setAttribute('aria-label', 'Your journey');
      questionIndex.prepend(journey);
    }
    journey.replaceChildren(makeJourneySteps([], 'Questions', () => false, () => {}));
    root.classList.add('show-question-index');
    questionIndex.hidden = false;
    questionIndex.querySelector<HTMLElement>('h1')?.focus({preventScroll:true});
    window.scrollTo({top:0,behavior:'instant'});
  };
  root.querySelectorAll('[data-show-about], [data-open-contribution]').forEach(button => button.addEventListener('click', () => {
    root.classList.remove('show-welcome');
    if (welcome) welcome.hidden = true;
  }));
  let openingQuestion = false;
  welcome?.addEventListener('click', async (event) => {
    const card = (event.target as Element).closest<HTMLAnchorElement>('.welcome-card');
    if (!card || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (openingQuestion) return;
    openingQuestion = true;
    const id = new URL(card.href).searchParams.get('question')!;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animations: Animation[] = [];
    let transitionCard: HTMLElement | null = null;
    let transitionGhost: HTMLElement | null = null;
    try {
      if (!reducedMotion) {
        const rect = card.getBoundingClientRect();
        const cardStyle = getComputedStyle(card);
        transitionCard = document.createElement('div');
        transitionCard.classList.add('record-card-transition');
        transitionCard.setAttribute('aria-hidden', 'true');
        Object.assign(transitionCard.style, {
          top: `${rect.top}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          borderRadius: cardStyle.borderRadius,
          backgroundColor: cardStyle.backgroundColor,
        });
        transitionGhost = card.cloneNode(true) as HTMLElement;
        transitionGhost.classList.add('record-card-ghost');
        transitionGhost.setAttribute('aria-hidden', 'true');
        transitionGhost.removeAttribute('href');
        Object.assign(transitionGhost.style, {
          top: `${rect.top}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          borderRadius: cardStyle.borderRadius,
        });
        root.append(transitionCard, transitionGhost);
        const outgoing = transitionCard.animate(
          [
            { top: `${rect.top}px`, left: `${rect.left}px`, width: `${rect.width}px`, height: `${rect.height}px`, borderRadius: cardStyle.borderRadius },
            { top: '0px', left: '0px', width: '100vw', height: '100dvh', borderRadius: '0px' },
          ],
          { duration: 620, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'forwards' },
        );
        const ghostExit = transitionGhost.animate(
          [
            { opacity: 1, transform: 'scale(1)' },
            { opacity: 0, transform: 'scale(.985)' },
          ],
          { duration: 240, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' },
        );
        animations.push(ghostExit);
        animations.push(outgoing);
        await outgoing.finished.catch(() => {});
      }
      root.classList.remove('show-welcome');
      welcome.hidden = true;
      root.querySelector<HTMLButtonElement>(`[data-question="${CSS.escape(id)}"]`)?.click();
      showQuestionPicker(id);
      const questionUrl = new URL(location.href);
      questionUrl.searchParams.set('choose', '1');
      history.replaceState(history.state, '', questionUrl);
      const picker = viewFor(id)?.querySelector<HTMLElement>('.initial-perspective-picker');
      const heading = picker?.querySelector<HTMLElement>('h2');
      heading?.setAttribute('tabindex', '-1');
      heading?.focus({preventScroll:true});
      window.scrollTo({top:0,behavior:'instant'});
      if (!reducedMotion && transitionCard) {
        await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
        const reveal = transitionCard.animate(
          [{ top: '0px' }, { top: `-${innerHeight}px` }],
          { duration: 420, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'forwards' },
        );
        const destination = picker?.animate(
          [{ transform: 'translateY(14px)' }, { transform: 'translateY(0)' }],
          { duration: 500, easing: 'cubic-bezier(.16,1,.3,1)' },
        );
        animations.push(reveal);
        if (destination) animations.push(destination);
        await reveal.finished.catch(() => {});
      }
    } finally {
      animations.forEach(animation => animation.cancel());
      transitionCard?.remove();
      transitionGhost?.remove();
      openingQuestion = false;
    }
  });
  window.addEventListener('popstate', () => setTimeout(() => {
    if (!location.search) { returnToWelcome(); return; }
    root.classList.remove('show-welcome');
    if (welcome) welcome.hidden = true;
    restore(false);
    showQuestionPicker(new URLSearchParams(location.search).get('question') || 'understanding');
  }, 0));
  if (isWelcome) renderWelcomeHistory();
  if (!isWelcome) setTimeout(() => {
    restore(true);
    showQuestionPicker(new URLSearchParams(location.search).get('question') || 'understanding');
  }, 0);
}
let scrollFrame = 0;
export function cancelJourneyMotion() {
  cancelAnimationFrame(scrollFrame);
  scrollFrame = 0;
}
function glideTo(top: number) {
  cancelJourneyMotion();
  const from = window.scrollY;
  const destination = Math.max(
    0,
    Math.min(top, document.documentElement.scrollHeight - innerHeight),
  );
  const distance = destination - from;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo({ top: destination, behavior: 'instant' });
    return;
  }
  const duration = Math.min(1000, Math.max(480, 480 + Math.abs(distance) * 0.22));
  const started = performance.now();
  const frame = (now: number) => {
    const t = Math.min(1, (now - started) / duration);
    const eased = t * t * t * (t * (t * 6 - 15) + 10);
    window.scrollTo({ top: from + distance * eased, behavior: 'instant' });
    scrollFrame = t < 1 ? requestAnimationFrame(frame) : 0;
  };
  scrollFrame = requestAnimationFrame(frame);
}
export function scrollToRecordSection(target: HTMLElement) {
  const header = document.querySelector('.prototype .topbar')?.getBoundingClientRect().height || 78;
  glideTo(window.scrollY + target.getBoundingClientRect().top - header - 16);
}
function initJourneyScroll(root: HTMLElement) {
  // Manual input always owns scrolling; buttons alone initiate a glide.
  window.addEventListener('wheel', cancelJourneyMotion, { passive: true });
  window.addEventListener('touchstart', cancelJourneyMotion, { passive: true });
  window.addEventListener('pointerdown', cancelJourneyMotion, { passive: true });
  window.addEventListener('keydown', cancelJourneyMotion);
  root.classList.add('journey-stepped-scroll');
}
