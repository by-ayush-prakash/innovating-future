import React from "react";

export function CorrespondenceSection() {
  return (
    <section id="correspondence" className="max-w-7xl mx-auto w-full px-6 md:px-12 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-serif text-[#2D2D2D] font-light tracking-tight leading-snug">
              Innovate the future.<span className="italic text-[#3171C6] pl-1.5 select-none">With us.</span>
            </h2>
            <p className="text-[#2D2D2D]/80 text-sm md:text-base leading-relaxed font-sans font-normal pt-2">
              CIF works with organisations — businesses, governments, institutions —  taking a longer view on technology. In select cases we co-build, incubate, or take a stake.
            </p>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="border border-[#2D2D2D]/20 bg-[#F4F3F1] p-8 space-y-6 cream-card-glow hover:border-[#3171C6]/50 transition duration-300">
            <div className="space-y-4">
              <div className="bg-[#F4F3F1] border border-[#2D2D2D]/20 p-5 font-mono text-center shadow-sm">
                <span className="text-base sm:text-lg md:text-xl font-serif text-[#2D2D2D] font-light tracking-wide block select-all">
                  contact <span className="text-[#3171C6] font-sans font-semibold">[at]</span> innovatingfuture <span className="text-[#3171C6] font-sans font-semibold">[dot]</span> com
                </span>
              </div>
              
              <p className="text-xs text-[#2D2D2D]/80 leading-relaxed font-sans">
                To protect our institutional bandwidth against automated digital web-crawlers and scraper algorithms, we express our address above using clear natural syntax. 
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
