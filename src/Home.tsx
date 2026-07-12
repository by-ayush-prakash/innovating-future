import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ScrollReveal } from "./components/ScrollReveal";

import { CorrespondenceSection } from "./components/CorrespondenceSection";

export function Home() {
  return (
    <>
      <header className="relative w-full bg-white px-6 md:px-12 pt-[160px] pb-[100px]">
        <div className="max-w-[720px] mx-auto text-left flex flex-col items-start gap-10">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-[28px] font-serif font-normal text-[#14130F] leading-[1.6] text-balance"
          >
            The Center for Innovating the Future (CIF) is an independent
            intellectual enterprise based in Toronto. It builds the arguments,
            tools, and institutions that help people think clearly about the
            forces reshaping human life. Some of this work is entirely new. Some
            recombines what already exists into a form people can finally use.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-[28px] font-serif font-normal text-[#14130F] leading-[1.6] text-balance"
          >
            CIF's work starts from a single conviction that the most
            consequential questions of our time are not being asked by the
            people most affected by the answers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto"
          >
            <Link
              to="/credo"
              className="bg-white text-ink border border-ink-15 px-8 py-3.5 rounded-sm font-sans font-semibold tracking-wide transition hover:bg-[#F9F9F9] text-center w-full sm:w-auto cursor-pointer inline-block"
            >
              Read the Credo
            </Link>
          </motion.div>
        </div>
      </header>

      <section className="w-full bg-white py-[72px] md:py-[120px] flex flex-col items-center">
        <ScrollReveal className="w-full max-w-[1100px] px-6 md:px-12">
          <div className="text-center w-full pb-16">
            <h2 className="text-[36px] md:text-[48px] font-serif font-medium text-ink leading-tight text-balance">
              How we work
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 relative md:grid-rows-[auto_1fr]">
            <div className="hidden md:block absolute top-0 bottom-0 left-1/3 w-px bg-[#D8D5CD] -translate-x-1/2"></div>
            <div className="hidden md:block absolute top-0 bottom-0 left-2/3 w-px bg-[#D8D5CD] -translate-x-1/2"></div>

            <div className="md:col-start-1 md:row-start-1 text-left px-6 md:px-10 mb-4 md:mb-6 mt-0">
              <h3 className="font-serif font-medium text-[24px] md:text-[28px] text-ink leading-tight text-balance">
                Independent research, not commissioned opinion.
              </h3>
            </div>
            <div className="md:col-start-1 md:row-start-2 text-left px-6 md:px-10 pb-4 md:pb-0">
              <p className="font-sans text-[16px] text-[#46443D] leading-relaxed text-balance">
                CIF's positions come from its own inquiry. No corporate
                sponsors. No consulting clients. The work answers to the
                question, not the funder.
              </p>
            </div>

            <div className="md:col-start-2 md:row-start-1 text-left px-6 md:px-10 mb-4 md:mb-6 mt-12 md:mt-0">
              <h3 className="font-serif font-medium text-[24px] md:text-[28px] text-ink leading-tight text-balance">
                Public tools, not private access.
              </h3>
            </div>
            <div className="md:col-start-2 md:row-start-2 text-left px-6 md:px-10 pb-4 md:pb-0">
              <p className="font-sans text-[16px] text-[#46443D] leading-relaxed text-balance">
                What CIF builds is designed to be used. Scorecards, playbooks,
                frameworks. If civil society can't pick it up and act on it, it
                doesn't ship.
              </p>
            </div>

            <div className="md:col-start-3 md:row-start-1 text-left px-6 md:px-10 mb-4 md:mb-6 mt-12 md:mt-0">
              <h3 className="font-serif font-medium text-[24px] md:text-[28px] text-ink leading-tight text-balance">
                Conviction over consensus.
              </h3>
            </div>
            <div className="md:col-start-3 md:row-start-2 text-left px-6 md:px-10 pb-12 md:pb-0">
              <p className="font-sans text-[16px] text-[#46443D] leading-relaxed text-balance">
                CIF takes clear positions on contested questions. Intellectual
                courage, not a hedge, is what separates useful work from
                forgettable work.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <CorrespondenceSection />
    </>
  );
}
