import React, { useEffect, useState } from "react";
import { ScrollReveal } from "./components/ScrollReveal";
import eBookImg from "./assets/images/eBook.webp";

const placeholderImg =
  "https://placehold.co/300x450/e2e8f0/64748b?text=Cover+Coming+Soon";

const books = [
  {
    id: "ai-for-gen-z",
    title: "AI for Gen Z",
    bookSubtitle:
      "What Digital Technology Is Doing to Our Brains, Our Future, and the Generation Coming of Age Inside It",
    author: "Ayush Prakash",
    cover: eBookImg,
    description:
      "AI for Gen Z is a revealing investigation into how artificial intelligence and digital technologies are quietly rewriting the script of modern life — reshaping how we think, connect, work, and even define who we are.\n\nFor Generation Z, AI isn't the future — it's the backdrop of their entire lives. From TikTok's algorithmic influence to romantic relationships with virtual companions, from deepfakes and misinformation to job automation and weaponized drones, this generation is growing up in a world radically altered by machines that learn.\n\nWhat began as tools of convenience have become tools of control. Platforms designed to connect us now fracture our attention, feed us curated realities, and cultivate emotional dependence. The result is a generation navigating identity, intimacy, and purpose under the shadow of technologies that were never made with their well-being in mind.\n\nThis is not just a story about AI. It's a story about how we lost control of the technologies that shape our reality — and what that means for the first generation raised inside the machine.\n\nBlending history, philosophy, and sharp cultural analysis, Ayush Prakash traces how surveillance capitalism, social media psychology, and the unchecked arms race in AI are reshaping Gen Z's inner worlds. He offers not just a diagnosis, but a call to rethink the systems we've built before they rewrite us entirely.\n\nAI for Gen Z is essential reading for anyone seeking to understand how digital technology has rewired a generation — and what it will take to reclaim our attention, autonomy, and humanity.",
    link: "https://www.amazon.com/dp/0981182135?lv=shuf&channelId=500&plpRedirect=mhFallback",
    metadata: [
      { label: "Publisher", value: "CIF / Mantic Publishing" },
      { label: "Release Date", value: "2024" },
      { label: "Format", value: "Paperback & eBook" },
      { label: "ISBN", value: "9780981182131" },
    ],
  },
  {
    id: "transcendence-of-money",
    title: "The Transcendence of Money",
    author: "Ayush Prakash",
    cover: placeholderImg,
    subtitle: "Forthcoming. No additional details yet.",
    description: "",
    link: "#",
    metadata: [
      { label: "Publisher", value: "CIF / Mantic Publishing" },
      { label: "Release Date", value: "TBD" },
      { label: "Format", value: "TBD" },
      { label: "ISBN", value: "TBD" },
    ],
  },
];

export function Books() {
  const [activeBookId, setActiveBookId] = useState(books[0].id);
  const activeBook = books.find((b) => b.id === activeBookId) || books[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeBookId]);

  return (
    <div className="w-full bg-white pt-[68px] pb-0 min-h-screen">
      <ScrollReveal className="max-w-[1400px] mx-auto flex flex-col md:flex-row min-h-[calc(100vh-68px)]">
        <div className="w-full md:w-[75%] flex flex-col lg:flex-row">
          <div className="w-full lg:w-[45%] flex flex-col items-center justify-start pt-16 lg:pt-32 px-6">
            <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center mb-8">
              <div className="absolute w-[100%] h-[100%] bg-[#F5F5F5] rounded-full -z-10"></div>
              <img
                src={activeBook.cover}
                alt={activeBook.title}
                className="w-[65%] z-10 shadow-[0_15px_40px_rgba(0,0,0,0.2)]"
              />
            </div>
            {activeBook.link !== "#" && (
              <a
                href={activeBook.link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[10px] font-bold uppercase tracking-[0.15em] text-[#84817A] hover:text-ink transition-colors"
              >
                Click for Preview
              </a>
            )}
          </div>

          <div className="w-full lg:w-[55%] flex flex-col pt-12 lg:pt-32 px-6 lg:pr-16 lg:pl-0 pb-24">
            <h1 className="font-serif font-medium text-[42px] md:text-[48px] text-ink leading-[1.15] mb-2 text-balance">
              {activeBook.title}
            </h1>
            {activeBook.bookSubtitle && (
              <h2 className="font-serif text-[16px] text-[#666666] font-normal mb-4 text-balance">
                {activeBook.bookSubtitle}
              </h2>
            )}
            <div className="font-sans text-[11px] font-bold uppercase tracking-[0.15em] text-[#84817A] mb-10">
              by <span className="text-ink">{activeBook.author}</span>
            </div>

            {activeBook.subtitle && (
              <p className="font-serif text-[20px] text-[#46443D] leading-[1.5] mb-8 text-balance">
                {activeBook.subtitle}
              </p>
            )}

            {activeBook.description && (
              <div className="font-serif text-[16px] text-ink leading-[1.7] mb-12 text-justify space-y-4">
                {activeBook.description.split("\n\n").map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            )}

            <div className="w-full h-px bg-[#E5E5E5] mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-6">
              {activeBook.metadata.map((meta, idx) => (
                <div key={idx} className="flex gap-4">
                  <span className="font-sans font-bold text-[11px] text-ink w-24 shrink-0 uppercase tracking-widest">
                    {meta.label}
                  </span>
                  <span className="font-sans text-[13px] text-ink/70">
                    {meta.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-full h-px bg-[#E5E5E5] mb-12"></div>

            {activeBook.link !== "#" && (
              <div>
                <a
                  href={activeBook.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block font-sans text-[12px] font-bold text-ink uppercase tracking-[0.15em] border-b border-ink hover:text-[#84817A] hover:border-[#84817A] transition-colors pb-1"
                >
                  Purchase on Amazon
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-[25%] border-t md:border-t-0 md:border-l border-[#E5E5E5] flex flex-col">
          <div className="sticky top-[68px] flex flex-col w-full py-8">
            {books.map((book) => (
              <button
                key={book.id}
                onClick={() => setActiveBookId(book.id)}
                className={`flex flex-col items-center justify-center py-10 px-6 border-l-[3px] transition-colors ${activeBookId === book.id ? "border-ink bg-[#F9F9F9]" : "border-transparent hover:bg-[#F9F9F9]"}`}
              >
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-[60px] shadow-[0_5px_15px_rgba(0,0,0,0.15)] mb-6"
                />
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.1em] text-ink text-center leading-[1.4] text-balance">
                  {book.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
