import React from "react";
import { ScrollReveal } from "./components/ScrollReveal";

export function Terms() {
  const paragraphs = [
    "Welcome to the Center for Innovating the Future (CIF). These Terms of Use govern your access to and use of innovatingfuture.com and any related services provided by CIF.",
    "By accessing or using our website, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the website.",
    "The content on this website, including but not limited to text, graphics, images, logos, and digital downloads, is the property of the Center for Innovating the Future or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works from this content without express written permission from CIF.",
    'Your use of this website is at your sole risk. The website is provided on an "AS IS" and "AS AVAILABLE" basis. CIF makes no warranties, expressed or implied, regarding the accuracy, reliability, or availability of the website or its content.',
    "In no event shall the Center for Innovating the Future, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the website.",
    "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our website after those revisions become effective, you agree to be bound by the revised terms.",
  ];

  return (
    <main className="w-full flex-grow flex flex-col">
      <section className="w-full bg-white pt-[96px] md:pt-[120px] px-6 md:px-12 pb-16">
        <div className="max-w-[1100px] mx-auto flex flex-col">
          <div className="max-w-[800px] mx-auto flex flex-col space-y-6 items-center text-center mb-16">
            <h1 className="font-serif text-[40px] md:text-[48px] font-medium leading-tight text-ink text-balance">
              Terms of Use
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
