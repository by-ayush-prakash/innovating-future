/** Small, interruptible feedback for the Record's flat interface. */
export function initRecordMotion(root: HTMLElement) {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const active = new Map<HTMLElement, Animation>();
  const play = (element: HTMLElement, frames: Keyframe[], duration: number) => {
    active.get(element)?.cancel();
    if (preference.matches || !element.getClientRects().length) return;
    const animation = element.animate(frames, { duration, easing: 'cubic-bezier(.22,1,.36,1)' });
    active.set(element, animation);
    animation.finished.catch(() => {}).finally(() => {
      if (active.get(element) === animation) active.delete(element);
    });
  };
  preference.addEventListener('change', () => {
    if (preference.matches) { active.forEach(animation => animation.cancel()); active.clear(); }
  });
  // Existing journey transitions own the reading screens. Only animate other
  // app panels here, once when they become visible, without moving the header.
  const panels = '.about-view,.contribution-view,.people-view,.person-view,.comparison-view,.contribution-panel';
  const observer = new MutationObserver(records => {
    const opening = new Set<HTMLElement>();
    records.forEach(record => {
      const panel = record.target as HTMLElement;
      if (!panel.matches(panels)) return;
      if (panel.hidden) active.get(panel)?.cancel();
      else opening.add(panel);
    });
    opening.forEach(panel => {
      if ([...opening].some(parent => parent !== panel && parent.contains(panel))) return;
      play(panel, [{opacity:0,translate:'0 10px'},{opacity:1,translate:'0 0'}], 220);
    });
  });
  observer.observe(root, {subtree:true,attributes:true,attributeFilter:['hidden']});
  root.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    const control = (event.target as Element).closest<HTMLElement>('.welcome-card,.onward-source,.contribution-choices>button,.reflection-option,button[type=submit]');
    if (!control || control.matches(':disabled,[aria-disabled=true]')) return;
    play(control, [{scale:'1'},{scale:'.985',offset:.45},{scale:'1'}], 180);
  });
}
