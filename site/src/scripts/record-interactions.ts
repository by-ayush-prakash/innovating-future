/** Motion follows deliberate clicks; it never delays navigation or restoration. */
export function initRecordInteractions(root: HTMLElement) {
  // Keep fixed artwork outside incoming surfaces that animate.
  const aboutArt = root.querySelector<HTMLElement>(".about-art");
  if (aboutArt) root.append(aboutArt);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const nav = root.querySelector<HTMLElement>(".topbar .atlas-nav");
  if (nav) {
    const indicator = document.createElement("span");
    indicator.className = "nav-slide-indicator";
    indicator.setAttribute("aria-hidden", "true");
    nav.append(indicator);
    const positionIndicator = () => {
      const label = nav.querySelector<HTMLElement>(".atlas-tab.active .atlas-tab-label");
      if (!label) { indicator.style.opacity = "0"; return; }
      const box = label.getBoundingClientRect();
      const parent = nav.getBoundingClientRect();
      indicator.style.opacity = "1";
      indicator.style.width = `${box.width}px`;
      indicator.style.transform = `translateX(${box.left - parent.left}px)`;
      indicator.style.top = `${box.bottom - parent.top + 6}px`;
    };
    positionIndicator();
    requestAnimationFrame(() => nav.classList.add("nav-slide-ready"));
    new MutationObserver(positionIndicator).observe(nav, {subtree:true, attributes:true, attributeFilter:["class"]});
    new ResizeObserver(positionIndicator).observe(nav);
    document.fonts.ready.then(positionIndicator);
    window.addEventListener("resize", positionIndicator);
  }
  const surfaces = ".about-principle[open] > .about-principle-body, .person-position-disclosure[open] > .follow-position-context, .people-group[open] > div, [data-people-view], [data-person-view], [data-comparison-view], [data-about-view], [data-contribution-view], [data-person-menu], .compare-question-strip nav, .comparison-source-dialog, .reading-context-slot, .reading-recording, .record-perspective, .journey-reflection, .reflection-next, .journey-screen-picker";
  const visible = () => Array.from(root.querySelectorAll<HTMLElement>(surfaces))
    .filter(node => node.getClientRects().length > 0);
  const running = new Set<Animation>();
  let frame = 0;
  const cancel = () => {
    cancelAnimationFrame(frame);
    running.forEach(animation => animation.cancel());
    running.clear();
  };
  const enter = (node: HTMLElement) => {
    // Existing journey transitions own their panels while active.
    if (node.getAnimations().some(animation => animation.playState === "running")) return;
    const compact = node.matches("[data-person-menu], .compare-question-strip nav");
    const dialog = node.matches("dialog, [data-about-view]");
    const animation = node.animate([
      { opacity: 0.35, transform: dialog ? "none" : `translateY(${compact ? 6 : 10}px)` },
      { opacity: 1, transform: dialog ? "none" : "translateY(0)" },
    ], { duration: compact ? 180 : 240, easing: "cubic-bezier(.2,.75,.25,1)" });
    running.add(animation);
    animation.finished.then(() => running.delete(animation), () => running.delete(animation));
  };
  root.addEventListener("click", event => {
    const target = event.target instanceof Element ? event.target.closest("button, a, summary") : null;
    if (!target) return;
    cancel();
    if (reduced.matches) return;
    const before = new Set(visible());
    frame = requestAnimationFrame(() => {
      const incoming = visible().filter(node => !before.has(node));
      // Animate the outer incoming surface once, avoiding stacked transforms.
      incoming.filter(node => !incoming.some(parent => parent !== node && parent.contains(node))).forEach(enter);
      if (target.matches("[data-person-choice], [data-compare-question]")) {
        root.querySelectorAll<HTMLElement>("[data-compare-row]:not([hidden]) .comparison-side")
          .forEach(node => { if (node.getClientRects().length && !incoming.some(parent => parent.contains(node))) enter(node); });
      }
    });
  }, true);
  window.addEventListener("popstate", cancel);
  window.addEventListener("pagehide", cancel);
  reduced.addEventListener("change", cancel);
}
