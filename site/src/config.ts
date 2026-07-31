// Single source of truth for org facts. Rename IHF here and nowhere else.
export const ORG = {
  name: "Center for Innovating the Future",
  short: "CIF",
  city: "Toronto",
  email: "ayush@innovatingfuture.com",
  linkedin: "https://www.linkedin.com/company/centre-for-innovating-the-future/",
};

// Sentences that appear on more than one page. Change here, changes everywhere.
export const COPY = {
  fundingStance: "CIF accepts funding. It does not accept editorial direction.",
  fundingAsk:
    "Host institutions, researchers, and funders working on the same questions can reach the Center directly.",
  tagline: "Builds and holds independent institutions. Toronto.",
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
    "The Center's independent press. It publishes long-form arguments on the technologies and ideas changing what it means to be human.",
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
    h: "Independent research, not commissioned opinion.",
    p: "CIF's positions come from its own inquiry. It accepts no corporate sponsorship and takes no consulting clients, and its research answers to the question rather than to a funder.",
  },
  {
    h: "Public tools, not private access.",
    p: "The Center publishes scorecards, playbooks, and frameworks built for direct use. Work that civil society cannot apply is not published.",
  },
  {
    h: "Conviction over consensus.",
    p: "The Center states clear positions on contested questions, and revises them in public when the evidence changes.",
  },
];
