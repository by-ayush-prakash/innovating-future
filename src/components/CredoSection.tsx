import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

interface CredoSectionProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CredoSection({ isOpen, onClose }: CredoSectionProps) {
  // Prevent scroll propagation
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const paragraphs = [
    "What does it mean to “innovate the future?” Notice we do not say improve. It is not our place to tell people what they need or how they need it.",
    "Look at modern culture. The self-help gurus, the idealized notions of “progress.” The goal is always forceful, sanctimonious change. It is never called that, of course. It is called improvement or reaching a “higher level.” Save yourself and then save society. Society is riddled with the posture of you are doing something wrong, and I know better. The Christ complex runs rampant. It is neither helpful nor healthy nor humane. These are desires of the ego and for control, masquerading as innocent calls to revolution or thinking differently or trusting that a certain individual or institution is “for the people” and that they only care about our wellbeing.",
    "CIF stands for none of this. We do not wish to change or improve or save you. Sovereignty holds only when people are allowed to think, feel, act, and make mistakes on their own. Add parameters, expectations, or consequences, and it is no longer sovereignty. It is the slippery slope toward authoritarianism, persecution, and oppression — political, religious, technological, financial.",
    "So why innovate? Because we build things that do not yet exist out of attitudes, ideas, and teachings that already do. To innovate the future is to find principles of Humanity that have always been there but have not yet been recombined to make sense. The most profound discoveries were never completely new. They were things people already understood internally but could not yet express. The greats of every era did not receive divine revelation. They packaged the already-understood into an accessible form. They innovated the future.",
    "And why the future? Modern physics describes time less as a fixed quantity of the universe than as a Human way of organizing experience. Physicist Julian Barbour argues it does not fundamentally exist at all — that reality is a series of discrete “nows” with no flow between them. The future is not a static destination CIF is moving toward. It is already moving toward us, between us, within us, with us.",
    "To innovate the future means to build businesses and technologies that already carry the seeds of what people need, and to clear the path for those seeds to grow on their own terms. We are a building people choose to enter, on their own accord, for their own reasons, and leave whenever they wish. We do not persuade, control, or keep anyone, for any reason.",
    "We treat public skepticism and meme-culture as an immune system, stress-testing us and making us antifragile. Criticism that survives scrutiny becomes something we can trust. Ideas that collapse under it were never worth keeping. It is the same principle we apply to everyone else, now turned on ourselves: we offer our work and let it be chosen for or against.",
    "We are not exempt from our own argument. Consider the obvious contradiction: we run an organization called AI Skepticism, and the director works for an AI company and writes books on AI. The work is aligned, but a reasonable person could look at that and see hypocrisy. That question deserves to be asked — and asked seriously, answered with the same seriousness, tenacity, and respect. The world heals when people can ask institutions hard questions, get real answers, and then choose to trust them. No institution can demand respect. It must be earned. That is the entire point of what we are doing.",
    "CIF acknowledges this outcome is likely, so we refuse to rely on our own good intentions. Every organization that fell trusted its own morality and willpower. This is the pattern Humans always fall into, the one that ends in the control and sanctimony described above — the belief that we will be different. No, we will not. Given enough money, power, status, and relevance, we will behave exactly like the institutions modernity calls corrupt. So instead of rhyming with history, we build the safeguard into the structure. We document in public so that the moment we start to drift, the people watching see it before we do, and hold us to the words we wrote here. The choice stays honest because it is not ours alone to make. The people who give us money, relevance, and trust choose to keep doing so only as long as we hold to the standards we set.",
    "This is what it means to innovate the future. Not to improve you, not to save you, not to lead you anywhere. To build with care and foresight, in the open, and let you decide whether any of it is worth your trust. The choice was, is, and always will be yours. The day CIF stops earning your skepticism is the day it has become what it warned you about — and you will have the receipts, because we wrote them ourselves."
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-[#F4F3F1] overflow-y-auto flex flex-col selection:bg-[#3171C6] selection:text-[#F4F3F1]"
        >
          {/* Header Bar */}
          <header className="sticky top-0 z-10 bg-[#F4F3F1]/90 backdrop-blur-md px-6 md:px-12 py-6 border-b border-[#2D2D2D]/10">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <span className="font-mono text-sm uppercase tracking-[0.2em] font-medium text-[#2D2D2D]/70 select-none">
                CENTRE FOR INNOVATING THE FUTURE
              </span>
              <button
                onClick={onClose}
                className="flex items-center justify-center p-2 rounded-full border border-[#2D2D2D]/20 hover:border-[#2D2D2D] hover:bg-black/5 transition cursor-pointer text-[#2D2D2D]"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-grow max-w-4xl w-full mx-auto px-6 md:px-12 py-12 md:py-20 flex flex-col justify-between">
            <article className="space-y-12">
              <div className="space-y-3 pb-8 border-b border-[#2D2D2D]/10">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#2D2D2D] font-light tracking-wide leading-tight uppercase">
                  A Credo For<br />Innovating the Future
                </h1>
              </div>

              <div className="space-y-8 text-base md:text-lg text-[#2D2D2D]/85 font-serif leading-relaxed text-justify">
                {paragraphs.map((para, idx) => (
                  <p key={idx}>
                    {para}
                  </p>
                ))}
              </div>
            </article>

            {/* Document Footer */}
            <footer className="mt-20 pt-8 border-t border-[#2D2D2D]/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#2D2D2D]/50 select-none">
              <span>CIF</span>
              <span>Toronto</span>
            </footer>
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
