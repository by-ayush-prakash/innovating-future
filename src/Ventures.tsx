import React, { useEffect } from "react";
import { ScrollReveal } from "./components/ScrollReveal";

export function Ventures() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full bg-paper min-h-screen pt-[160px] pb-[120px]">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12 flex flex-col items-center">
        <div className="w-full flex flex-col items-center">
          <ScrollReveal className="w-full max-w-[800px] text-center flex flex-col items-center gap-6 mb-16 mx-auto">
            <h1 className="text-[40px] md:text-[48px] font-serif font-medium text-ink leading-tight text-balance">
              What CIF believes.
            </h1>
            <p className="font-sans text-[18px] text-[#46443D] leading-[1.6] max-w-[700px] mx-auto text-balance">
              CIF is built on a small number of commitments. They shape what we
              publish, who we convene, and what we refuse.
            </p>
          </ScrollReveal>
        </div>

        <div className="w-full max-w-[800px] flex flex-col">
          <ScrollReveal className="w-full flex flex-col pt-[64px] pb-[64px] border-t border-[#D8D5CD]">
            <h2 className="font-serif font-medium text-[28px] text-ink leading-tight mb-4 text-balance">
              Principle 1: Independence
            </h2>
            <p className="font-sans text-[16px] text-[#46443D] leading-relaxed text-balance">
              The work has no sponsor. CIF does not accept funding that comes
              with editorial conditions, and does not produce research on behalf
              of the organizations it studies.
            </p>
          </ScrollReveal>

          <ScrollReveal className="w-full flex flex-col pt-[64px] pb-[64px] border-t border-[#D8D5CD]">
            <h2 className="font-serif font-medium text-[28px] text-ink leading-tight mb-4 text-balance">
              Principle 2: Utility
            </h2>
            <p className="font-sans text-[16px] text-[#46443D] leading-relaxed text-balance">
              Ideas that cannot be used are decoration. Every research program,
              publication, and convening is built to produce something a
              specific person or institution can act on.
            </p>
          </ScrollReveal>

          <ScrollReveal className="w-full flex flex-col pt-[64px] pb-[64px] border-t border-[#D8D5CD]">
            <h2 className="font-serif font-medium text-[28px] text-ink leading-tight mb-4 text-balance">
              Principle 3: Honesty
            </h2>
            <p className="font-sans text-[16px] text-[#46443D] leading-relaxed text-balance">
              CIF publishes what it finds, not what is convenient. If the
              evidence contradicts the position, the position moves. If a
              question is unanswerable, we say so.
            </p>
          </ScrollReveal>

          <ScrollReveal className="w-full flex flex-col pt-[64px] pb-[64px] border-t border-[#D8D5CD]">
            <h2 className="font-serif font-medium text-[28px] text-ink leading-tight mb-4 text-balance">
              Principle 4: Duration
            </h2>
            <p className="font-sans text-[16px] text-[#46443D] leading-relaxed text-balance">
              The questions CIF works on are not seasonal. The organization is
              built for decades of sustained attention to the forces reshaping
              human life, not for cycles of hype and retreat.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
