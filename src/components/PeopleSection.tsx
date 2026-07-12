import { ScrollReveal } from "./ScrollReveal";
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
    description:
      "Ayush is Chief of Staff at New Sapience, a $125M deep-tech company building deterministic AI for mission-critical systems, where he leads strategy and operations and architected equity crowdfunding campaigns that raised over $3.5M from thousands of investors. He is the author of AI for Gen Z, an investigation into how AI and digital technology are rewiring the first generation raised inside algorithmic systems, and has spoken at Suffolk University's Sawyer Business School and co-authored work in Psychology Today with Dr. Ran D. Anbar on AI's effects on the developing brain. On the Ayush Prakash Podcast, he hosts long-form conversations with thinkers including Avi Loeb, Karl Friston, and Yaron Brook. 150+ episodes, 6K+ subscribers, 100K+ views.",
    contactLinks: [
      {
        label: "WEBSITE",
        urlText: "ayushprakash.com",
        url: "https://ayushprakash.com",
      },
      {
        label: "LINKEDIN",
        urlText: "in/prakash-ayush",
        url: "https://linkedin.com/in/prakash-ayush",
      },
    ],
    canvasType: "ayush",
  },
];

export function PeopleSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <ScrollReveal
      id="the-director"
      className="max-w-[1100px] mx-auto w-full px-6 md:px-12 py-[72px] md:py-[120px] space-y-s5 mt-0"
    >
      <div className="space-y-s3">
        <h2 className="text-[28px] md:text-[40px] font-display text-ink font-bold leading-none tracking-tight text-balance">
          Members
        </h2>
        <p className="text-xs md:text-sm text-ink/85 font-sans max-w-2xl leading-relaxed text-balance">
          All members of{" "}
          <strong className="font-bold text-ink">
            Center for Innovating the Future
          </strong>{" "}
          operate in their full capacity to create, research, and build in
          accordance with the fundamental principles of the enterprise.
        </p>
      </div>

      <div className="border-t border-ink-15 mt-s5">
        {PEOPLE_DATA.map((person) => {
          const isOpen = expandedId === person.id;
          return (
            <div
              key={person.id}
              id={`person_card_${person.id}`}
              className="border-b border-ink-15 py-s3 sm:py-s4 transition-colors duration-200"
            >
              <button
                id={`person_trigger_${person.id}`}
                onClick={() => toggleExpand(person.id)}
                className="w-full text-left flex items-center justify-between group cursor-pointer focus:outline-none"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-s1 sm:gap-s2">
                  <div className="flex items-baseline gap-s1">
                    <span className="text-[20px] md:text-[24px] font-sans text-ink font-bold tracking-tight group-link-hover transition duration-200">
                      {person.name}
                    </span>
                    <span className="text-xs text-ink font-sans max-sm:block">
                      , {person.role}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center min-w-[40px]">
                  {isOpen ? (
                    <div className="transition-transform duration-300 transform-gpu rotate-0 text-ink p-1.5 hover:bg-gray-50 rounded-none border border-transparent hover:border-ink-15">
                      <X className="w-5 h-5 stroke-[1.5]" />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-[3.5px] items-end py-2 cursor-pointer w-[24px]">
                      <span className="h-[1.5px] w-5 bg-ink transition-all duration-300 group-hover:w-6"></span>
                      <span className="h-[1.5px] w-3.5 bg-ink transition-all duration-300 group-hover:w-5"></span>
                    </div>
                  )}
                </div>
              </button>

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
                    <div className="pt-s4 pb-s1">
                      <PersonProfileCard person={person} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </ScrollReveal>
  );
}

function PersonProfileCard({ person }: { person: PersonData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-s5 items-start pt-s2">
      <div className="lg:col-span-8 flex flex-col justify-between self-stretch min-h-[350px]">
        <div className="space-y-s3">
          {person.description.split("\n\n").map((para, idx) => {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const parts = para.split(urlRegex);
            return (
              <p
                key={idx}
                className="text-sm md:text-base text-ink-70 leading-relaxed font-sans max-w-2xl font-bold text-balance"
              >
                {parts.map((part, partIdx) => {
                  if (part.match(urlRegex)) {
                    return (
                      <a
                        key={partIdx}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ink font-medium link-hover transition-colors inline-block"
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

        <div className="pt-s5 border-t border-ink-15 mt-s5 max-w-xl space-y-s2 tracking-wider">
          {person.contactLinks.map((link, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-2 border-b border-ink-15"
            >
              <span className="text-ink-70">{link.label}</span>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink link-hover transition flex items-center gap-1 font-bold"
              >
                {link.urlText}
                <ExternalLink className="w-3 h-3 text-ink-70" />
              </a>
            </div>
          ))}

          <div className="flex items-center justify-between py-2 border-b border-ink-15">
            <span className="text-ink-70">BASED IN</span>
            <span className="text-ink font-bold">{person.location}</span>
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 flex flex-col items-center">
        <div className="relative border border-ink-15 p-s2 sm:p-s3 bg-white select-none text-center w-full max-w-[320px]">
          <div className="relative w-full aspect-[4/5] overflow-hidden bg-white">
            <img
              src={userPhoto}
              alt={person.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
