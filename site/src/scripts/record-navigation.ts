import { scrollToRecordSection, cancelJourneyMotion } from "./record-journey";
export function initRecordNavigation() {
  const root = document.querySelector<HTMLElement>("[data-prototype]");
  let restoringNavigation = false;
  const setNavigationUrl = (
    updates: Record<string, string | null>,
    replace = false,
  ) => {
    if (restoringNavigation || root?.dataset.restoringNavigation === "true")
      return;
    const url = new URL(location.href);
    Object.entries(updates).forEach(([key, value]) =>
      value ? url.searchParams.set(key, value) : url.searchParams.delete(key),
    );
    if (url.href === location.href) return;
    history[replace ? "replaceState" : "pushState"]({}, "", url);
  };
  const journeyStorageKey = "cif-record-first-journey-v1";
  const readStoredJourney = () => {
    try {
      const value = JSON.parse(
        localStorage.getItem(journeyStorageKey) || "null",
      );
      return value && value.completed === true ? value : null;
    } catch {
      return null;
    }
  };
  const storeJourney = (question: string, route: string) => {
    try {
      localStorage.setItem(
        journeyStorageKey,
        JSON.stringify({ completed: true, question, route }),
      );
    } catch {
      // The Record remains usable when browser storage is unavailable.
    }
  };
  const infoNotes = Array.from(
    root?.querySelectorAll<HTMLDetailsElement>(".aaron-note") ?? [],
  );
  const hoverCanOpen = window.matchMedia("(hover: hover)").matches;
  infoNotes.forEach((note) => {
    note.addEventListener("mouseenter", () => {
      if (hoverCanOpen) note.open = true;
    });
    note.addEventListener("mouseleave", () => {
      if (hoverCanOpen) note.open = false;
    });
    note.addEventListener("focusin", () => {
      note.open = true;
    });
    note.addEventListener("focusout", (event) => {
      if (!note.contains(event.relatedTarget as Node)) note.open = false;
    });
  });
  document.addEventListener("pointerdown", (event) => {
    infoNotes.forEach((note) => {
      if (!note.contains(event.target as Node)) {
        note.open = false;
        note.querySelector<HTMLElement>("summary")?.blur();
      }
    });
  });
  const app = root?.querySelector<HTMLElement>("[data-app]");
  const evidenceCanvas = root?.querySelector<HTMLElement>(".evidence-canvas");
  const scrollWorkspaceToTop = (behavior: ScrollBehavior = "auto") => {
    evidenceCanvas?.scrollTo({ top: 0, left: 0, behavior });
    window.scrollTo({ top: 0, left: 0, behavior });
    if (behavior === "auto") {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  };
  const siteExitDialog = root?.querySelector<HTMLDialogElement>(
    "[data-site-exit-dialog]",
  );
  root
    ?.querySelectorAll<HTMLAnchorElement>("[data-site-exit-trigger]")
    .forEach((link) =>
      link.addEventListener("click", (event) => {
        event.preventDefault();
        siteExitDialog?.showModal();
      }),
    );
  siteExitDialog?.addEventListener("click", (event) => {
    if (event.target === siteExitDialog) siteExitDialog.close("cancel");
  });
  const contributionView = root?.querySelector<HTMLElement>(
    "[data-contribution-view]",
  );
  const contributeLaunch =
    root?.querySelector<HTMLButtonElement>(".atlas-contribute");
  const followLaunch =
    root?.querySelector<HTMLButtonElement>("[data-show-people]");
  const updateContributionContext = (id: string, label: string) => {
    root
      ?.querySelectorAll<HTMLInputElement>("[data-contribution-question]")
      .forEach((input) => {
        input.value = label;
      });
    root
      ?.querySelectorAll<HTMLSelectElement>("[data-contribution-question-id]")
      .forEach((input) => {
        input.value = id;
      });
  };
  const suggestionQuestion = root?.querySelector<HTMLSelectElement>(
    "[data-suggestion-question-select]",
  );
  suggestionQuestion?.addEventListener("change", () => {
    const label = root?.querySelector<HTMLInputElement>(
      "[data-suggestion-question]",
    );
    if (label)
      label.value =
        suggestionQuestion.selectedOptions[0]?.textContent ||
        "General contribution";
  });
  if (suggestionQuestion) {
    const control = suggestionQuestion.parentElement!;
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "contribution-question-trigger";
    trigger.setAttribute("aria-label", "Related question");
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");
    const menu = document.createElement("div");
    menu.className = "contribution-question-menu";
    menu.id = "contribution-question-options";
    menu.setAttribute("role", "listbox");
    menu.setAttribute("aria-label", "Related question");
    menu.hidden = true;
    trigger.setAttribute("aria-controls", menu.id);
    const options = Array.from(suggestionQuestion.options).map((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("role", "option");
      button.textContent = option.textContent;
      button.addEventListener("click", () => {
        suggestionQuestion.value = option.value;
        const label = root?.querySelector<HTMLInputElement>(
          "[data-suggestion-question]",
        );
        if (label) label.value = option.textContent || "General contribution";
        suggestionQuestion.dispatchEvent(
          new Event("change", { bubbles: true }),
        );
        sync();
        close();
        trigger.focus();
      });
      menu.append(button);
      return button;
    });
    const sync = () => {
      trigger.textContent =
        suggestionQuestion.selectedOptions[0]?.textContent ||
        "General contribution";
      options.forEach((button, index) =>
        button.setAttribute(
          "aria-selected",
          String(index === suggestionQuestion.selectedIndex),
        ),
      );
    };
    const close = () => {
      menu.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
    };
    const open = () => {
      menu.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
      options[Math.max(0, suggestionQuestion.selectedIndex)]?.focus();
    };
    trigger.addEventListener("click", () => (menu.hidden ? open() : close()));
    trigger.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        open();
      }
    });
    menu.addEventListener("keydown", (event) => {
      const index = options.indexOf(
        document.activeElement as HTMLButtonElement,
      );
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        trigger.focus();
      } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
        event.preventDefault();
        const next =
          event.key === "Home"
            ? 0
            : event.key === "End"
              ? options.length - 1
              : (index +
                  (event.key === "ArrowDown" ? 1 : -1) +
                  options.length) %
                options.length;
        options[next]?.focus();
      }
    });
    document.addEventListener("click", (event) => {
      if (!control.contains(event.target as Node)) close();
    });
    control.addEventListener("focusout", () => {
      requestAnimationFrame(() => {
        if (!control.contains(document.activeElement)) close();
      });
    });
    suggestionQuestion.addEventListener("change", sync);
    suggestionQuestion.hidden = true;
    suggestionQuestion.tabIndex = -1;
    control.querySelector("i")?.remove();
    control.append(trigger, menu);
    sync();
  }
  const followQuestion = root?.querySelector<HTMLSelectElement>(
    "[data-contribution-question-id]",
  );
  followQuestion?.addEventListener("change", () => {
    updateContributionContext(
      followQuestion.value,
      followQuestion.selectedOptions[0]?.textContent || "",
    );
  });
  const setContributionPanel = (choice: string) => {
    root
      ?.querySelectorAll<HTMLButtonElement>("[data-contribution-choice]")
      .forEach((button) => {
        const active = button.dataset.contributionChoice === choice;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      });
    root
      ?.querySelectorAll<HTMLElement>("[data-contribution-panel]")
      .forEach((panel) => {
        panel.hidden = panel.dataset.contributionPanel !== choice;
      });
  };
  const activeContributionContext = () => {
    const active = root?.querySelector<HTMLButtonElement>(
      "[data-question].active",
    );
    const visibleView = root?.querySelector<HTMLElement>(
      "[data-view]:not([hidden])",
    );
    const id = active?.dataset.question || visibleView?.dataset.view || "";
    const label =
      root
        ?.querySelector<HTMLElement>("[data-current-question]")
        ?.textContent?.trim() ||
      active?.querySelector<HTMLElement>("b")?.textContent?.trim() ||
      visibleView?.querySelector<HTMLElement>("h1")?.textContent?.trim() ||
      "";
    return { id, label };
  };
  const openContribution = () => {
    const { id, label } = activeContributionContext();
    updateContributionContext(id, label);
    setContributionPanel("suggest");
    closeQuestionPanel();
    closeInspector();
    root
      ?.querySelectorAll<HTMLElement>("[data-view]")
      .forEach((view) => (view.hidden = true));
    root
      ?.querySelectorAll<HTMLElement>("[data-people-view],[data-person-view]")
      .forEach((view) => (view.hidden = true));
    if (comparisonView) comparisonView.hidden = true;
    if (aboutView) aboutView.hidden = true;
    if (contributionView) contributionView.hidden = false;
    if (headingSelector) headingSelector.hidden = false;
    contributeLaunch?.classList.add("active");
    followLaunch?.classList.remove("active");
    compareLaunch?.classList.remove("active");
    aboutLaunch?.classList.remove("active");
    headerQuestions?.classList.remove("active");
    setNavigationUrl({
      view: "contribute",
      question: id || null,
      person: null,
      compare: null,
      evidence: null,
    });
    scrollWorkspaceToTop();
  };
  root
    ?.querySelectorAll<HTMLButtonElement>("[data-open-contribution]")
    .forEach((button) => button.addEventListener("click", openContribution));
  root
    ?.querySelectorAll<HTMLButtonElement>("[data-contribution-choice]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        setContributionPanel(button.dataset.contributionChoice || "suggest"),
      ),
    );
  root
    ?.querySelectorAll<HTMLFormElement>("[data-contribution-form]")
    .forEach((contributionForm) =>
      contributionForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const status = contributionForm.querySelector<HTMLElement>(
          "[data-contribution-status]",
        );
        const submit = contributionForm.querySelector<HTMLButtonElement>(
          'button[type="submit"]',
        );
        const body = new URLSearchParams();
        new FormData(contributionForm).forEach((value, key) => {
          if (typeof value === "string") body.append(key, value);
        });
        if (submit) submit.disabled = true;
        if (status) status.textContent = "";
        try {
          if (!["localhost", "127.0.0.1"].includes(location.hostname)) {
            const response = await fetch("/", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: body.toString(),
            });
            if (!response.ok) throw new Error("Submission failed");
            const { id: activeId, label: activeLabel } =
              activeContributionContext();
            contributionForm.reset();
            updateContributionContext(activeId, activeLabel);
            if (status)
              status.textContent =
                contributionForm.getAttribute("name") ===
                "coexistence-record-question-updates"
                  ? "You’re on the update list for this question."
                  : "Thank you. Your suggestion was sent for review.";
          } else if (status) {
            status.textContent = "This will submit on the published site.";
          }
        } catch {
          if (status)
            status.textContent = "Something went wrong. Please try again.";
        } finally {
          if (submit) submit.disabled = false;
        }
      }),
    );
  const questionPanel = root?.querySelector<HTMLElement>(
    "[data-question-panel]",
  );
  const questionBackdrop = root?.querySelector<HTMLButtonElement>(
    "[data-question-backdrop]",
  );
  const questionToggle = root?.querySelector<HTMLButtonElement>(
    "[data-question-toggle]",
  );
  const titleQuestionButtons = Array.from(
    root?.querySelectorAll<HTMLButtonElement>("[data-change-question]") || [],
  );
  const transitionQuestion = (update: () => void) => {
    update();
  };
  let questionInvoker: HTMLElement | null = null;
  const closeQuestionPanel = () => {
    if (!questionPanel || questionPanel.hidden) return;
    transitionQuestion(() => {
      app?.classList.remove("choosing-question");
      if (questionBackdrop) questionBackdrop.hidden = true;
      questionToggle?.setAttribute("aria-expanded", "false");
      titleQuestionButtons.forEach((button) =>
        button.setAttribute("aria-expanded", "false"),
      );
      questionInvoker?.focus({ preventScroll: true });
      questionPanel.hidden = true;
      questionPanel.inert = false;
      closeSearch();
      if (searchInput) searchInput.value = "";
    });
  };
  const openQuestionPanel = (anchor?: HTMLButtonElement) =>
    transitionQuestion(() => {
      if (!questionPanel) return;
      questionInvoker = anchor || (document.activeElement as HTMLElement);
      questionPanel.setAttribute("role", "dialog");
      questionPanel.setAttribute("aria-modal", "true");
      questionPanel.setAttribute("aria-label", "Choose a question");
      questionPanel.inert = false;
      questionPanel.dataset.context =
        anchor?.dataset.questionContext || "question";
      if (anchor) {
        const rect = anchor.getBoundingClientRect();
        const edge = window.innerWidth <= 720 ? 14 : 18;
        const width = Math.min(580, window.innerWidth - edge * 2);
        const left = Math.max(
          edge,
          Math.min(
            rect.left + (rect.width - width) / 2,
            window.innerWidth - width - edge,
          ),
        );
        const top = rect.bottom + 12;
        questionPanel.style.setProperty(
          "--question-panel-top",
          `${Math.round(top)}px`,
        );
        questionPanel.style.setProperty(
          "--question-panel-left",
          `${Math.round(left)}px`,
        );
        questionPanel.style.setProperty(
          "--question-panel-width",
          `${Math.round(width)}px`,
        );
        questionPanel.dataset.anchor = "title";
      } else {
        questionPanel.style.removeProperty("--question-panel-top");
        questionPanel.style.removeProperty("--question-panel-left");
        questionPanel.style.removeProperty("--question-panel-width");
        delete questionPanel.dataset.anchor;
      }
      app?.classList.add("choosing-question");
      questionPanel.style.setProperty(
        "--header-bottom",
        `${root?.querySelector(".topbar")?.getBoundingClientRect().bottom || 0}px`,
      );
      questionPanel.hidden = false;
      questionPanel
        .querySelector<HTMLElement>("input,button")
        ?.focus({ preventScroll: true });
      if (questionBackdrop) {
        const headerBottom =
          root?.querySelector(".topbar")?.getBoundingClientRect().bottom || 0;
        questionBackdrop.style.setProperty(
          "--header-bottom",
          `${headerBottom}px`,
        );
        questionBackdrop.hidden = false;
      }
      questionToggle?.setAttribute("aria-expanded", "true");
      titleQuestionButtons.forEach((button) =>
        button.setAttribute("aria-expanded", String(button === anchor)),
      );
    });
  questionPanel?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeQuestionPanel();
      return;
    }
    if (event.key !== "Tab") return;
    const targets = Array.from(
      questionPanel.querySelectorAll<HTMLElement>(
        'button,input,a[href],[tabindex="0"]',
      ),
    ).filter(
      (el) => el.getClientRects().length && !el.hasAttribute("disabled"),
    );
    const first = targets[0],
      last = targets.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus({ preventScroll: true });
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus({ preventScroll: true });
    }
  });
  questionToggle?.addEventListener("click", () => {
    if (questionPanel?.hidden) openQuestionPanel();
    else closeQuestionPanel();
  });
  root
    ?.querySelector("[data-close-menu]")
    ?.addEventListener("click", closeQuestionPanel);
  questionBackdrop?.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    closeQuestionPanel();
  });
  // The fixed library stays open while the question scrolls back into view.
  window.addEventListener("resize", closeQuestionPanel, { passive: true });
  root
    ?.querySelector("[data-expand-controls]")
    ?.addEventListener("click", () => {
      app?.classList.remove("nav-collapsed");
      app?.classList.add("controls-open");
    });
  document.addEventListener("pointerdown", (event) => {
    const target = event.target as Element;
    const insideQuestionPanel = target.closest("[data-question-panel]");
    const questionTrigger = target.closest(
      "[data-change-question], [data-question-toggle]",
    );
    if (!questionPanel?.hidden && !insideQuestionPanel && !questionTrigger)
      closeQuestionPanel();
    if (
      app?.classList.contains("controls-open") &&
      !target.closest(".topbar") &&
      !target.closest("[data-expand-controls]")
    ) {
      app?.classList.add("nav-collapsed");
      app?.classList.remove("controls-open");
    }
  });
  const comparisonView = root?.querySelector<HTMLElement>(
    "[data-comparison-view]",
  );
  const aboutView = root?.querySelector<HTMLElement>("[data-about-view]");
  const peopleView = root?.querySelector<HTMLElement>("[data-people-view]");
  const personViews = Array.from(
    root?.querySelectorAll<HTMLElement>("[data-person-view]") || [],
  );
  const headingSelector = root?.querySelector<HTMLElement>(
    "[data-heading-selector]",
  );
  const compareLaunch = root?.querySelector<HTMLButtonElement>(
    "[data-show-compare]",
  );
  const aboutLaunch =
    root?.querySelector<HTMLButtonElement>("[data-show-about]");
  const headerQuestions = root?.querySelector<HTMLButtonElement>(
    "[data-header-questions]",
  );
  const journeyOnboarding = root?.querySelector<HTMLElement>(
    "[data-journey-onboarding]",
  );
  const journeyQuestionStep = root?.querySelector<HTMLElement>(
    '[data-journey-step="question"]',
  );
  const journeyRouteStep = root?.querySelector<HTMLElement>(
    '[data-journey-step="route"]',
  );
  const journeyQuestionChoice = root?.querySelector<HTMLElement>(
    "[data-journey-question-choice]",
  );
  const journeyQuestionChoiceLabel =
    journeyQuestionChoice?.querySelector<HTMLElement>(
      "[data-journey-question-choice-label]",
    );
  const initialJourneyButton = root?.querySelector<HTMLButtonElement>(
    "[data-question].active",
  );
  const initialJourneyQuestion =
    initialJourneyButton?.dataset.question || "understanding";
  const initialJourneyQuestionLabel =
    initialJourneyButton?.querySelector("b")?.textContent?.trim() ||
    "Does AI actually understand us?";
  const availableQuestionIds = [
    ...(root?.querySelectorAll<HTMLElement>("[data-view]") || []),
  ]
    .map((view) => view.dataset.view)
    .filter(Boolean) as string[];
  const storedJourney = readStoredJourney();
  const storedQuestion = availableQuestionIds.includes(storedJourney?.question)
    ? storedJourney.question
    : initialJourneyQuestion;
  const storedRoute = ["landscape", "people", "compare"].includes(
    storedJourney?.route,
  )
    ? storedJourney.route
    : "landscape";
  const journeyState = { question: storedQuestion, route: storedRoute };
  const setJourneyStep = (step: "question" | "route") => {
    if (journeyQuestionStep) journeyQuestionStep.hidden = step !== "question";
    if (journeyRouteStep) journeyRouteStep.hidden = step !== "route";
  };
  if (journeyQuestionChoice && journeyQuestionChoiceLabel) {
    journeyQuestionChoiceLabel.textContent = initialJourneyQuestionLabel;
    journeyQuestionChoice.dataset.questionColour = initialJourneyQuestion;
    journeyQuestionChoice.style.backgroundColor =
      initialJourneyButton?.dataset.questionColor || "";
  }
  const hidePeoplePages = () => {
    if (peopleView) peopleView.hidden = true;
    personViews.forEach((view) => {
      view.hidden = true;
    });
  };
  const setExploreHeaderState = () => {
    headerQuestions?.classList.add("active");
    followLaunch?.classList.remove("active");
    compareLaunch?.classList.remove("active");
    aboutLaunch?.classList.remove("active");
    contributeLaunch?.classList.remove("active");
  };
  const setFollowHeaderState = () => {
    headerQuestions?.classList.remove("active");
    followLaunch?.classList.add("active");
    compareLaunch?.classList.remove("active");
    aboutLaunch?.classList.remove("active");
    contributeLaunch?.classList.remove("active");
  };
  let peopleQuestionFilter = "";
  const showPeopleDirectory = (_questionId = "") => {
    const questionId = "";
    peopleQuestionFilter = questionId;
    const chosenQuestion = questionId
      ? root?.querySelector<HTMLButtonElement>(
          `[data-question="${CSS.escape(questionId)}"]`,
        )
      : null;
    const questionLabel =
      chosenQuestion?.querySelector<HTMLElement>("b")?.textContent?.trim() ||
      "All questions";
    if (questionId) journeyState.question = questionId;
    journeyState.route = "people";
    if (app?.dataset.journeyStarted === "true")
      storeJourney(journeyState.question, journeyState.route);
    root?.querySelectorAll<HTMLElement>("[data-view]").forEach((view) => {
      view.hidden = true;
    });
    personViews.forEach((view) => {
      view.hidden = true;
    });
    if (comparisonView) comparisonView.hidden = true;
    if (aboutView) aboutView.hidden = true;
    if (contributionView) contributionView.hidden = true;
    if (peopleView) peopleView.hidden = false;
    if (headingSelector) headingSelector.hidden = false;
    const questionButton = peopleView?.querySelector<HTMLButtonElement>(
      '[data-question-context="people"]',
    );
    const questionText = peopleView?.querySelector<HTMLElement>(
      "[data-people-question-label]",
    );
    if (questionButton) {
      if (questionId) questionButton.dataset.questionId = questionId;
      else delete questionButton.dataset.questionId;
      questionButton.setAttribute(
        "aria-label",
        `Filter people by question. Current filter: ${questionLabel}`,
      );
      questionButton.style.backgroundColor =
        chosenQuestion?.dataset.questionColor || "";
    }
    if (questionText) questionText.textContent = questionLabel;
    peopleView
      ?.querySelectorAll<HTMLButtonElement>("[data-open-person]")
      .forEach((card) => {
        card.hidden = questionId
          ? !(card.dataset.personQuestions || "")
              .split(/\s+/)
              .includes(questionId)
          : false;
      });
    peopleView
      ?.querySelectorAll<HTMLElement>("[data-people-group]")
      .forEach((group) => {
        const visibleCards = [
          ...group.querySelectorAll<HTMLButtonElement>("[data-open-person]"),
        ].filter((card) => !card.hidden);
        group.hidden = visibleCards.length === 0;
        const count = group.querySelector<HTMLElement>(
          "[data-people-group-count]",
        );
        if (count)
          count.textContent = `${visibleCards.length} ${visibleCards.length === 1 ? "person" : "people"}`;
      });
    setFollowHeaderState();
    closeQuestionPanel();
    closeInspector();
    setNavigationUrl({
      view: "follow",
      question: questionId || null,
      person: null,
      compare: null,
      evidence: null,
    });
    scrollWorkspaceToTop();
  };
  const showPerson = (slug: string) => {
    const selected = personViews.find(
      (view) => view.dataset.personView === slug,
    );
    if (!selected) return;
    root?.querySelectorAll<HTMLElement>("[data-view]").forEach((view) => {
      view.hidden = true;
    });
    if (peopleView) peopleView.hidden = true;
    personViews.forEach((view) => {
      view.hidden = view !== selected;
    });
    if (comparisonView) comparisonView.hidden = true;
    if (aboutView) aboutView.hidden = true;
    if (contributionView) contributionView.hidden = true;
    if (headingSelector) headingSelector.hidden = true;
    setFollowHeaderState();
    closeQuestionPanel();
    closeInspector();
    setNavigationUrl({
      view: "follow",
      question: peopleQuestionFilter || null,
      person: slug,
      compare: null,
      evidence: null,
    });
    scrollWorkspaceToTop();
  };
  root?.addEventListener("record:follow-person", (event) => {
    const speaker = (event as CustomEvent<string>).detail;
    const person = [
      ...root.querySelectorAll<HTMLButtonElement>("[data-open-person]"),
    ].find((card) => card.querySelector("h3")?.textContent?.trim() === speaker);
    if (person?.dataset.openPerson) showPerson(person.dataset.openPerson);
  });
  const startJourney = () => {
    if (app) app.dataset.journeyStarted = "true";
    app?.classList.remove("journey-pending");
    storeJourney(journeyState.question, journeyState.route);
    root
      ?.querySelector<HTMLButtonElement>(
        `[data-question="${CSS.escape(journeyState.question)}"]`,
      )
      ?.click();
    if (journeyState.route === "compare") {
      compareLaunch?.click();
    } else if (journeyState.route === "people") {
      showPeopleDirectory(journeyState.question);
    }
    scrollWorkspaceToTop();
  };
  root
    ?.querySelectorAll<HTMLButtonElement>("[data-journey-question]")
    .forEach((button) =>
      button.addEventListener("click", () => {
        journeyState.question =
          button.dataset.journeyQuestion || initialJourneyQuestion;
        root
          .querySelectorAll<HTMLButtonElement>("[data-journey-question]")
          .forEach((item) => {
            const active = item === button;
            item.classList.toggle("active", active);
          });
        if (journeyQuestionChoice && journeyQuestionChoiceLabel) {
          journeyQuestionChoiceLabel.textContent =
            button.querySelector("strong")?.textContent?.trim() ||
            initialJourneyQuestionLabel;
          journeyQuestionChoice.dataset.questionColour = journeyState.question;
          journeyQuestionChoice.style.backgroundColor =
            button.dataset.questionColor || "";
        }
        setJourneyStep("route");
      }),
    );
  root
    ?.querySelectorAll<HTMLButtonElement>("[data-journey-route]")
    .forEach((button) =>
      button.addEventListener("click", () => {
        journeyState.route = button.dataset.journeyRoute || "landscape";
        startJourney();
      }),
    );
  root
    ?.querySelector<HTMLButtonElement>("[data-journey-back]")
    ?.addEventListener("click", () => setJourneyStep("question"));
  root
    ?.querySelectorAll<HTMLButtonElement>("[data-open-person]")
    .forEach((button) =>
      button.addEventListener("click", () => {
        showPerson(button.dataset.openPerson || "");
      }),
    );
  root
    ?.querySelectorAll<HTMLButtonElement>("[data-back-to-people]")
    .forEach((button) =>
      button.addEventListener("click", () => {
        showPeopleDirectory(peopleQuestionFilter);
      }),
    );
  [followLaunch, compareLaunch, aboutLaunch, contributeLaunch].forEach(
    (button) =>
      button?.addEventListener("click", () =>
        app?.classList.remove("journey-pending"),
      ),
  );
  const directJourney = new URLSearchParams(location.search);
  const opensDirectly =
    directJourney.has("view") ||
    directJourney.has("person") ||
    directJourney.has("evidence") ||
    directJourney.has("compare");
  if (opensDirectly) {
    if (app) app.dataset.journeyStarted = "true";
    app?.classList.remove("journey-pending");
  }
  // Fresh visits use the approved question opening, without the retired gateway.
  const exploreLensCopy: Record<string, [string, string]> = {
    agreement: [
      "What people share",
      "These claims overlap even when the speakers reach different conclusions about AI.",
    ],
    disagreement: [
      "Where the positions divide",
      "These claims use different definitions, evidence standards, or interpretations of the same behaviour.",
    ],
    uncertainty: [
      "What remains unresolved",
      "These claims identify questions the current interviews and available evidence cannot yet settle.",
    ],
  };
  const showExploreLens = (view: HTMLElement, state: string) => {
    const panel = view.querySelector<HTMLElement>("[data-all-positions]");
    const toggle = view.querySelector<HTMLButtonElement>(
      ".explore-starters [data-show-all-positions]",
    );
    if (!panel) return;
    panel
      .querySelectorAll<HTMLElement>(".all-position-card")
      .forEach((card) => {
        card.hidden = !card.classList.contains(`all-position-card--${state}`);
      });
    panel.hidden = false;
    toggle?.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() =>
      panel.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };
  root
    ?.querySelectorAll<HTMLButtonElement>("[data-explore-lens]")
    .forEach((button) =>
      button.addEventListener("click", () => {
        const view = button.closest<HTMLElement>("[data-view]");
        if (!view) return;
        view
          .querySelectorAll<HTMLButtonElement>("[data-explore-lens]")
          .forEach((item) => {
            const active = item === button;
            item.classList.toggle("active", active);
            item.setAttribute("aria-pressed", String(active));
          });
        const state = button.dataset.exploreLens || "disagreement";
        const copy = exploreLensCopy[state] || exploreLensCopy.disagreement;
        const title = view.querySelector<HTMLElement>(
          "[data-explore-focus-title]",
        );
        const description = view.querySelector<HTMLElement>(
          "[data-explore-focus-copy]",
        );
        if (title) title.textContent = copy[0];
        if (description) description.textContent = copy[1];
      }),
    );
  root
    ?.querySelectorAll<HTMLButtonElement>("[data-explore-show-lens]")
    .forEach((button) =>
      button.addEventListener("click", () => {
        const view = button.closest<HTMLElement>("[data-view]");
        const state = view?.querySelector<HTMLButtonElement>(
          "[data-explore-lens].active",
        )?.dataset.exploreLens;
        if (view && state) showExploreLens(view, state);
      }),
    );
  root
    ?.querySelectorAll<HTMLButtonElement>(
      ".explore-starters [data-show-all-positions]",
    )
    .forEach((button) =>
      button.addEventListener("click", () => {
        button
          .closest<HTMLElement>("[data-view]")
          ?.querySelectorAll<HTMLElement>(".all-position-card")
          .forEach((card) => {
            card.hidden = false;
          });
      }),
    );
  root
    ?.querySelectorAll<HTMLButtonElement>("[data-explore-position-state]")
    .forEach((button) =>
      button.addEventListener("click", () => {
        const view = button.closest<HTMLElement>("[data-view]");
        view
          ?.querySelectorAll<HTMLButtonElement>("[data-explore-position-state]")
          .forEach((item) => {
            const active = item === button;
            item.classList.toggle("active", active);
            item.setAttribute("aria-pressed", String(active));
          });
      }),
    );
  root
    ?.querySelectorAll<HTMLButtonElement>("[data-explore-compare]")
    .forEach((button) =>
      button.addEventListener("click", () => compareLaunch?.click()),
    );
  const resetMapFocus = (view: HTMLElement | null) => {
    if (!view) return;
    view
      .querySelectorAll<HTMLButtonElement>("[data-public-position]")
      .forEach((item) => {
        item.classList.remove("active");
        item.setAttribute("aria-pressed", "false");
      });
    view
      .querySelectorAll<HTMLElement>("[data-evidence].selected")
      .forEach((item) => item.classList.remove("selected"));
    const map = view.querySelector<HTMLElement>(".map");
    map?.classList.remove("is-focused");
    if (map) delete map.dataset.focusState;
    map
      ?.querySelectorAll<HTMLElement>(".lane")
      .forEach((lane) => lane.classList.remove("is-focused"));
    const title = map?.querySelector<HTMLElement>("[data-map-title]");
    const description = map?.querySelector<HTMLElement>(
      "[data-map-description]",
    );
    const reset = map?.querySelector<HTMLButtonElement>("[data-map-reset]");
    if (title)
      title.textContent =
        title.dataset.defaultTitle ||
        "Follow the argument through the interviews.";
    if (description)
      description.textContent =
        description.dataset.defaultDescription ||
        "Open a claim to see the reasoning and surrounding conversation.";
    if (reset) reset.hidden = true;
    const allPositions = view.querySelector<HTMLElement>(
      "[data-all-positions]",
    );
    const allPositionsToggle = view.querySelector<HTMLButtonElement>(
      "[data-show-all-positions]",
    );
    if (allPositions) allPositions.hidden = true;
    if (allPositionsToggle)
      allPositionsToggle.setAttribute("aria-expanded", "false");
    root
      ?.querySelector<HTMLElement>("[data-inspector]")
      ?.classList.remove("open");
    root
      ?.querySelector<HTMLElement>("[data-inspector-backdrop]")
      ?.classList.remove("open");
  };
  titleQuestionButtons.forEach((button) =>
    button.addEventListener("click", () => {
      if (button.getAttribute("aria-expanded") === "true") closeQuestionPanel();
      else openQuestionPanel(button);
    }),
  );
  root
    ?.querySelectorAll<HTMLButtonElement>("[data-question]")
    .forEach((button) =>
      button.addEventListener("click", () => {
        const selectQuestion = () => {
          const questionDestination = questionPanel?.dataset.context;
          const keepPerspectives = Boolean(
            root.querySelector(".question-view.views-revealed:not([hidden])"),
          );
          root
            .querySelectorAll<HTMLButtonElement>("[data-question]")
            .forEach((item) => {
              item.classList.toggle("active", item === button);
              item.setAttribute("aria-pressed", String(item === button));
            });
          root.querySelectorAll<HTMLElement>("[data-view]").forEach((view) => {
            resetMapFocus(view);
            view.hidden = view.dataset.view !== button.dataset.question;
          });
          const number =
            button.querySelector<HTMLElement>(":scope > span")?.textContent ||
            "";
          const label =
            button.querySelector<HTMLElement>("b")?.textContent || "";
          const currentQuestion = root.querySelector<HTMLElement>(
            "[data-current-question]",
          );
          if (currentQuestion) currentQuestion.textContent = label;
          journeyState.question = button.dataset.question || "understanding";
          if (app?.dataset.journeyStarted === "true")
            storeJourney(journeyState.question, journeyState.route);
          updateContributionContext(
            button.dataset.question || "understanding",
            label,
          );
          closeQuestionPanel();
          if (questionDestination === "contribution") {
            root
              .querySelectorAll<HTMLElement>("[data-view]")
              .forEach((view) => (view.hidden = true));
            if (comparisonView) comparisonView.hidden = true;
            if (aboutView) aboutView.hidden = true;
            if (contributionView) contributionView.hidden = false;
            if (headingSelector) headingSelector.hidden = false;
            compareLaunch?.classList.remove("active");
            followLaunch?.classList.remove("active");
            aboutLaunch?.classList.remove("active");
            contributeLaunch?.classList.add("active");
            headerQuestions?.classList.remove("active");
            scrollWorkspaceToTop();
            return;
          }
          if (questionDestination === "people") {
            showPeopleDirectory(button.dataset.question || "understanding");
            return;
          }
          const selectedQuestionView = root.querySelector<HTMLElement>(
            `[data-view="${CSS.escape(button.dataset.question || "understanding")}"]`,
          );
          if (keepPerspectives)
            selectedQuestionView?.dispatchEvent(
              new Event("reveal-perspectives"),
            );
          hidePeoplePages();
          if (comparisonView) comparisonView.hidden = true;
          if (aboutView) aboutView.hidden = true;
          if (contributionView) contributionView.hidden = true;
          if (headingSelector) headingSelector.hidden = false;
          journeyState.route = "landscape";
          if (app?.dataset.journeyStarted === "true")
            storeJourney(journeyState.question, journeyState.route);
          followLaunch?.classList.remove("active");
          compareLaunch?.classList.remove("active");
          aboutLaunch?.classList.remove("active");
          contributeLaunch?.classList.remove("active");
          headerQuestions?.classList.add("active");
          const compareLabel = root.querySelector<HTMLElement>(
            "[data-compare-label]",
          );
          if (compareLabel) compareLabel.textContent = "Compare";
          setNavigationUrl({
            view: "explore",
            question: button.dataset.question || "understanding",
            person: null,
            compare: null,
            evidence: null,
          });
          root.dispatchEvent(
            new CustomEvent("record:question", {
              detail: button.dataset.question,
            }),
          );
          if (root.dataset.restoringNavigation !== "true")
            scrollWorkspaceToTop();
        };
        if (questionPanel && !questionPanel.hidden)
          transitionQuestion(selectQuestion);
        else selectQuestion();
      }),
    );
  const updateComparison = (side: string, speaker: string) => {
    const label = root?.querySelector<HTMLElement>(
      `[data-person-name="${side}"]`,
    );
    if (label) {
      label.dataset.sourceName = speaker;
      label.textContent = speaker.replace(/^Dr\.?\s+/i, "");
    }
    root
      ?.querySelectorAll<HTMLElement>(`[data-compare-side="${side}"]`)
      .forEach((column) => {
        column
          .querySelectorAll<HTMLElement>("[data-position]")
          .forEach((card) => {
            card.hidden = card.dataset.speaker !== speaker;
          });
      });
  };
  const comparisonSource = document.createElement("dialog");
  comparisonSource.className = "comparison-source-dialog";
  comparisonSource.setAttribute("aria-label", "Original conversation");
  root?.append(comparisonSource);
  comparisonSource.addEventListener("close", () => {
    comparisonSource.querySelector("audio")?.pause();
    comparisonSource.replaceChildren();
  });
  window.addEventListener("popstate", () => comparisonSource.close());
  root?.querySelectorAll<HTMLButtonElement>("[data-compare-source]").forEach(button => {
    button.addEventListener("click", () => {
      const source = button.dataset.compareSource;
      if (!source) return;
      const speaker = button.dataset.sourceSpeaker || "Contributor";
      const timestamp = button.dataset.sourceTime || "00:00";
      const seconds = timestamp.split(":").reduce((total, value) => total * 60 + Number(value), 0);
      const heading = document.createElement("h2");
      heading.textContent = `Conversation with ${speaker}`;
      const caption = document.createElement("p");
      caption.textContent = `This passage begins at ${timestamp}.`;
      const close = document.createElement("button");
      close.type = "button";
      close.className = "comparison-source-close";
      close.textContent = "×";
      close.setAttribute("aria-label", "Close recording");
      close.addEventListener("click", () => comparisonSource.close());
      const url = new URL(source);
      const videoId = url.hostname === "youtu.be" ? url.pathname.slice(1) : url.searchParams.get("v");
      comparisonSource.replaceChildren(close, heading, caption);
      if (videoId) {
        const frame = document.createElement("iframe");
        frame.title = `Conversation with ${speaker}`;
        frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?start=${seconds}&rel=0`;
        frame.allow = "encrypted-media; picture-in-picture";
        frame.allowFullscreen = true;
        comparisonSource.append(frame);
      } else {
        const audio = document.createElement("audio");
        audio.controls = true;
        audio.preload = "metadata";
        audio.src = source;
        audio.addEventListener("loadedmetadata", () => audio.currentTime = seconds, {once:true});
        comparisonSource.append(audio);
      }
      comparisonSource.showModal();
    });
  });
  const setComparisonQuestion = (id: string) => {
    const chosen = root?.querySelector<HTMLButtonElement>(
      `[data-compare-question="${CSS.escape(id)}"]`,
    );
    const chooser = comparisonView?.querySelector<HTMLDetailsElement>(
      ".compare-question-strip",
    );
    if (chooser) chooser.open = !chosen;
    const pickers =
      comparisonView?.querySelector<HTMLElement>(".person-pickers");
    if (pickers) pickers.hidden = !chosen;
    if (!chosen) {
      root
        ?.querySelectorAll<HTMLButtonElement>("[data-compare-question]")
        .forEach((button) => {
          button.classList.remove("active");
          button.setAttribute("aria-pressed", "false");
        });
      root
        ?.querySelectorAll<HTMLElement>("[data-compare-row]")
        .forEach((row) => (row.hidden = true));
      const label = root?.querySelector<HTMLElement>(
        "[data-compare-question-label]",
      );
      if (label) label.textContent = "Choose a question to compare";
      return;
    }
    root
      ?.querySelectorAll<HTMLButtonElement>("[data-compare-question]")
      .forEach((button) => {
        const active = button === chosen;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      });
    root?.querySelectorAll<HTMLElement>("[data-compare-row]").forEach((row) => {
      row.hidden = row.dataset.compareRow !== id;
    });
    const label = root?.querySelector<HTMLElement>(
      "[data-compare-question-label]",
    );
    if (label)
      label.textContent =
        chosen.textContent?.replace(/^\s*\d+\s*/, "").trim() || "";
    const activeRow = root?.querySelector<HTMLElement>(
      `[data-compare-row="${CSS.escape(id)}"]`,
    );
    const available = [
      ...new Set(
        [...(activeRow?.querySelectorAll<HTMLElement>("[data-position]") || [])]
          .map((card) => card.dataset.speaker || "")
          .filter(Boolean),
      ),
    ];
    root
      ?.querySelectorAll<HTMLButtonElement>("[data-person-choice]")
      .forEach((choice) => {
        choice.hidden = !available.includes(choice.dataset.personValue || "");
      });
    const wasRestoringComparison = restoringNavigation;
    restoringNavigation = true;
    (["a", "b"] as const).forEach((side, index) => {
      const current =
        root?.querySelector<HTMLElement>(`[data-person-name="${side}"]`)
          ?.dataset.sourceName || "";
      if (available.includes(current)) return;
      const replacement = available[index] || available[0];
      if (replacement)
        root
          ?.querySelector<HTMLButtonElement>(
            `[data-person-choice="${side}"][data-person-value="${CSS.escape(replacement)}"]`,
          )
          ?.click();
    });
    restoringNavigation = wasRestoringComparison;
  };
  root
    ?.querySelectorAll<HTMLButtonElement>("[data-compare-question]")
    .forEach((button) =>
      button.addEventListener("click", () => {
        const question = button.dataset.compareQuestion || "understanding";
        setComparisonQuestion(question);
        const a =
          root.querySelector<HTMLElement>('[data-person-name="a"]')?.dataset
            .sourceName || "";
        const b =
          root.querySelector<HTMLElement>('[data-person-name="b"]')?.dataset
            .sourceName || "";
        setNavigationUrl({
          view: "compare",
          question,
          compare: `${a}|${b}`,
          person: null,
          evidence: null,
        });
      }),
    );
  const closePersonMenus = (except = "") =>
    root
      ?.querySelectorAll<HTMLElement>("[data-person-menu]")
      .forEach((menu) => {
        if (menu.dataset.personMenu !== except) {
          menu.hidden = true;
          root
            .querySelector<HTMLButtonElement>(
              `[data-person-toggle="${menu.dataset.personMenu}"]`,
            )
            ?.setAttribute("aria-expanded", "false");
        }
      });
  root
    ?.querySelectorAll<HTMLButtonElement>("[data-person-toggle]")
    .forEach((button) =>
      button.addEventListener("click", () => {
        const side = button.dataset.personToggle || "a";
        const menu = root.querySelector<HTMLElement>(
          `[data-person-menu="${side}"]`,
        );
        if (!menu) return;
        const willOpen = menu.hidden;
        closePersonMenus(side);
        menu.hidden = !willOpen;
        button.setAttribute("aria-expanded", String(willOpen));
      }),
    );
  root
    ?.querySelectorAll<HTMLButtonElement>("[data-person-choice]")
    .forEach((button) =>
      button.addEventListener("click", () => {
        const side = button.dataset.personChoice || "a";
        const speaker = button.dataset.personValue || "";
        if (button.hidden) return;
        const name = root.querySelector<HTMLElement>(
          `[data-person-name="${side}"]`,
        );
        root
          .querySelectorAll<HTMLButtonElement>(`[data-person-choice="${side}"]`)
          .forEach((choice) => {
            const active = choice === button;
            choice.classList.toggle("active", active);
            const mark = choice.querySelector("i");
            if (mark) mark.textContent = active ? "●" : "";
          });
        updateComparison(side, speaker);
        closePersonMenus();
        const a =
          root?.querySelector<HTMLElement>('[data-person-name="a"]')?.dataset
            .sourceName || "";
        const b =
          root?.querySelector<HTMLElement>('[data-person-name="b"]')?.dataset
            .sourceName || "";
        const question =
          root?.querySelector<HTMLButtonElement>(
            "[data-compare-question].active",
          )?.dataset.compareQuestion || "understanding";
        setNavigationUrl({
          view: "compare",
          compare: `${a}|${b}`,
          question,
          evidence: null,
          person: null,
        });
      }),
    );
  updateComparison("a", "Karl Friston");
  updateComparison("b", "Viviane Clay");
  setComparisonQuestion("understanding");
  document.addEventListener("click", (event) => {
    if (!(event.target as Element).closest("[data-person-picker]"))
      closePersonMenus();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePersonMenus();
      closeInspector();
      closeQuestionPanel();
    }
  });
  followLaunch?.addEventListener("click", () => {
    showPeopleDirectory();
  });
  compareLaunch?.addEventListener("click", () => {
    if (compareLaunch.classList.contains("active")) return;
    const activeQuestion =
      root?.querySelector<HTMLButtonElement>("[data-question].active")?.dataset
        .question || "understanding";
    journeyState.question = activeQuestion;
    journeyState.route = "compare";
    if (app?.dataset.journeyStarted === "true")
      storeJourney(journeyState.question, journeyState.route);
    setComparisonQuestion("");
    closeQuestionPanel();
    root
      ?.querySelectorAll<HTMLElement>("[data-view]")
      .forEach((view) => (view.hidden = true));
    hidePeoplePages();
    if (comparisonView) comparisonView.hidden = false;
    if (aboutView) aboutView.hidden = true;
    if (contributionView) contributionView.hidden = true;
    if (headingSelector) headingSelector.hidden = true;
    followLaunch?.classList.remove("active");
    compareLaunch.classList.add("active");
    aboutLaunch?.classList.remove("active");
    contributeLaunch?.classList.remove("active");
    headerQuestions?.classList.remove("active");
    setNavigationUrl({
      view: "compare",
      question: null,
      compare: null,
      person: null,
      evidence: null,
    });
    scrollWorkspaceToTop();
  });
  aboutLaunch?.addEventListener("click", () => {
    if (aboutLaunch.classList.contains("active")) return;
    closeQuestionPanel();
    closeInspector();
    root
      ?.querySelectorAll<HTMLElement>("[data-view]")
      .forEach((view) => (view.hidden = true));
    hidePeoplePages();
    if (comparisonView) comparisonView.hidden = true;
    if (aboutView) aboutView.hidden = false;
    if (contributionView) contributionView.hidden = true;
    if (headingSelector) headingSelector.hidden = true;
    aboutLaunch.classList.add("active");
    followLaunch?.classList.remove("active");
    compareLaunch?.classList.remove("active");
    contributeLaunch?.classList.remove("active");
    headerQuestions?.classList.remove("active");
    setNavigationUrl({
      view: "about",
      question: null,
      person: null,
      compare: null,
      evidence: null,
    });
    scrollWorkspaceToTop();
  });
  root
    ?.querySelector<HTMLButtonElement>("[data-about-questions]")
    ?.addEventListener("click", () => {
      root.dispatchEvent(new CustomEvent("record:return-to-welcome"));
    });
  root
    ?.querySelector<HTMLButtonElement>("[data-contribution-return]")
    ?.addEventListener("click", () => {
      if (questionPanel) questionPanel.dataset.context = "question";
      root?.querySelector<HTMLButtonElement>("[data-question].active")?.click();
    });
  root
    ?.querySelectorAll<HTMLButtonElement>("[data-see-evidence]")
    .forEach((button) =>
      button.addEventListener("click", () => {
        const view = button.closest<HTMLElement>("[data-view]");
        resetMapFocus(view);
        view
          ?.querySelector(".map")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }),
    );
  root
    ?.querySelectorAll<HTMLButtonElement>("[data-map-reset]")
    .forEach((button) =>
      button.addEventListener("click", () => {
        const view = button.closest<HTMLElement>("[data-view]");
        resetMapFocus(view);
        root
          ?.querySelector<HTMLElement>("[data-inspector]")
          ?.classList.remove("open");
      }),
    );
  root
    ?.querySelectorAll<HTMLButtonElement>("[data-open-evidence-key]")
    .forEach((button) =>
      button.addEventListener("click", () => {
        const key = button.dataset.openEvidenceKey;
        if (!key) return;
        const card = root.querySelector<HTMLButtonElement>(
          `[data-evidence-key="${CSS.escape(key)}"]`,
        );
        if (button.hasAttribute("data-open-direct")) {
          if (card) {
            card.dataset.openOrigin = "linked";
            card.click();
            delete card.dataset.openOrigin;
          }

          return;
        }
        const view = button.closest<HTMLElement>("[data-view]");
        const map = view?.querySelector<HTMLElement>(".map");
        resetMapFocus(view);
        button.classList.add("active");
        button.setAttribute("aria-pressed", "true");
        card?.classList.add("selected");
        map?.classList.add("is-focused");
        if (map && card?.dataset.state)
          map.dataset.focusState = card.dataset.state;
        card?.closest<HTMLElement>(".lane")?.classList.add("is-focused");
        const mapTitle = map?.querySelector<HTMLElement>("[data-map-title]");
        const mapDescription = map?.querySelector<HTMLElement>(
          "[data-map-description]",
        );
        const mapReset =
          map?.querySelector<HTMLButtonElement>("[data-map-reset]");
        const positionTitle =
          button.querySelector("h2,h3")?.textContent?.trim() || "this view";
        if (mapTitle) mapTitle.textContent = `Evidence for “${positionTitle}”`;
        if (mapDescription)
          mapDescription.textContent =
            "Open a claim to see its reasoning, source, and original conversation.";
        if (mapReset) mapReset.hidden = false;
        if (button.classList.contains("all-position-card")) {
          card?.click();
          return;
        }
        map?.scrollIntoView({ behavior: "smooth", block: "start" });
      }),
    );
  const stanceMessages: Record<string, string> = {
    lean: "Your next useful check is the strongest disagreement.",
    different: "Name the evidence that supports your alternative.",
    more: "Keep the question open and specify the evidence you still need.",
  };
  const adaptiveEvidenceTitles: Record<string, string> = {
    lean: "What could challenge this position?",
    different: "What would test this alternative?",
    more: "What would be enough to decide?",
  };
  const adaptiveQuestionPrompts: Record<string, string> = {
    lean: "What is the strongest challenge to this position?",
    different: "What would distinguish this position from the alternatives?",
    more: "What evidence would let you decide?",
  };
  root?.querySelectorAll<HTMLButtonElement>("[data-stance]").forEach((button) =>
    button.addEventListener("click", () => {
      const section = button.closest<HTMLElement>(".stance-builder");
      section
        ?.querySelectorAll<HTMLButtonElement>("[data-stance]")
        .forEach((choice) =>
          choice.classList.toggle("selected", choice === button),
        );
      const stance = button.dataset.stance || "";
      const feedback = section?.querySelector<HTMLElement>(
        "[data-stance-feedback]",
      );
      if (feedback) feedback.textContent = stanceMessages[stance] || "";
      const reflection = button.closest<HTMLElement>(".explore-reflection");
      if (!reflection) return;
      const choiceLabel = button.textContent?.trim() || "your position";
      const defaultEvidence =
        reflection.querySelector<HTMLElement>("[data-adaptive-evidence]")
          ?.dataset.defaultEvidence || "";
      const stanceTitle = reflection.querySelector<HTMLElement>(
        "[data-reflection-stance-title]",
      );
      const evidenceTitle = reflection.querySelector<HTMLElement>(
        "[data-adaptive-evidence-title]",
      );
      const evidencePrompt = reflection.querySelector<HTMLElement>(
        "[data-adaptive-evidence]",
      );
      const questionLabel = reflection.querySelector<HTMLElement>(
        "[data-adaptive-question-label]",
      );
      const questionInput = reflection.querySelector<HTMLInputElement>(
        "[data-own-question]",
      );
      if (stanceTitle)
        stanceTitle.textContent = `Your position: ${choiceLabel}`;
      if (evidenceTitle)
        evidenceTitle.textContent =
          adaptiveEvidenceTitles[stance] ||
          "What evidence could change your mind?";
      if (evidencePrompt)
        evidencePrompt.textContent =
          stance === "more"
            ? `What evidence would be sufficient to move you from uncertainty? ${defaultEvidence}`
            : `What evidence would make you reconsider “${choiceLabel}”? ${defaultEvidence}`;
      const nextPrompt =
        adaptiveQuestionPrompts[stance] || "What would you investigate next?";
      if (questionLabel) questionLabel.textContent = nextPrompt;
      if (questionInput) questionInput.placeholder = nextPrompt;
      const stanceStep = reflection.querySelector<HTMLDetailsElement>(
        "[data-reflection-stance]",
      );
      const evidenceStep = reflection.querySelector<HTMLDetailsElement>(
        "[data-reflection-evidence]",
      );
      if (stanceStep) stanceStep.open = false;
      if (evidenceStep) evidenceStep.open = true;
    }),
  );
  root
    ?.querySelectorAll<HTMLButtonElement>(
      ".explore-reflection [data-evidence-response]",
    )
    .forEach((button) =>
      button.addEventListener("click", () => {
        const reflection = button.closest<HTMLElement>(".explore-reflection");
        if (!reflection) return;
        button.parentElement
          ?.querySelectorAll<HTMLButtonElement>("[data-evidence-response]")
          .forEach((choice) =>
            choice.classList.toggle("selected", choice === button),
          );
        const responsePrompts: Record<string, string> = {
          yes: "Which source would you examine first?",
          partly: "What uncertainty would remain?",
          no: "What different test would matter?",
        };
        const nextPrompt =
          responsePrompts[button.dataset.evidenceResponse || ""] ||
          "What would you investigate next?";
        const questionLabel = reflection.querySelector<HTMLElement>(
          "[data-adaptive-question-label]",
        );
        const questionInput = reflection.querySelector<HTMLInputElement>(
          "[data-own-question]",
        );
        if (questionLabel) questionLabel.textContent = nextPrompt;
        if (questionInput) questionInput.placeholder = nextPrompt;
        const evidenceStep = reflection.querySelector<HTMLDetailsElement>(
          "[data-reflection-evidence]",
        );
        const questionStep = reflection.querySelector<HTMLDetailsElement>(
          "[data-reflection-question]",
        );
        if (evidenceStep) evidenceStep.open = false;
        if (questionStep) questionStep.open = true;
        questionInput?.focus();
      }),
    );
  const closeInspector = () =>
    root?.dispatchEvent(new CustomEvent("record:leave"));
  root?.querySelectorAll<HTMLButtonElement>("[data-evidence]").forEach((card) =>
    card.addEventListener("click", () => {
      root.dispatchEvent(
        new CustomEvent("record:source", { detail: card.dataset.evidenceKey }),
      );
    }),
  );

  const searchInput = root?.querySelector<HTMLInputElement>("[data-search]");
  const searchResults = root?.querySelector<HTMLElement>(
    "[data-search-results]",
  );
  questionPanel?.addEventListener(
    "scroll",
    () => {
      if (questionPanel.scrollTop) questionPanel.scrollTop = 0;
      if (questionPanel.scrollLeft) questionPanel.scrollLeft = 0;
    },
    { passive: true },
  );
  searchResults?.addEventListener(
    "wheel",
    (event) => {
      const atTop = searchResults.scrollTop <= 0;
      const atBottom =
        searchResults.scrollTop + searchResults.clientHeight >=
        searchResults.scrollHeight - 1;
      if ((event.deltaY < 0 && atTop) || (event.deltaY > 0 && atBottom))
        event.preventDefault();
    },
    { passive: false },
  );
  headerQuestions?.addEventListener("click", () => {
    closeQuestionPanel();
    if (app?.dataset.journeyStarted !== "true") {
      app?.classList.add("journey-pending");
      journeyOnboarding?.scrollIntoView({ block: "start" });
      return;
    }
    const peoplePageOpen = peopleView ? !peopleView.hidden : false;
    const personPageOpen = personViews.some((view) => !view.hidden);
    if (
      peoplePageOpen ||
      personPageOpen ||
      compareLaunch?.classList.contains("active") ||
      aboutLaunch?.classList.contains("active") ||
      contributeLaunch?.classList.contains("active")
    ) {
      journeyState.route = "landscape";
      root?.querySelector<HTMLButtonElement>("[data-question].active")?.click();
    } else {
      scrollWorkspaceToTop("smooth");
    }
  });
  root
    ?.querySelector<HTMLButtonElement>("[data-header-search]")
    ?.addEventListener("click", () => {
      const peoplePageOpen = peopleView ? !peopleView.hidden : false;
      const personPageOpen = personViews.some((view) => !view.hidden);
      if (
        peoplePageOpen ||
        personPageOpen ||
        compareLaunch?.classList.contains("active") ||
        aboutLaunch?.classList.contains("active") ||
        contributeLaunch?.classList.contains("active")
      )
        root
          ?.querySelector<HTMLButtonElement>("[data-question].active")
          ?.click();
      if (questionPanel?.hidden) openQuestionPanel();
      setTimeout(() => searchInput?.focus(), 40);
    });
  let searchVersion = 0;
  let transcriptIndex: Record<string, string> | undefined;
  let transcriptRequest: Promise<Record<string, string>> | undefined;
  const loadTranscriptIndex = () =>
    (transcriptRequest ||= fetch("/work/coexisting-with-ai/record/search.json")
      .then((response) => {
        if (!response.ok) throw new Error("Search index unavailable");
        return response.json();
      })
      .then((index) => (transcriptIndex = index))
      .catch(() => {
        transcriptRequest = undefined;
        return {};
      }));
  searchInput?.addEventListener("focus", () => {
    void loadTranscriptIndex();
  });
  function closeSearch() {
    ++searchVersion;
    questionPanel?.classList.remove("searching");
    if (searchResults) {
      searchResults.hidden = true;
      searchResults.replaceChildren();
    }
  }
  searchInput?.addEventListener("input", async () => {
    if (!root || !searchResults) return;
    const term = searchInput.value.toLowerCase().trim();
    searchResults.replaceChildren();
    if (!term) {
      closeSearch();
      return;
    }
    const version = ++searchVersion;
    const index = transcriptIndex || (await loadTranscriptIndex());
    if (
      version !== searchVersion ||
      searchInput.value.toLowerCase().trim() !== term
    )
      return;
    const matches: Array<{
      kind: string;
      title: string;
      meta: string;
      questionId: string;
      color: string;
      open: () => void;
    }> = [];
    root
      .querySelectorAll<HTMLButtonElement>("[data-question]")
      .forEach((button) => {
        const title = button.querySelector("b")?.textContent?.trim() || "";
        if (title.toLowerCase().includes(term))
          matches.push({
            kind: "Question",
            title,
            meta: "Open the question",
            questionId: button.dataset.question || "",
            color: button.dataset.questionColor || "",
            open: () => button.click(),
          });
      });
    root
      .querySelectorAll<HTMLButtonElement>("[data-evidence]")
      .forEach((card) => {
        const view = card.closest<HTMLElement>("[data-view]");
        const questionButton = view
          ? root.querySelector<HTMLButtonElement>(
              `[data-question="${view.dataset.view}"]`,
            )
          : null;
        const question =
          questionButton?.querySelector("b")?.textContent?.trim() || "";
        const haystack = [
          card.dataset.speaker,
          card.dataset.claim,
          card.dataset.context,
          index[card.dataset.evidenceKey || ""],
          question,
        ]
          .join(" ")
          .toLowerCase();
        if (haystack.includes(term))
          matches.push({
            kind: card.dataset.speaker || "Evidence",
            title: card.dataset.claim || "",
            meta: question,
            questionId: view?.dataset.view || "",
            color: view?.dataset.questionColor || "",
            open: () => {
              questionButton?.click();
              card.click();
            },
          });
      });
    matches.slice(0, 8).forEach((match) => {
      const button = document.createElement("button");
      button.type = "button";
      const kind = document.createElement("small");
      kind.textContent = match.kind;
      const title = document.createElement("b");
      title.textContent = match.title;
      const meta = document.createElement("span");
      meta.textContent = match.meta;
      const arrow = document.createElement("i");
      arrow.innerHTML =
        '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>';
      arrow.setAttribute("aria-hidden", "true");
      button.dataset.searchQuestion = match.questionId;
      button.append(kind, title, meta, arrow);
      button.addEventListener("click", () => {
        match.open();
        searchInput.value = "";
        closeSearch();
      });
      searchResults.append(button);
    });
    if (!matches.length) {
      const emptyResult = document.createElement("p");
      emptyResult.textContent = `No matches for “${searchInput.value.trim()}”.`;
      searchResults.append(emptyResult);
    }
    questionPanel?.classList.add("searching");
    searchResults.hidden = false;
  });
  document.addEventListener("pointerdown", (event) => {
    if (!(event.target as Element).closest(".search-shell")) closeSearch();
  });
  searchInput?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSearch();
    }
  });
  const applyNavigationState = () => {
    const params = new URLSearchParams(location.search);
    if (
      params.get("view") === "explore" ||
      (!params.has("view") && !params.has("person") && !params.has("compare"))
    )
      return;
    const requestedQuestion = params.get("question") || "understanding";
    const questionId = availableQuestionIds.includes(requestedQuestion)
      ? requestedQuestion
      : "understanding";
    const requestedView =
      params.get("view") ||
      (params.has("compare")
        ? "compare"
        : params.has("person")
          ? "follow"
          : "explore");
    restoringNavigation = true;
    if (root) root.dataset.restoringNavigation = "true";
    if (app) app.dataset.journeyStarted = "true";
    app?.classList.remove("journey-pending");

    const questionButton = root?.querySelector<HTMLButtonElement>(
      `[data-question="${CSS.escape(questionId)}"]`,
    );
    if (requestedView === "follow") {
      const person = params.get("person");
      if (
        person &&
        personViews.some((view) => view.dataset.personView === person)
      )
        showPerson(person);
      else showPeopleDirectory(params.has("question") ? questionId : "");
    } else if (requestedView === "compare") {
      cancelJourneyMotion();
      root?.classList.remove("show-welcome", "reading-viewport-locked");
      const welcome = root?.querySelector<HTMLElement>(".explore-welcome");
      if (welcome) welcome.hidden = true;
      if (!compareLaunch?.classList.contains("active")) compareLaunch?.click();
      root
        ?.querySelectorAll<HTMLElement>("[data-view]")
        .forEach((view) => (view.hidden = true));
      hidePeoplePages();
      if (comparisonView) comparisonView.hidden = false;
      if (aboutView) aboutView.hidden = true;
      if (contributionView) contributionView.hidden = true;
      setComparisonQuestion(params.has("question") ? questionId : "");
      const [personA, personB] = (params.get("compare") || "").split("|");
      if (personA)
        root
          ?.querySelector<HTMLButtonElement>(
            `[data-person-choice="a"][data-person-value="${CSS.escape(personA)}"]`,
          )
          ?.click();
      if (personB)
        root
          ?.querySelector<HTMLButtonElement>(
            `[data-person-choice="b"][data-person-value="${CSS.escape(personB)}"]`,
          )
          ?.click();
    } else if (requestedView === "about") {
      if (!aboutLaunch?.classList.contains("active")) aboutLaunch?.click();
    } else if (requestedView === "contribute") {
      openContribution();
    } else {
      questionButton?.click();
    }

    const evidence = params.get("evidence");
    if (evidence) {
      const card = root?.querySelector<HTMLButtonElement>(
        `[data-evidence-key="${CSS.escape(evidence)}"]`,
      );
      if (card) {
        card.dataset.openOrigin = "restored";
        card.click();
        delete card.dataset.openOrigin;
      }
    }
    restoringNavigation = false;
    if (root) delete root.dataset.restoringNavigation;
  };
  window.addEventListener("popstate", applyNavigationState);
  if (opensDirectly || directJourney.has("question"))
    setTimeout(applyNavigationState, 0);

  root?.querySelectorAll<HTMLElement>(".question-view").forEach((view) => {
    view
      .querySelector("[data-reveal-context]")
      ?.addEventListener("click", (event) => {
        const open = view.classList.toggle("context-revealed");
        (event.currentTarget as HTMLElement).setAttribute(
          "aria-expanded",
          String(open),
        );
      });
    view
      .querySelector("[data-reveal-reflection]")
      ?.addEventListener("click", (event) => {
        const open = view.classList.toggle("reflection-revealed");
        (event.currentTarget as HTMLElement).setAttribute(
          "aria-expanded",
          String(open),
        );
        if (open)
          view
            .querySelector(".explore-reflection")
            ?.scrollIntoView({ block: "start", behavior: "smooth" });
      });
    // Direct source and search entries retain a useful return to the positions.
  });
}
