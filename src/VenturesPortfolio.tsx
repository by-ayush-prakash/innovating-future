import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScrollReveal } from "./components/ScrollReveal";

export function VenturesPortfolio() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <div className="w-full bg-paper pt-[120px] md:pt-[160px] pb-24 min-h-screen font-sans text-ink">
      <ScrollReveal className="max-w-[1100px] mx-auto px-6 md:px-12">
        <div className="w-full flex flex-col items-center mb-16">
          <div className="max-w-[800px] mx-auto space-y-6 flex flex-col items-center text-center">
            <h1 className="font-serif font-medium text-[40px] md:text-[48px] text-ink leading-[1.1] tracking-tight text-balance">
              Our Work.
            </h1>
            <p className="font-sans text-[18px] text-[#46443D] leading-[1.6] max-w-[700px] mx-auto text-balance">
              CIF builds research programs, publishes books, convenes people,
              and hosts long-form conversations on the questions that matter
              most and move fastest.
            </p>
          </div>
        </div>

        <div className="flex flex-col w-full">
          <div className="flex flex-col md:flex-row w-full border-t border-[#D8D5CD] py-16 group">
            <div className="md:w-1/5 mb-8 md:mb-0 md:border-r border-[#D8D5CD] md:pr-8">
              <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-[#46443D]">
                RESEARCH & ADVOCACY
              </span>
            </div>

            <div className="md:w-4/5 md:pl-12 flex flex-col items-start">
              <h2 className="font-serif font-medium text-[28px] md:text-[32px] text-ink leading-tight mb-6 text-balance">
                <a
                  href="https://forhumanfutures.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline transition-all underline-offset-4 decoration-1"
                >
                  Institute for Human Futures: building the tools civil society
                  needs to contest the forces reshaping public life.
                </a>
              </h2>
              <p className="font-sans text-[18px] text-[#46443D] leading-relaxed italic text-balance">
                "CIF's research and advocacy arm. The Institute produces
                scorecards, playbooks, and policy research designed to be picked
                up and used. Its flagship convening program, AI Skepticism,
                brings together the people and institutions rethinking
                artificial intelligence and public life. Canada is Edition 1."
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row w-full border-t border-[#D8D5CD] py-16 group">
            <div className="md:w-1/5 mb-8 md:mb-0 md:border-r border-[#D8D5CD] md:pr-8">
              <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-[#46443D]">
                PUBLISHING
              </span>
            </div>

            <div className="md:w-4/5 md:pl-12 flex flex-col items-start">
              <h2 className="font-serif font-medium text-[28px] md:text-[32px] text-ink leading-tight mb-6 text-balance">
                <a
                  href="https://manticpublishing.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline transition-all underline-offset-4 decoration-1"
                >
                  Mantic Publishing: an independent press for arguments too long
                  for an essay and too witty for a textbook.
                </a>
              </h2>
              <p className="font-sans text-[18px] text-[#46443D] leading-relaxed italic text-balance">
                "Books about the ideas changing what it means to be human. We
                look for ideas that demand permanence and authors willing to be
                held to them."
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row w-full border-t border-b border-[#D8D5CD] py-16 group">
            <div className="md:w-1/5 mb-8 md:mb-0 md:border-r border-[#D8D5CD] md:pr-8">
              <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-[#46443D]">
                MEDIA
              </span>
            </div>

            <div className="md:w-4/5 md:pl-12 flex flex-col items-start">
              <h2 className="font-serif font-medium text-[28px] md:text-[32px] text-ink leading-tight mb-6 text-balance">
                <a
                  href="https://www.youtube.com/@ayushprakashofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline transition-all underline-offset-4 decoration-1"
                >
                  The Ayush Prakash Podcast: 150+ long-form conversations with
                  researchers, critics, and builders working at the edges of
                  what we understand.
                </a>
              </h2>
              <p className="font-sans text-[18px] text-[#46443D] leading-relaxed italic text-balance">
                "The podcast is CIF's public channel. It surfaces the people and
                arguments that shape the rest of our work."
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
