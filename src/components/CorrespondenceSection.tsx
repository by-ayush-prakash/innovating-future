import React from "react";
import { Link } from "react-router-dom";
import { ScrollReveal } from "./ScrollReveal";

export function CorrespondenceSection() {
  return (
    <section className="w-full bg-[#DCE8F0] py-[140px] flex flex-col items-center">
      <ScrollReveal
        id="correspondence"
        className="max-w-[1100px] mx-auto w-full px-6 md:px-12 flex flex-col items-center text-center"
      >
        <h2 className="text-[36px] md:text-[48px] font-serif font-medium text-ink leading-tight mb-8">
          Innovate the future. With us.
        </h2>
        <Link
          to="/contact"
          className="inline-flex items-center justify-center bg-white text-[#14130F] border border-[#14130F] px-8 py-4 rounded-full font-sans font-semibold tracking-wide transition hover:bg-[#14130F] hover:text-white"
        >
          Contact
        </Link>
      </ScrollReveal>
    </section>
  );
}
