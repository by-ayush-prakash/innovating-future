import React, { useState } from "react";
import userPhoto from "./assets/images/1739325958814.jpeg";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PersonData {
  id: string;
  name: string;
  role: string;
  location: string;
  label: string;
  description: string;
  shortBio: string;
  contactLinks: Array<{ label: string; urlText: string; url: string }>;
  canvasType: "ayush";
}

const PEOPLE_DATA: PersonData[] = [
  {
    id: "ayush",
    name: "Ayush Prakash",
    role: "Director",
    location: "MONTRÉAL",
    label: "CIF DIRECTOR",
    description:
      "Ayush is Chief of Staff at New Sapience, a $125M deep-tech company building deterministic AI for mission-critical systems, where he leads strategy and operations and architected equity crowdfunding campaigns that raised over $3.5M from thousands of investors. He is the author of AI for Gen Z, an investigation into how AI and digital technology are rewiring the first generation raised inside algorithmic systems, and has spoken at Suffolk University's Sawyer Business School and co-authored work in Psychology Today with Dr. Ran D. Anbar on AI's effects on the developing brain. On the Ayush Prakash Podcast, he hosts long-form conversations with thinkers including Avi Loeb, Karl Friston, and Yaron Brook. 150+ episodes, 6K+ subscribers, 100K+ views.",
    shortBio:
      "Ayush is Chief of Staff at New Sapience and Director at CIF. He is the author of AI for Gen Z and host of the Ayush Prakash Podcast.",
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

const MemberCard: React.FC<{ person: PersonData }> = ({ person }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col w-full max-w-[400px]">
      <div className="w-full aspect-[4/5] overflow-hidden rounded-sm mb-4 bg-gray-50">
        <img
          src={userPhoto}
          alt={person.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-row items-start justify-between">
        <div className="flex flex-col space-y-1">
          <h3 className="font-display font-bold text-[20px] text-ink text-balance">
            {person.name}
          </h3>
          <span className="font-sans text-[15px] text-[#46443D]">
            {person.role}
          </span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 text-ink-70 hover:text-ink transition-colors focus:outline-none"
        >
          <motion.div
            animate={{ rotate: isExpanded ? 45 : 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <Plus className="w-5 h-5" />
          </motion.div>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="font-sans text-[15px] text-[#46443D] pt-4 text-balance">
              {person.shortBio}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function Leadership() {
  return (
    <main className="w-full flex-grow flex flex-col">
      <section className="w-full bg-white pt-[96px] md:pt-[120px] px-6 md:px-12 pb-16">
        <div className="max-w-[1100px] mx-auto flex flex-col">
          <div className="max-w-[800px] mx-auto flex flex-col space-y-6 items-center text-center mb-16">
            <h1 className="font-serif text-[40px] md:text-[48px] font-medium leading-tight text-ink text-balance">
              Visionary leaders inspired to create lasting change
            </h1>
            <p className="font-sans text-[18px] text-[#46443D] leading-[1.6] max-w-[700px] mx-auto text-balance">
              Leadership at{" "}
              <strong className="font-semibold text-ink">
                Center for Innovating the Future
              </strong>{" "}
              operates in full capacity to create, research, and build in
              accordance with the fundamental principles of the enterprise.
            </p>
          </div>
          <div className="w-full h-px bg-[#D8D5CD]"></div>
        </div>
      </section>

      <section className="w-full bg-paper pt-20 pb-32 px-6 md:px-12">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12 items-start justify-items-start">
            {PEOPLE_DATA.map((person) => (
              <MemberCard key={person.id} person={person} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
