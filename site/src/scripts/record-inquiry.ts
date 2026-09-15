export function initRecordInquiry() {
    type InquiryProgress = { started?: string; current?: string; opened: string[]; question?: string; challenge?: number; evidenceResponse?: string };
    type InquiryStore = Record<string, InquiryProgress>;
    const inquiryRoot = document.querySelector<HTMLElement>('[data-prototype]');
    const inquiryApp = inquiryRoot?.querySelector<HTMLElement>('[data-app]');
    const storageKey = 'cif-inquiry-trail-v1';
    const stanceLabels: Record<string, string> = { lean: 'I lean toward this reading', different: 'I see it differently', more: 'I need more evidence' };
    const stanceFeedbackLabels: Record<string, string> = { lean: 'Your next useful check is the strongest disagreement.', different: 'Name the evidence that supports your alternative.', more: 'Keep the question open and specify the evidence you still need.' };
    const evidenceResponseLabels: Record<string, string> = { yes: 'Yes, this could change my view', partly: 'It would matter, but would not settle it', no: 'No, I would need a different test' };
    let inquiryStore: InquiryStore = {};
    try { inquiryStore = JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch { inquiryStore = {}; }
    const saveInquiry = () => { try { localStorage.setItem(storageKey, JSON.stringify(inquiryStore)); } catch {} };
    const progressFor = (id: string): InquiryProgress => inquiryStore[id] ||= { opened: [] };
    const activeQuestionId = () => inquiryRoot?.querySelector<HTMLButtonElement>('[data-question].active')?.dataset.question || 'understanding';
    const chooseRecommendation = (view: HTMLElement, progress: InquiryProgress) => {
      const cards = [...view.querySelectorAll<HTMLButtonElement>('[data-evidence]')];
      const unopened = cards.filter((card) => !progress.opened.includes(card.dataset.evidenceKey || ''));
      if (!unopened.length) return null;
      const desired = progress.current === 'lean' ? 'disagreement' : progress.current === 'different' ? 'agreement' : progress.current === 'more' ? 'uncertainty' : '';
      return unopened.find((card) => card.dataset.state === desired) || unopened[0];
    };
    const renderInquiry = (id: string) => {
      const view = inquiryRoot?.querySelector<HTMLElement>(`[data-view="${id}"]`);
      const trail = view?.querySelector<HTMLElement>(`[data-inquiry-trail="${id}"]`);
      if (!view || !trail) return;
      const progress = progressFor(id);
      const cards = [...view.querySelectorAll<HTMLButtonElement>('[data-evidence]')];
      const openedCards = cards.filter((card) => progress.opened.includes(card.dataset.evidenceKey || ''));
      const speakers = [...new Set(openedCards.map((card) => card.dataset.speaker).filter(Boolean))];
      const start = trail.querySelector<HTMLElement>('[data-trail-start]');
      const current = trail.querySelector<HTMLElement>('[data-trail-current]');
      const opened = trail.querySelector<HTMLElement>('[data-trail-opened]');
      const test = trail.querySelector<HTMLElement>('[data-trail-test]');
      const threshold = trail.querySelector<HTMLElement>('[data-trail-threshold]');
      const nextQuestion = trail.querySelector<HTMLElement>('[data-trail-question]');
      const count = trail.querySelector<HTMLElement>('[data-trail-progress]');
      const meter = trail.querySelector<HTMLElement>('[data-trail-meter]');
      if (start) start.textContent = progress.started ? stanceLabels[progress.started] : 'Undecided';
      if (current) current.textContent = progress.current ? stanceLabels[progress.current] : 'Undecided';
      if (opened) opened.textContent = speakers.length ? speakers.join(', ') : 'Nothing yet';
      const selectedChallenge = typeof progress.challenge === 'number' ? view.querySelector<HTMLButtonElement>(`[data-challenge-index="${progress.challenge}"]`) : null;
      if (test) test.textContent = selectedChallenge?.querySelector('b')?.textContent?.trim() || 'Not chosen';
      if (threshold) threshold.textContent = progress.evidenceResponse ? evidenceResponseLabels[progress.evidenceResponse] : 'Not answered';
      if (nextQuestion) nextQuestion.textContent = progress.question?.trim() || 'Not written yet';
      if (count) count.textContent = `${openedCards.length} of ${cards.length} positions opened`;
      if (meter) meter.style.width = `${cards.length ? Math.round((openedCards.length / cards.length) * 100) : 0}%`;
      view.querySelectorAll<HTMLButtonElement>('[data-stance]').forEach((button) => button.classList.toggle('selected', button.dataset.stance === progress.current));
      const stanceFeedback = view.querySelector<HTMLElement>('[data-stance-feedback]');
      if (stanceFeedback && progress.current) stanceFeedback.textContent = stanceFeedbackLabels[progress.current] || '';
      view.querySelectorAll<HTMLButtonElement>('[data-reasoning-step]').forEach((button) => {
        const selected = Number(button.dataset.challengeIndex) === progress.challenge;
        button.classList.toggle('active', selected);
        button.setAttribute('aria-expanded', String(selected));
        const mark = button.querySelector<HTMLElement>(':scope > i'); if (mark) mark.textContent = selected ? '−' : '＋';
      });
      view.querySelectorAll<HTMLButtonElement>('[data-evidence-response]').forEach((button) => button.classList.toggle('selected', button.dataset.evidenceResponse === progress.evidenceResponse));
      const completed: Record<string, boolean> = {
        challenge: typeof progress.challenge === 'number',
        evidence: Boolean(progress.evidenceResponse),
        stance: Boolean(progress.current),
        question: Boolean(progress.question?.trim())
      };
      const order = ['challenge', 'evidence', 'stance', 'question'];
      const nextIncomplete = order.find((step) => !completed[step]);
      view.querySelectorAll<HTMLElement>('[data-reflection-progress]').forEach((item) => {
        const step = item.dataset.reflectionProgress || '';
        item.classList.toggle('complete', completed[step]);
        item.classList.toggle('current', step === nextIncomplete);
        const state = item.querySelector<HTMLElement>('i'); if (state) state.textContent = completed[step] ? 'Done' : step === nextIncomplete ? 'Next' : 'Waiting';
      });
      view.querySelectorAll<HTMLElement>('[data-stage-status]').forEach((status) => {
        const step = status.dataset.stageStatus || '';
        status.textContent = completed[step] ? 'Complete' : step === nextIncomplete ? 'Do this next' : 'Waiting';
      });
      view.querySelectorAll<HTMLInputElement>(`[data-own-question="${id}"]`).forEach((input) => { if (document.activeElement !== input) input.value = progress.question || ''; });
      const recommendation = chooseRecommendation(view, progress);
      const recommendationText = trail.querySelector<HTMLElement>('[data-trail-recommendation]');
      const next = trail.querySelector<HTMLButtonElement>('[data-trail-next]');
      if (recommendation) {
        const lane = recommendation.dataset.state === 'agreement' ? 'agreement' : recommendation.dataset.state === 'disagreement' ? 'challenge' : 'open question';
        if (recommendationText) recommendationText.textContent = `${recommendation.dataset.speaker}: open the strongest ${lane} you have not examined.`;
        if (next) { next.disabled = false; next.dataset.targetEvidence = recommendation.dataset.evidenceKey || ''; next.dataset.targetQuestion = ''; next.innerHTML = 'Show me <span>→</span>'; }
      } else {
        const questionButtons = [...(inquiryRoot?.querySelectorAll<HTMLButtonElement>('[data-question]') || [])];
        const questionIds = [...new Set(questionButtons.map((button) => button.dataset.question).filter(Boolean))] as string[];
        const currentIndex = Math.max(0, questionIds.indexOf(id));
        const nextQuestionId = questionIds.length > 1 ? questionIds[(currentIndex + 1) % questionIds.length] : '';
        const nextQuestionButton = nextQuestionId ? inquiryRoot?.querySelector<HTMLButtonElement>(`[data-question="${CSS.escape(nextQuestionId)}"]`) : null;
        const nextQuestionLabel = nextQuestionButton?.querySelector<HTMLElement>('b')?.textContent?.trim() || '';
        if (recommendationText) recommendationText.textContent = cards.length
          ? `You’ve examined every mapped position. Continue with “${nextQuestionLabel}”`
          : 'This question is waiting for mapped evidence.';
        if (next) {
          next.disabled = !cards.length || !nextQuestionId;
          next.dataset.targetEvidence = '';
          next.dataset.targetQuestion = nextQuestionId;
          next.innerHTML = 'Next question <span>→</span>';
        }
      }
    };
    inquiryRoot?.querySelectorAll<HTMLButtonElement>('[data-reasoning-step]').forEach((button) => button.addEventListener('click', () => {
      const view = button.closest<HTMLElement>('[data-view]'); if (!view?.dataset.view) return;
      const progress = progressFor(view.dataset.view); progress.challenge = Number(button.dataset.challengeIndex || 0); saveInquiry(); renderInquiry(view.dataset.view);
    }));
    inquiryRoot?.querySelectorAll<HTMLButtonElement>('[data-evidence-response]').forEach((button) => button.addEventListener('click', () => {
      const view = button.closest<HTMLElement>('[data-view]'); if (!view?.dataset.view) return;
      const progress = progressFor(view.dataset.view); progress.evidenceResponse = button.dataset.evidenceResponse || ''; saveInquiry(); renderInquiry(view.dataset.view);
    }));
    inquiryRoot?.querySelectorAll<HTMLButtonElement>('[data-stance]').forEach((button) => button.addEventListener('click', () => {
      const view = button.closest<HTMLElement>('[data-view]'); if (!view?.dataset.view) return;
      const progress = progressFor(view.dataset.view); const stance = button.dataset.stance || '';
      if (!progress.started) progress.started = stance; progress.current = stance; saveInquiry(); renderInquiry(view.dataset.view);
    }));
    inquiryRoot?.querySelectorAll<HTMLButtonElement>('[data-evidence]').forEach((card) => card.addEventListener('click', () => {
      const view = card.closest<HTMLElement>('[data-view]'); if (!view?.dataset.view) return;
      const progress = progressFor(view.dataset.view); const key = card.dataset.evidenceKey || '';
      if (key && !progress.opened.includes(key)) progress.opened.push(key); saveInquiry(); renderInquiry(view.dataset.view);

    }));
    inquiryRoot?.querySelectorAll<HTMLInputElement>('[data-own-question]').forEach((input) => input.addEventListener('input', () => {
      const id = input.dataset.ownQuestion || ''; if (!id) return; progressFor(id).question = input.value; saveInquiry(); renderInquiry(id);
    }));
    inquiryRoot?.querySelectorAll<HTMLButtonElement>('[data-export-reflections]').forEach((button) => button.addEventListener('click', () => {
      const payload = JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), reflections: inquiryStore }, null, 2);
      const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `co-existence-record-reflections-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.append(link); link.click(); link.remove(); URL.revokeObjectURL(url);
      const original = button.textContent || 'Export reflections'; button.textContent = 'Exported'; setTimeout(() => { button.textContent = original; }, 1800);
    }));
    inquiryRoot?.querySelectorAll<HTMLButtonElement>('[data-reset-reflection]').forEach((button) => button.addEventListener('click', () => {
      const id = button.dataset.resetReflection || ''; if (!id) return;
      if (!window.confirm('Reset your saved reflection for this question?')) return;
      delete inquiryStore[id]; saveInquiry(); location.reload();
    }));
    inquiryRoot?.querySelectorAll<HTMLButtonElement>('[data-trail-next]').forEach((button) => button.addEventListener('click', () => {
      const questionId = button.dataset.targetQuestion;
      if (questionId) { inquiryRoot.querySelector<HTMLButtonElement>(`[data-question="${CSS.escape(questionId)}"]`)?.click(); return; }
      const key = button.dataset.targetEvidence; if (!key) return;
      const card = inquiryRoot.querySelector<HTMLButtonElement>(`[data-evidence-key="${CSS.escape(key)}"]`); card?.scrollIntoView({ behavior: 'smooth', block: 'center' }); setTimeout(() => card?.click(), 420);
    }));
    inquiryRoot?.querySelectorAll<HTMLButtonElement>('[data-share-question]').forEach((button) => button.addEventListener('click', async () => {
      const id = button.dataset.shareQuestion || activeQuestionId(); const url = new URL(location.href); url.search = ''; url.searchParams.set('question', id);
      try { await navigator.clipboard.writeText(url.toString()); button.textContent = 'Link copied'; } catch { button.textContent = 'Copy this page URL'; }
      setTimeout(() => { button.textContent = 'Copy question link'; }, 1800);
    }));
    inquiryRoot?.querySelectorAll<HTMLButtonElement>('[data-question]').forEach((button) => button.addEventListener('click', () => {
      const id = button.dataset.question || ''; if (!id) return; renderInquiry(id);
    }));
    [...(inquiryRoot?.querySelectorAll<HTMLElement>('[data-view]') || [])]
      .map((view) => view.dataset.view)
      .filter(Boolean)
      .forEach((questionId) => renderInquiry(questionId as string));

}
