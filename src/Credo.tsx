import React from "react";
import { ScrollReveal } from "./components/ScrollReveal";

export function Credo() {
  const paragraphs = [
    "What does it mean to “innovate the future?” Notice we do not say improve. It is not our place to tell people what they need or how they need it.",
    "Look at modern culture. The self-help gurus, the idealized notions of “progress.” The goal is always forceful, sanctimonious change. It is never called that, of course. It is called improvement or reaching a “higher level.” Save yourself and then save society. Society is riddled with the posture of you are doing something wrong, and I know better. The Christ complex runs rampant. It is neither helpful nor healthy nor humane. These are desires of the ego and for control, masquerading as innocent calls to revolution or thinking differently or trusting that a certain individual or institution is “for the people” and that they only care about our wellbeing.",
    "CIF stands for none of this. We do not wish to change or improve or save you. Sovereignty holds only when people are allowed to think, feel, act, and make mistakes on their own. Add parameters, expectations, or consequences, and it is no longer sovereignty. It is the slippery slope toward authoritarianism, persecution, and oppression, political, religious, technological, financial.",
    "So why innovate? Because we build things that do not yet exist out of attitudes, ideas, and teachings that already do. To innovate the future is to find principles of Humanity that have always been there but have not yet been recombined to make sense. The most profound discoveries were never completely new. They were things people already understood internally but could not yet express. The greats of every era did not receive divine revelation. They packaged the already-understood into an accessible form. They innovated the future.",
    "And why the future? Modern physics describes time less as a fixed quantity of the universe than as a Human way of organizing experience. Physicist Julian Barbour argues it does not fundamentally exist at all, that reality is a series of discrete “nows” with no flow between them. The future is not a static destination CIF is moving toward. It is already moving toward us, between us, within us, with us.",
    "To innovate the future means to build businesses and technologies that already carry the seeds of what people need, and to clear the path for those seeds to grow on their own terms. We are a building people choose to enter, on their own accord, for their own reasons, and leave whenever they wish. We do not persuade, control, or keep anyone, for any reason.",
    "We treat public skepticism and meme-culture as an immune system, stress-testing us and making us antifragile. Criticism that survives scrutiny becomes something we can trust. Ideas that collapse under it were never worth keeping. It is the same principle we apply to everyone else, now turned on ourselves: we offer our work and let it be chosen for or against.",
    "We are not exempt from our own argument. Consider the obvious contradiction: we run an organization called AI Skepticism, and the director works for an AI company and writes books on AI. The work is aligned, but a reasonable person could look at that and see hypocrisy. That question deserves to be asked, and asked seriously, answered with the same seriousness, tenacity, and respect. The world heals when people can ask institutions hard questions, get real answers, and then choose to trust them. No institution can demand respect. It must be earned. That is the entire point of what we are doing.",
    "CIF acknowledges this outcome is likely, so we refuse to rely on our own good intentions. Every organization that fell trusted its own morality and willpower. This is the pattern Humans always fall into, the one that ends in the control and sanctimony described above, the belief that we will be different. No, we will not. Given enough money, power, status, and relevance, we will behave exactly like the institutions modernity calls corrupt. So instead of rhyming with history, we build the safeguard into the structure. We document in public so that the moment we start to drift, the people watching see it before we do, and hold us to the words we wrote here. The choice stays honest because it is not ours alone to make. The people who give us money, relevance, and trust choose to keep doing so only as long as we hold to the standards we set.",
    "This is what it means to innovate the future. Not to improve you, not to save you, not to lead you anywhere. To build with care and foresight, in the open, and let you decide whether any of it is worth your trust. The choice was, is, and always will be yours. The day CIF stops earning your skepticism is the day it has become what it warned you about, and you will have the receipts, because we wrote them ourselves.",
  ];

  return (
    <main className="w-full flex-grow flex flex-col">
      <section className="w-full bg-white pt-[96px] md:pt-[120px] px-6 md:px-12 pb-16">
        <div className="max-w-[1100px] mx-auto flex flex-col">
          <div className="max-w-[800px] mx-auto flex flex-col space-y-6 items-center text-center mb-16">
            <h1 className="font-serif text-[40px] md:text-[48px] font-medium leading-tight text-ink text-balance">
              A credo for innovating the future
            </h1>
          </div>
          <div className="w-full h-px bg-[#D8D5CD]"></div>
        </div>
      </section>

      <ScrollReveal className="w-full py-[72px] px-6 md:px-12 flex-grow bg-paper">
        <div className="max-w-[800px] mx-auto flex flex-col space-y-12">
          <div className="space-y-8 text-[18px] md:text-[20px] text-ink/85 font-sans leading-relaxed text-justify">
            {paragraphs.map((para, idx) => (
              <p key={idx} className="text-balance">
                {para}
              </p>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </main>
  );
}
