import React from "react";
import { Link } from "react-router-dom";
import { ScrollReveal } from "./components/ScrollReveal";

export function Careers() {
  return (
    <main className="w-full flex-grow flex flex-col bg-white">
      <section className="w-full bg-white pt-[96px] md:pt-[120px] px-6 md:px-12 pb-16">
        <div className="max-w-[1100px] mx-auto flex flex-col">
          <div className="max-w-[800px] mx-auto flex flex-col space-y-6 items-center text-center mb-16">
            <h1 className="font-serif text-[40px] md:text-[48px] font-medium leading-tight text-ink text-balance">
              Careers at CIF
            </h1>
            <div className="flex flex-col space-y-2">
              <p className="font-sans text-[18px] text-[#46443D] leading-[1.6] max-w-[700px] mx-auto text-balance">
                We're not hiring for defined roles. That doesn't mean there
                isn't one.
              </p>
              <p className="font-sans text-[16px] text-[#84817A] leading-[1.6] max-w-[700px] mx-auto text-balance">
                If you think there's a case for a role that doesn't exist yet,
                reach out and make it.
              </p>
            </div>
          </div>
          <div className="w-full h-px bg-[#D8D5CD]"></div>
        </div>
      </section>

      <section className="w-full py-[72px] md:py-[120px] px-6 md:px-12 bg-white">
        <ScrollReveal className="max-w-[1100px] mx-auto flex flex-col md:flex-row md:justify-between items-start gap-16 md:gap-12">
          <div className="w-full md:w-[55%] flex flex-col">
            <h2 className="font-serif text-[40px] md:text-[48px] font-medium leading-[1.1] text-ink mb-8 text-left text-balance">
              Who we're looking for, eventually.
            </h2>
            <div className="flex flex-col space-y-4 font-sans text-[16px] text-[#46443D] leading-relaxed">
              <p className="text-balance">
                CIF invests in the ventures it works with. Early hires join
                something they have a stake in, not just a role.
              </p>
              <p className="text-balance">
                Right now that's a small team wearing a lot of hats. As the
                ventures under CIF mature, each will need people running it.
                Hiring at CIF isn't one job opening. It's picking which future
                venture you'd want to help build.
              </p>
            </div>
          </div>

          <div className="w-full md:w-[40%] flex flex-col space-y-12 pt-2 md:pt-4">
            <div className="flex flex-col">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-5 h-5 rounded-full border border-ink flex items-center justify-center flex-shrink-0">
                  <svg
                    width="10"
                    height="8"
                    viewBox="0 0 10 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 4.5L3.5 7L9 1"
                      stroke="#14130F"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="font-mono text-[12px] tracking-widest text-ink uppercase font-bold">
                  Conviction over credentials
                </h3>
              </div>
              <p className="font-sans text-[16px] text-[#46443D] leading-relaxed ml-8 text-balance">
                People who've taken real positions on things, not just held
                roles.
              </p>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-5 h-5 rounded-full border border-ink flex items-center justify-center flex-shrink-0">
                  <svg
                    width="10"
                    height="8"
                    viewBox="0 0 10 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 4.5L3.5 7L9 1"
                      stroke="#14130F"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="font-mono text-[12px] tracking-widest text-ink uppercase font-bold">
                  Builders, not operators-in-waiting
                </h3>
              </div>
              <p className="font-sans text-[16px] text-[#46443D] leading-relaxed ml-8 text-balance">
                A bias toward shipping over process.
              </p>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-5 h-5 rounded-full border border-ink flex items-center justify-center flex-shrink-0">
                  <svg
                    width="10"
                    height="8"
                    viewBox="0 0 10 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 4.5L3.5 7L9 1"
                      stroke="#14130F"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="font-mono text-[12px] tracking-widest text-ink uppercase font-bold">
                  Comfort with ambiguity
                </h3>
              </div>
              <p className="font-sans text-[16px] text-[#46443D] leading-relaxed ml-8 text-balance">
                Early-stage venture work has no playbook yet. That's the job.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="w-full bg-[#DCE8F0] py-[140px] flex flex-col items-center">
        <ScrollReveal className="max-w-[1100px] mx-auto w-full px-6 md:px-12 flex flex-col items-center text-center">
          <h2 className="text-[36px] md:text-[48px] font-serif font-medium text-ink leading-tight mb-8 text-balance">
            Start with what we stand for.
          </h2>
          <Link
            to="/credo"
            className="inline-flex items-center justify-center bg-white text-[#14130F] border border-[#14130F] px-8 py-4 rounded-full font-sans font-semibold tracking-wide transition hover:bg-[#14130F] hover:text-white"
          >
            Read Our Credo
          </Link>
        </ScrollReveal>
      </section>
    </main>
  );
}
