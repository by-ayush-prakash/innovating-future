/** Shared context chooser for the opening source and every appended perspective. */
export function bindContextChooser(host: HTMLElement, trigger: HTMLElement, options: HTMLElement) {
  let leaveTimer: ReturnType<typeof setTimeout>;
  let keyboardInteraction = false;
  const close = () => {
    clearTimeout(leaveTimer);
    options.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    if (host instanceof HTMLDetailsElement) host.open = false;
  };
  const open = () => {
    clearTimeout(leaveTimer);
    const wasHidden = options.hidden;
    if (host instanceof HTMLDetailsElement) host.open = true;
    options.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    const bounds = trigger.getBoundingClientRect();
    const height = options.offsetHeight;
    const above = innerHeight - bounds.bottom < height + 20 && bounds.top > height + 20;
    options.dataset.side = above ? 'above' : 'below';
    if (wasHidden && !matchMedia('(prefers-reduced-motion: reduce)').matches)
      options.animate(
        [
          { opacity: 0 },
          { opacity: 1 },
        ],
        { duration: 140, easing: 'ease-out' },
      );
  };
  host.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse') {
      keyboardInteraction = false;
      open();
    }
  });
  host.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'mouse')
      leaveTimer = setTimeout(() => {
        if (!keyboardInteraction || !host.contains(document.activeElement)) close();
      }, 180);
  });
  host.addEventListener('focusin', open);
  host.addEventListener('focusout', () => {
    setTimeout(() => {
      if (!host.contains(document.activeElement) && !host.matches(':hover')) close();
    }, 0);
  });
  host.addEventListener('keydown', (event) => {
    keyboardInteraction = true;
    if (event.key === 'Tab' && !event.shiftKey && document.activeElement === trigger) open();
    if (event.key === 'Escape') {
      trigger.focus({ preventScroll: true });
      close();
      event.stopPropagation();
    }
  });
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    open();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') keyboardInteraction = true;
  }, true);
  document.addEventListener('pointerdown', (event) => {
    keyboardInteraction = false;
    if (!host.contains(event.target as Node)) close();
  }, true);
  close();
  return { open, close };
}
