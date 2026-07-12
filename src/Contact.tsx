import React from "react";
import { CorrespondenceSection } from "./components/CorrespondenceSection";

export function Contact() {
  return (
    <main className="w-full flex-grow flex flex-col">
      <section className="w-full bg-white pt-[96px] md:pt-[120px] px-6 md:px-12 pb-16">
        <div className="max-w-[1100px] mx-auto flex flex-col">
          <div className="max-w-[800px] mx-auto flex flex-col space-y-6 items-center text-center mb-16">
            <h1 className="font-serif text-[40px] md:text-[48px] font-medium leading-tight text-ink text-balance">
              Get in touch
            </h1>
            <p className="font-sans text-[18px] text-[#46443D] leading-[1.6] max-w-[700px] mx-auto text-balance">
              Reach out to us directly for any inquiries.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="border border-[#D8D5CD] bg-white px-6 py-3 inline-flex items-center">
                <span className="font-mono text-[14px] text-ink">
                  contact [at] innovatingfuture [dot] com
                </span>
              </div>
            </div>
          </div>
          <div className="w-full h-px bg-[#D8D5CD]"></div>
        </div>
      </section>

      <CorrespondenceSection />
    </main>
  );
}
