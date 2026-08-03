// Single source of truth for org facts. Rename IHF here and nowhere else.
export const ORG = {
  name: "Center for Innovating the Future",
  short: "CIF",
  city: "Toronto",
  founded: 2010,
  email: "hello@innovatingfuture.com",
  linkedin: "https://www.linkedin.com/company/centre-for-innovating-the-future/",
};

// Sentences that appear on more than one page. Change here, changes everywhere.
export const COPY = {
  tagline: "A Toronto strategy innovation lab, established December 2010.",
};

export const IHF = {
  name: "Institute for Human Futures", // TODO: rename. Change here only.
  url: "https://forhumanfutures.org",
  page: "/work/institute",
  blurb:
    "The Center's research and advocacy arm. It produces scorecards, playbooks, and policy research for civil society, and convenes AI Skepticism, which opens with Canada as Edition One.",
};

export const MANTIC = {
  name: "Mantic Publishing",
  url: "https://manticpublishing.com",
  page: "/work/mantic",
  blurb:
    "The Center's press. A new imprint for long-form arguments on the technologies and ideas changing what it means to be human.",
};

export const PODCAST = {
  name: "The Ayush Prakash Podcast",
  url: "https://www.youtube.com/@ayushprakashofficial", // where to subscribe
  page: "/podcast", // the property's page on this site. Cards link here, not off-site.
  blurb:
    "Long-form conversations with researchers, critics, and builders working at the edge of what is understood. The Center's public channel, and the origin of much of its other work.",
};

export const PROPERTIES = [IHF, MANTIC, PODCAST];

export const PRINCIPLES = [
  {
    h: "Research answers to the question, not the funder.",
    p: "The Center does not accept research funding that carries editorial conditions, and does not publish research assessing an organization that funds it.",
  },
  {
    h: "Research is built to be used.",
    p: "Every research program, publication, and convening is designed to produce something a specific person or institution can act on.",
  },
  {
    h: "The Center publishes what it finds.",
    p: "Where evidence contradicts a position, the position changes. Where a question cannot be answered, the Center says so.",
  },
  {
    h: "The questions are not seasonal.",
    p: "The Center is built for sustained attention over decades, not for cycles of announcement and retreat.",
  },
];
