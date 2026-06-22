import React, { useState } from "react";
import { ExternalLink, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import userPhoto from "../assets/images/1739325958814.jpeg";

interface PersonData {
  id: string;
  name: string;
  role: string;
  location: string;
  label: string;
  description: string;
  contactLinks: Array<{ label: string; urlText: string; url: string }>;
  canvasType: "ayush";
}

const PEOPLE_DATA: PersonData[] = [
  {
    id: "ayush",
    name: "Ayush Prakash",
    role: "CIF Director",
    location: "MONTRÉAL",
    label: "CIF DIRECTOR",
    description: "Over the last five years, Ayush Prakash's work on AI strategy, corporate governance, and the societal impact of emerging technology has shaped both how a deep-tech company scales and how a generation understands the tools reshaping it. He is the Chief of Staff at New Sapience, a $125M company pioneering mission-critical deterministic AI, where he leads strategy and operations and architected the creative strategy behind equity crowdfunding campaigns that raised over $3.5M from thousands of investors worldwide. He is also the author of AI for Gen Z, a definitive investigation into how artificial intelligence and digital technology are rewiring the brains, identities, and futures of the first generation to come of age inside algorithmic systems.\n\nAs a recognized Gen Z authority on the cognitive and societal impacts of AI, Ayush has spoken at Suffolk University's Sawyer Business School and co-authored work in Psychology Today with Dr. Ran D. Anbar on how AI and social media affect the developing brain. On the Ayush Prakash Podcast, he hosts deep-dive dialogues with the world's most prominent thinkers — including Harvard astrophysicist Avi Loeb, neuroscientist Karl Friston, and Ayn Rand Institute chairman Yaron Brook — building a community of 6K+ subscribers and 100K+ views across 150+ episodes. Whether streamlining strategy for a deep-tech startup or dissecting the future of AGI, his focus is turning world-changing ideas into measurable momentum.",
    contactLinks: [
      { label: "WEBSITE", urlText: "ayushprakash.com", url: "https://ayushprakash.com" },
      { label: "LINKEDIN", urlText: "in/prakash-ayush", url: "https://linkedin.com/in/prakash-ayush" }
    ],
    canvasType: "ayush"
  }
];

export function PeopleSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <section id="the-director" className="max-w-7xl mx-auto w-full px-6 md:px-12 py-10 space-y-12 mt-0">
      <div className="space-y-4">
        <h2 className="text-3xl sm:text-4xl font-serif text-[#2D2D2D] font-light leading-none tracking-tight">
          Members
        </h2>
        <p className="text-xs md:text-sm text-[#2D2D2D]/85 font-sans max-w-2xl leading-relaxed">
          All members of <strong className="font-bold text-[#2D2D2D]">Centre for Innovating the Future</strong> operate in their full capacity to create, research, and build in accordance with the fundamental principles of the enterprise.
        </p>
      </div>

      {/* Accordion List Matching the Screenshot design */}
      <div className="border-t border-[#2D2D2D]/20 mt-8">
        {PEOPLE_DATA.map((person) => {
          const isOpen = expandedId === person.id;
          return (
            <div
              key={person.id}
              id={`person_card_${person.id}`}
              className="border-b border-[#2D2D2D]/20 py-5 sm:py-6 transition-colors duration-200"
            >
              <button
                id={`person_trigger_${person.id}`}
                onClick={() => toggleExpand(person.id)}
                className="w-full text-left flex items-center justify-between group cursor-pointer focus:outline-none"
              >
                {/* Person's Title */}
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg sm:text-xl font-serif text-[#2D2D2D] font-light tracking-tight group-hover:text-[#3171C6] transition duration-200">
                      {person.name}
                    </span>
                    <span className="text-xs text-[#3171C6] font-serif italic max-sm:block">
                      — {person.role}
                    </span>
                  </div>
                </div>

                {/* Minimalist toggle indicator with exact styles from design screenshots */}
                <div className="flex items-center justify-center min-w-[40px]">
                  {isOpen ? (
                    <div className="transition-transform duration-300 transform-gpu rotate-0 text-[#3171C6] p-1.5 hover:bg-[#3171C6]/5 rounded-none border border-transparent hover:border-[#3171C6]/10">
                      <X className="w-5 h-5 stroke-[1.5]" />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-[3.5px] items-end py-2 cursor-pointer w-[24px]">
                      <span className="h-[1.5px] w-5 bg-[#3171C6] transition-all duration-300 group-hover:w-6"></span>
                      <span className="h-[1.5px] w-3.5 bg-[#3171C6] transition-all duration-300 group-hover:w-5"></span>
                    </div>
                  )}
                </div>
              </button>

              {/* Collapsed/Expanded panel with dynamic coordinates canvas */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`person_content_panel_${person.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6 pb-2">
                      <PersonProfileCard person={person} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function PersonProfileCard({ person }: { person: PersonData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
      {/* Bio, Role, and Contact list on Left */}
      <div className="lg:col-span-8 flex flex-col justify-between self-stretch min-h-[350px]">
        <div className="space-y-5">
          {person.description.split("\n\n").map((para, idx) => {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const parts = para.split(urlRegex);
            return (
              <p key={idx} className="text-sm md:text-base text-[#2D2D2D]/80 leading-relaxed font-sans max-w-2xl font-light">
                {parts.map((part, partIdx) => {
                  if (part.match(urlRegex)) {
                    return (
                      <a
                         key={partIdx}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#3171C6] hover:text-[#2D2D2D] font-medium underline underline-offset-4 transition-colors inline-block"
                      >
                        {part.replace("https://", "")}
                      </a>
                    );
                  }
                  return part;
                })}
              </p>
            );
          })}
        </div>

        {/* Structured Credentials */}
        <div className="pt-8 border-t border-[#2D2D2D]/20 mt-8 max-w-xl space-y-3.5 font-mono text-[10px] uppercase tracking-wider">
          {person.contactLinks.map((link, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b border-[#2D2D2D]/20">
              <span className="text-[#2D2D2D]/70">{link.label}</span>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2D2D2D] hover:text-[#3171C6] transition flex items-center gap-1 font-bold"
              >
                {link.urlText}
                <ExternalLink className="w-3 h-3 text-[#2D2D2D]/70" />
              </a>
            </div>
          ))}

          <div className="flex items-center justify-between py-2 border-b border-[#2D2D2D]/20">
            <span className="text-[#2D2D2D]/70">BASED IN</span>
            <span className="text-[#2D2D2D] font-bold">{person.location}</span>
          </div>
        </div>
      </div>

      {/* Static Profile Image */}
      <div className="lg:col-span-4 flex flex-col items-center">
        <div className="relative border border-[#2D2D2D]/20 p-2 sm:p-4 bg-[#F4F3F1] select-none text-center w-full max-w-[320px]">
          <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#F4F3F1]">
            <img src={userPhoto} alt={person.name} className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="absolute top-6 left-6 bg-[#3171C6] px-2 py-0.5 border border-[#3171C6] z-20 text-[8px] font-mono text-white uppercase tracking-widest">
            {person.label}
          </div>
        </div>
      </div>
    </div>
  );
}
