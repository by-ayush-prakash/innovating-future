import connections from "./record-connections.json";
import { speakerProfiles } from "./ai-native-prototype";
import editorial from "./record-editorial.json";
import { questions } from "./record-questions";
const initialQuestion = questions[0];
// Consistent phrase breaks keep every opening question in the same two-line rhythm.
const questionLines: Record<string, string[]> = {
  understanding: ["Does AI actually", "understand us?"],
  evidence: ["When should we trust", "an AI answer?"],
  learning: ["How should AI change", "how we learn?"],
  work: ["What happens to work", "when AI gets better?"],
  creativity: ["What should remain human", "in creative work?"],
  relationships: ["How is technology changing", "our relationships?"],
  wellbeing: ["What does AI do to", "mental health and attention?"],
  judgment: ["How do we keep", "human judgment?"],
  privacy: ["Who controls", "our data?"],
  governance: ["Who decides where", "AI gets used?"],
};
const laneLabels = {
  agreement: "Shared ground",
  disagreement: "Points of tension",
  uncertainty: "Still unresolved",
  perspective: "Mapped perspective",
};
const sourceCategoryLabels = {
  research: "Research & evidence",
  industry: "Industry & practice",
  policy: "Policy & governance",
  public: "Culture & public life",
} as const;
const sourceCategoryFor = (speaker: string) => {
  const role =
    speakerProfiles
      .find((profile) => profile.name === speaker)
      ?.role.toLowerCase() || "";
  if (/policy|governance/.test(role)) return "policy";
  if (/founder|ceo|entrepreneur|investor|operator|workforce/.test(role))
    return "industry";
  if (
    /research|scientist|psycholog|therapist|clinical|geographer|roboticist/.test(
      role,
    )
  )
    return "research";
  return "public";
};
const personSlugFor = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
const displayPersonName = (name: string) => name.replace(/^Dr\.?\s+/i, "");
const personInitialsFor = (name: string) =>
  displayPersonName(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
const genericRole =
  /^(Operator|Critic|Policy|Research|To verify) perspective$/i;
const atlasContributors = speakerProfiles
  .map((profile) => {
    const sourceCategory = sourceCategoryFor(profile.name);
    const contributions = questions.flatMap((question) =>
      question.evidence
        .filter((evidence) => evidence.speaker === profile.name)
        .map((evidence) => ({
          ...evidence,
          questionId: question.id,
          questionNumber: question.number,
          question: question.question,
          questionColor: question.color,
          questionSoftColor: question.softColor,
        })),
    );
    return {
      ...profile,
      slug: personSlugFor(profile.name),
      initials: personInitialsFor(profile.name),
      sourceCategory,
      displayRole: genericRole.test(profile.role)
        ? sourceCategoryLabels[sourceCategory]
        : profile.role,
      questionCount: new Set(contributions.map((item) => item.questionId)).size,
      contributions,
    };
  })
  .filter((profile) => profile.contributions.length > 0);
const contributorCategoryOrder = [
  "research",
  "industry",
  "policy",
  "public",
] as const;
const contributorGroups = contributorCategoryOrder
  .map((category, index) => ({
    category,
    number: String(index + 1).padStart(2, "0"),
    label: sourceCategoryLabels[category],
    people: atlasContributors
      .filter((person) => person.sourceCategory === category)
      .sort((a, b) => a.name.localeCompare(b.name)),
  }))
  .filter((group) => group.people.length > 0);
const comparisonDefaults = ["Karl Friston", "Viviane Clay"];
const publicReading = Object.fromEntries(
  questions.map((q) => [
    q.id,
    {
      intro: "",
      cards: Object.keys(editorial)
        .filter((key) => key.startsWith(`${q.id}:`))
        .map((key) => {
          const evidenceIndex = q.evidence.findIndex(
            (item) => item.editorialKey === key,
          );
          if (evidenceIndex < 0)
            throw new Error(`Missing editorial source ${key}`);
          const story = editorial[key as keyof typeof editorial];
          return { title: story.title, body: story.standfirst, evidenceIndex };
        }),
    },
  ]),
);
const reflectionChoices = {
  understanding: [
    { value: "lean", label: "Behaviour can count as understanding" },
    { value: "different", label: "Understanding requires more than behaviour" },
    { value: "more", label: "We cannot tell yet" },
  ],
  judgment: [
    { value: "lean", label: "People must retain the final judgment" },
    {
      value: "different",
      label: "AI can extend decisions beyond human limits",
    },
    { value: "more", label: "Oversight depends on real power to refuse" },
  ],
  governance: [
    { value: "lean", label: "Affected people need a direct say" },
    { value: "different", label: "Institutions still hold the power" },
    { value: "more", label: "Accountability remains unclear" },
  ],
  evidence: [
    { value: "lean", label: "Trust only source-linked answers" },
    { value: "different", label: "Verification should depend on the stakes" },
    { value: "more", label: "Current tests remain incomplete" },
  ],
  learning: [
    { value: "lean", label: "AI should support practice" },
    {
      value: "different",
      label: "Access matters more than unaided performance",
    },
    { value: "more", label: "The effect depends on subject and age" },
  ],
  work: [
    { value: "lean", label: "AI will mainly change tasks" },
    { value: "different", label: "AI will remove important entry routes" },
    { value: "more", label: "The employment evidence is still early" },
  ],
  creativity: [
    { value: "lean", label: "Human authorship must remain visible" },
    { value: "different", label: "AI can be a legitimate creative partner" },
    { value: "more", label: "Permission and economics need clearer evidence" },
  ],
  relationships: [
    { value: "lean", label: "Technology can deepen connection" },
    { value: "different", label: "Mediation removes essential context" },
    { value: "more", label: "Different relationships need different tests" },
  ],
  wellbeing: [
    { value: "lean", label: "Product design is a meaningful risk" },
    { value: "different", label: "Vulnerability matters more than the tool" },
    { value: "more", label: "Causation remains unresolved" },
  ],
  privacy: [
    { value: "lean", label: "People need enforceable data control" },
    { value: "different", label: "Collective exposure is the larger problem" },
    {
      value: "more",
      label: "Consent is unclear when services are unavoidable",
    },
  ],
};
const learningGuides = {
  understanding: {
    headline: "Four different claims hide inside the word “understand.”",
    intro:
      "The claim becomes stronger as you move from a convincing response toward conscious experience. Evidence for one step does not automatically prove the next.",
    concepts: [
      {
        term: "Behaviour",
        meaning: "The system gives an appropriate response.",
        boundary:
          "Observable from the outside. It does not reveal how the response was produced.",
      },
      {
        term: "World model",
        meaning:
          "The system represents features, locations, movement, or change.",
        boundary:
          "An internal model can guide action without establishing conscious experience.",
      },
      {
        term: "Agency",
        meaning:
          "The system pursues goals, plans, learns, or reflects on its own decisions.",
        boundary:
          "These are separate abilities. Having one does not guarantee the others.",
      },
      {
        term: "Experience",
        meaning: "There is something it feels like to be the system.",
        boundary:
          "This is the strongest meaning of consciousness and the hardest one to test.",
      },
    ],
    tension:
      "The interviews do not offer three answers to one settled definition. They reveal a ladder of claims, from convincing behaviour to internal models to first-person experience.",
    prompts: [
      "Is the speaker describing useful behaviour, an internal model, goal-directed action, or felt experience?",
      "What observation would separate a system that models the world from one that only produces a convincing response?",
      "Could the same evidence be explained by imitation? If so, it cannot settle the stronger claim.",
    ],
    mapTitle: "Explore the evidence map.",
    mapDescription:
      "Each card is one source-linked claim. Shared ground marks overlap, Points of tension shows competing tests or interpretations, and Still unresolved holds what these interviews cannot settle.",
  },
  judgment: {
    headline:
      "Oversight requires knowledge, authority, and the ability to refuse.",
    intro:
      "Keeping a person in the loop means little if they cannot understand the recommendation, challenge it, or act against it.",
    concepts: [
      {
        term: "Comprehension",
        meaning:
          "Can the person understand why the system produced its recommendation?",
        boundary:
          "An explanation is useful only if the decision-maker can evaluate it.",
      },
      {
        term: "Discretion",
        meaning: "Can the person choose a different course?",
        boundary:
          "Approval without a practical right to refuse is procedural, not meaningful.",
      },
      {
        term: "Capability",
        meaning: "Can the person still decide without the system?",
        boundary: "Dependence can make formal oversight weaker over time.",
      },
      {
        term: "Responsibility",
        meaning: "Who answers for the final decision?",
        boundary:
          "Responsibility should stay with an actor who also has corrective power.",
      },
    ],
    tension:
      "AI can expand the number of variables people consider while also encouraging deference. The central question is whether assistance preserves a person’s capacity and authority to disagree.",
    prompts: [
      "Can the person explain the trade-offs in the recommendation?",
      "What happens if they reject it?",
      "Who has responsibility and corrective power when the decision causes harm?",
    ],
    mapTitle: "Explore the evidence map.",
    mapDescription:
      "Each card is one source-linked position on assistance, dependence, explanation, values, or the limits of human decision-making.",
  },
  governance: {
    headline: "Power sits at different points in an AI system.",
    intro:
      "Using a system, shaping its rules, choosing where it is deployed, and answering for its failures are different forms of control.",
    concepts: [
      {
        term: "Access",
        meaning: "Who can use the system?",
        boundary:
          "Use does not give a person influence over the system’s rules or objectives.",
      },
      {
        term: "Agency",
        meaning: "Who can shape the trade-offs or refuse the system?",
        boundary:
          "Consent is weak when there is no practical alternative or appeal.",
      },
      {
        term: "Deployment power",
        meaning: "Who chooses where the system is used and for what purpose?",
        boundary:
          "Researchers may create ideas while institutions control their application.",
      },
      {
        term: "Accountability",
        meaning: "Who must explain, correct, or answer for a harmful decision?",
        boundary:
          "A rule without an accountable decision-maker is difficult to challenge.",
      },
    ],
    tension:
      "The central disagreement is institutional. Saying that everyone should have a voice does not identify who makes the decision, how affected people participate, or where an appeal goes.",
    prompts: [
      "Name the person or institution that selected the system and set its objective.",
      "Can an affected person refuse, appeal, or meaningfully change the decision?",
      "If the system fails, who has both responsibility and the power to correct it?",
    ],
    mapTitle: "Explore the evidence map.",
    mapDescription:
      "Each card is one source-linked claim. Shared ground marks common principles, Points of tension shows competing accounts of power, and Still unresolved names decisions with no clear answer or accountable actor.",
  },
  evidence: {
    headline: "A confident answer can still be unsupported.",
    intro:
      "Trust depends on provenance, verification, uncertainty, and consequences. Fluency is evidence about presentation, not truth.",
    concepts: [
      {
        term: "Provenance",
        meaning: "Can the answer be traced to a source?",
        boundary:
          "A citation must support the specific claim, not merely discuss the same topic.",
      },
      {
        term: "Verification",
        meaning: "Can the claim be checked independently?",
        boundary:
          "Users often need prior knowledge to notice what is missing or wrong.",
      },
      {
        term: "Calibration",
        meaning: "Does confidence match the available evidence?",
        boundary:
          "A system can sound certain even when evidence is mixed or absent.",
      },
      {
        term: "Consequence",
        meaning: "What happens if the answer is wrong?",
        boundary:
          "Higher-stakes decisions require stronger evidence and clearer accountability.",
      },
    ],
    tension:
      "The interviews agree that checking matters but leave open who can verify unfamiliar material, which sources count, and how much evidence is enough for a given decision.",
    prompts: [
      "What source supports this exact claim?",
      "Could the user recognize an important omission?",
      "How should the standard change if an error causes material harm?",
    ],
    mapTitle: "Explore the evidence map.",
    mapDescription:
      "The positions separate plausible output, expert knowledge, verification practice, public trust, and the evidence needed for adoption.",
  },
  learning: {
    headline: "Completion, comprehension, and mastery are different outcomes.",
    intro:
      "AI can improve access and immediate performance while removing the practice through which knowledge and judgment develop.",
    concepts: [
      {
        term: "Access",
        meaning: "Does AI make useful instruction or information available?",
        boundary:
          "Access alone does not show that a learner understands or retains it.",
      },
      {
        term: "Practice",
        meaning: "Does the learner still perform the difficult parts?",
        boundary:
          "Removing every obstacle can also remove feedback and productive struggle.",
      },
      {
        term: "Transfer",
        meaning: "Can the learner apply the skill in a new setting?",
        boundary:
          "A polished assisted result may conceal weak independent capability.",
      },
      {
        term: "Assessment",
        meaning: "What is the school actually measuring?",
        boundary:
          "Assignments lose meaning when the output no longer reveals the student’s process.",
      },
    ],
    tension:
      "The same tool can widen educational access and weaken learning. The effect depends on task design, age, prior knowledge, and whether unaided ability is still tested.",
    prompts: [
      "What part of the task must the learner still do?",
      "Can they explain and reproduce the result without AI?",
      "Who gains access and who loses a reliable path to mastery?",
    ],
    mapTitle: "Explore the evidence map.",
    mapDescription:
      "The positions connect access, productive struggle, project-based learning, assessment, dependence, and institutional adaptation.",
  },
  work: {
    headline:
      "Jobs are bundles of tasks, training routes, and bargaining power.",
    intro:
      "The interviews describe current pressure on hiring and development, but they do not establish one economy-wide employment outcome.",
    concepts: [
      {
        term: "Task change",
        meaning: "Which parts of a role are assisted, altered, or removed?",
        boundary:
          "Automating a task does not automatically eliminate the occupation.",
      },
      {
        term: "Entry route",
        meaning: "How does a new worker acquire experience?",
        boundary:
          "Removing junior work can weaken the pipeline for later expertise.",
      },
      {
        term: "Skill value",
        meaning: "Which capabilities remain scarce and transferable?",
        boundary:
          "Tool familiarity matters only when it contributes to valuable work.",
      },
      {
        term: "Distribution",
        meaning:
          "Who receives the productivity gains and who carries the disruption?",
        boundary: "Aggregate growth can coexist with concentrated loss.",
      },
    ],
    tension:
      "Some positions emphasize adaptation and productivity; others emphasize weakened training, flattened hiring signals, job loss, and the unequal ability to absorb disruption.",
    prompts: [
      "Which task changed, for whom, and over what period?",
      "Where will new workers gain experience?",
      "Who controls the savings or new value created?",
    ],
    mapTitle: "Explore the evidence map.",
    mapDescription:
      "The positions cover hiring, junior development, transferable skills, productivity, commercial value, displacement, and social responses.",
  },
  creativity: {
    headline:
      "Generation, authorship, practice, and permission are separate questions.",
    intro:
      "AI can contribute useful material without settling who made the work, whose material trained the system, or what human practice was displaced.",
    concepts: [
      {
        term: "Generation",
        meaning: "Did the system produce novel material?",
        boundary:
          "Novelty alone does not establish value, intention, or authorship.",
      },
      {
        term: "Direction",
        meaning: "Which choices and judgments belong to the human creator?",
        boundary:
          "Prompting can involve judgment, but the depth of control varies by workflow.",
      },
      {
        term: "Permission",
        meaning: "Was source material used with consent?",
        boundary:
          "Public availability does not settle authorization, compensation, or attribution.",
      },
      {
        term: "Practice",
        meaning: "What does making the work do for the person?",
        boundary:
          "Automating output can remove a process used to develop thought and meaning.",
      },
    ],
    tension:
      "The archive contains useful creative assistance and strong objections to replacement. The disagreement concerns control, consent, economics, and whether process matters independently of output.",
    prompts: [
      "Which creative decisions did the person make?",
      "What source material made the result possible, and was it authorized?",
      "What human practice or livelihood changes when the output is automated?",
    ],
    mapTitle: "Explore the evidence map.",
    mapDescription:
      "The positions connect creative value, writing practice, artistic meaning, cultural context, generated imagery, and training-data consent.",
  },
  relationships: {
    headline: "Connection can expand while context becomes thinner.",
    intro:
      "Digital systems help people find community and disclose safely, while also turning people into profiles, audiences, signals, and content.",
    concepts: [
      {
        term: "Reach",
        meaning: "Who can find one another through the system?",
        boundary:
          "More contact does not guarantee durable support or mutual understanding.",
      },
      {
        term: "Context",
        meaning: "What can each person know about the other?",
        boundary:
          "Profiles and posts omit embodiment, history, and the setting in which meaning was made.",
      },
      {
        term: "Reciprocity",
        meaning: "Can both sides shape the relationship?",
        boundary:
          "One-sided recommendation or parasocial interaction may feel connected without being mutual.",
      },
      {
        term: "Incentive",
        meaning: "What behaviour does the platform reward?",
        boundary:
          "Attention and engagement goals can turn ordinary life into material for performance.",
      },
    ],
    tension:
      "The interviews resist a simple online-versus-offline split. The important differences are the relationship involved, the platform’s incentives, and what context or control mediation removes.",
    prompts: [
      "What relationship is being formed or changed?",
      "What context is lost when the interaction becomes a profile, post, or chatbot exchange?",
      "Who benefits from keeping the interaction active?",
    ],
    mapTitle: "Explore the evidence map.",
    mapDescription:
      "The positions span community, intimacy, parenting, activism, dating, social feedback, cultural context, and the boundaries that sustain relationships.",
  },
  wellbeing: {
    headline:
      "Mechanism, vulnerability, and clinical causation must be separated.",
    intro:
      "The interviews identify persuasive design, dependence, attention loss, and vulnerable use without supporting one universal mental-health effect.",
    concepts: [
      {
        term: "Mechanism",
        meaning: "How might the product influence behaviour or distress?",
        boundary: "A plausible mechanism is not proof of a clinical outcome.",
      },
      {
        term: "Exposure",
        meaning: "How often and in what way is the system used?",
        boundary:
          "Availability and heavy use can correlate with distress without establishing its cause.",
      },
      {
        term: "Vulnerability",
        meaning: "Which prior conditions or social circumstances matter?",
        boundary: "Effects may differ sharply across users and moments.",
      },
      {
        term: "Resilience",
        meaning: "What helps a person regain attention and choice?",
        boundary:
          "Individual habits cannot substitute for safer product design or clinical care.",
      },
    ],
    tension:
      "Some positions locate harm in product incentives and repeated use; others stress prior vulnerability, social conditions, and the limits of current evidence.",
    prompts: [
      "Is the claim about attention, dependence, distress, or a clinical disorder?",
      "What design feature or pattern of use is involved?",
      "What evidence separates causation from correlation?",
    ],
    mapTitle: "Explore the evidence map.",
    mapDescription:
      "The positions cover persuasive feeds, repeated checking, attention, resilience, emotional regulation, AI-mediated beliefs, and causal uncertainty.",
  },
  privacy: {
    headline:
      "Privacy includes inference, groups, dependence, and the power to refuse.",
    intro:
      "A person can reveal little and still be classified. A community can be exposed even when individual consent appears intact.",
    concepts: [
      {
        term: "Collection",
        meaning: "What information enters the system?",
        boundary: "A narrow disclosure can still be combined with other data.",
      },
      {
        term: "Inference",
        meaning: "What new attributes does the system predict?",
        boundary:
          "Inferred information can be sensitive even when it was never directly supplied.",
      },
      {
        term: "Collective harm",
        meaning: "Which group is classified, exposed, or treated differently?",
        boundary:
          "Individual consent cannot resolve every community-level consequence.",
      },
      {
        term: "Refusal",
        meaning: "Can a person realistically avoid or leave the system?",
        boundary:
          "Consent is weak when participation is necessary for work, education, or public life.",
      },
    ],
    tension:
      "The archive moves privacy beyond secrecy. The unresolved issue is how individuals and groups can contest inference and concentrated data power when digital participation is difficult to avoid.",
    prompts: [
      "What did the person provide, and what did the system infer?",
      "Who else is affected by the classification?",
      "What practical refusal, correction, or remedy exists?",
    ],
    mapTitle: "Explore the evidence map.",
    mapDescription:
      "The positions connect individual and collective privacy, inference, dependence, permission, concentrated ownership, and fear of informational power.",
  },
};
let sourceIndex = 0;
const journeyContent = questions.flatMap((q) =>
  q.evidence.map((item, index) => {
    const starter = publicReading[
      q.id as keyof typeof publicReading
    ]?.cards.find((card) => card.evidenceIndex === index);
    const profile = speakerProfiles.find(
      (profile) => profile.name === item.speaker,
    );
    return {
      key: `${q.id}:${item.speaker}:${item.timestamp}`,
      editorialKey: item.editorialKey,
      kind: [
        "Mike Todasco",
        "Liz Smith",
        "Rob Eleveld",
        "David Alter",
      ].includes(item.speaker)
        ? "Personal account"
        : "Speaker’s argument",
      related: connections[item.editorialKey as keyof typeof connections] || [],
      question: q.question,
      title: starter?.title || item.claim,
      source: {
        speaker: item.speaker,
        role: profile?.role || "",
        contribution: "",
        timestamp: item.timestamp,
        video: item.video,
        turns: [],
        turnsUrl: `/work/coexisting-with-ai/record/sources/${sourceIndex++}.json`,
      },
      standfirst: item.story?.standfirst || "",
      summary: item.story?.paragraph || item.claim,
    };
  }),
);

export const recordViewModel = {
  initialQuestion,
  questionLines,
  laneLabels,
  sourceCategoryLabels,
  sourceCategoryFor,
  personSlugFor,
  displayPersonName,
  personInitialsFor,
  genericRole,
  atlasContributors,
  contributorCategoryOrder,
  contributorGroups,
  comparisonDefaults,
  publicReading,
  reflectionChoices,
  learningGuides,
  journeyContent,
  questions,
  speakerProfiles,
};
