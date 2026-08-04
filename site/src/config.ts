// Single source of truth for org facts. Change a property name here and nowhere else.
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

export const SKEPTICISM = {
  name: "Co-Existing with AI",
  page: "/work/coexisting-with-ai",
  blurb:
    "The Center's programme on what changes for people and organizations when the work starts being done alongside a machine. Convenings, published assessments, and private briefings for the people who have to act."
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
  cover: "/images/podcast-cover.png", // show art. Used everywhere, not the RSS image.
  page: "/podcast", // the property's page on this site. Cards link here, not off-site.
  blurb:
    "Long-form conversations with researchers, critics, and builders working at the edge of what is understood. The Center's public channel, and the origin of much of its other work.",
};

export const PROPERTIES = [SKEPTICISM, MANTIC, PODCAST];


// Media record. Add here; the homepage wall and /media both read from it.
// d  = sort key, newest first on /media.
// r  = wall order on the homepage, strongest outlet first. Only matters if a logo exists.
// Drop a logo at src/assets/media/<slug>.png and the wall picks it up.
export const MEDIA = [
  { slug: "montreal-review", n: "The Montréal Review", date: "Jul 2026", d: "2026-07", r: 11, note: "The Infinity of the Brain and the Void of the Machine, with Karl Friston.", u: "https://www.themontrealreview.com/Articles/the_infinity_of_the_brain_and_the_void_of_the_machine.php" },
  { slug: "psychology-today", n: "Psychology Today", date: "Nov 2025", d: "2025-11", r: 10, note: "The Risks of AI and Social Media for the Developing Brain, with Ran D. Anbar, MD.", u: "https://www.psychologytoday.com/sg/blog/understanding-hypnosis/202511/the-risks-of-ai-and-social-media-for-the-developing-brain" },
  { slug: "microsoft-reactor", n: "Microsoft Reactor", date: "Feb 2025", d: "2025-02", r: 15, note: "Coexisting with AI: Succeeding In the New Era. Created and hosted at Reactor Toronto.", u: "https://reactor.microsoft.com/en-us/reactor/events/24836/" },
  { slug: "scmp", n: "South China Morning Post", date: "Aug 2023", d: "2023-08", r: 5, note: "Opinion on how seriously the world takes Beijing.", u: "https://www.scmp.com/comment/opinion/article/3222234/more-nations-oppose-china-how-seriously-does-world-take-beijing" },
  { slug: "cnbc", n: "CNBC", date: "Jun 2023", d: "2023-06", r: 3, note: "On generative AI as the next front in the US-China technology contest.", u: "https://www.cnbc.com/2023/06/23/us-china-tech-war-why-generative-ai-could-be-the-next-battleground.html" },
  { slug: "nikkei-asia", n: "Nikkei Asia", date: "Mar 2023", d: "2023-03", r: 2, note: "Opinion. A world out of balance and who gets to correct it.", u: "https://asia.nikkei.com/Opinion/World-out-of-balance-is-not-yet-China-s-to-set-right" },
  { slug: "fortune", n: "Fortune", date: "Oct 2022", d: "2022-10", r: 4, note: "On what a third term means for China's technology sector.", u: "https://fortune.com/2022/10/24/china-xi-jinping-third-term-tech-sector-chips-semiconductors/" },
  { slug: "scientific-american", n: "Scientific American", date: "2018 to 2022", d: "2022-10", r: 1, note: "Four essays on algorithmic foreign policy and the geopolitics of technology.", u: "https://www.scientificamerican.com/author/abishur-prakash/" },
  { slug: "digitimes", n: "DigiTimes Asia", date: "Sep 2022", d: "2022-09", r: 16, note: "Interview on semiconductors and the trade war.", u: "https://www.digitimes.com/news/a20220902VL202/geopolitics-semiconductor-us-china-trade-war.html" },
  { slug: "riac", n: "Russian International Affairs Council", date: "Dec 2021", d: "2021-12", r: 17, note: "Interview. The vertical world.", u: "https://russiancouncil.ru/en/analytics-and-comments/interview/the-vertical-world-an-interview-with-abishur-prakash/" },
  { slug: "asia-times", n: "Asia Times", date: "2020 to 2021", d: "2021-11", r: 8, note: "Five essays plus an interview on new blocs and the fracturing of the technology order.", u: "https://asiatimes.com/author/abishur-prakash/" },
  { slug: "brookings", n: "Brookings Institution", date: "Nov 2020", d: "2020-11", r: 7, note: "Cited in Uncomfortable Ground Truths: predictive analytics and national security.", u: "https://www.brookings.edu/wp-content/uploads/2020/11/fp_20201130_uncomfortable_ground_truths.pdf" },
  { slug: "fpri", n: "Foreign Policy Research Institute", date: "Sep 2019", d: "2019-09", r: 9, note: "Cited in Think Global, Fund Local.", u: "https://www.fpri.org/article/2019/09/think-global-fund-local/" },
  { slug: "risk-group", n: "Risk Group", date: "Jan 2019", d: "2019-01", r: 18, note: "Artificial intelligence driven industry transformation.", u: "https://riskgroupllc.com/author/aseem-prakash/" },
  { slug: "robotics-business-review", n: "Robotics Business Review", date: "Aug 2017", d: "2017-08", r: 12, note: "Interview. Coexisting with robots.", u: "https://www.roboticsbusinessreview.com/ai/global-futurist-robobusiness-speaker-aseem-prakash-shares-thoughts-coexisting-with-robots/" },
  { slug: "robobusiness", n: "RoboBusiness", date: "2017", d: "2017-06", r: 19, note: "Two sessions on selling robotics upward and setting expectations.", u: "https://www.roboticsbusinessreview.com/ai/global-futurist-robobusiness-speaker-aseem-prakash-shares-thoughts-coexisting-with-robots/" },
  { slug: "robohub", n: "Robohub", date: "Apr 2017", d: "2017-04", r: 13, note: "Closing keynote at International Robotics Week, Delft.", u: "https://robohub.org/recap-from-international-robotics-week/" },
  { slug: "innovationquarter", n: "InnovationQuarter", date: "Apr 2017", d: "2017-04", r: 14, note: "International Robotics Week, Delft.", u: "https://www.innovationquarter.nl/en/international-robotics-week-connecting-robots-people-worldwide/" },
  { slug: "senate-of-canada", n: "Senate of Canada", date: "Feb 2017", d: "2017-02", r: 6, note: "Witness before the Standing Committee on Social Affairs, Science and Technology.", u: "https://sencanada.ca/en/content/sen/Committee/421/soci/14ev-53044-e" },
  { slug: "fibre2fashion", n: "Fibre2Fashion", date: "Apr 2016", d: "2016-04", r: 20, note: "Get ready for the future.", u: "https://www.fibre2fashion.com/industry-article/author/aseem-prakash/4052" },
];

// Newest first, for /media.
export const MEDIA_BY_DATE = [...MEDIA].sort((a, b) => b.d.localeCompare(a.d));
