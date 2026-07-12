import React from "react";
import { ScrollReveal } from "./components/ScrollReveal";

interface PressItem {
  publication: string;
  headline: string;
  attribution: string;
  date: string;
  url: string;
  logo: string | null;
}

const pressItems: PressItem[] = [
  {
    publication: "The Montreal Review",
    headline: "The Infinity of the Brain and the Void of the Machine",
    attribution: "AYUSH PRAKASH & KARL FRISTON",
    date: "July 2026",
    url: "https://www.themontrealreview.com/Articles/the_infinity_of_the_brain_and_the_void_of_the_machine.php",
    logo: null,
  },
  {
    publication: "Psychology Today",
    headline: "The Risks of AI and Social Media for the Developing Brain",
    attribution: "DR. RAN ANBAR & AYUSH PRAKASH",
    date: "November 2025",
    url: "https://www.psychologytoday.com/ca/blog/understanding-hypnosis/202511/the-risks-of-ai-and-social-media-for-the-developing-brain",
    logo: null,
  },
];

export function News() {
  return (
    <main className="w-full flex-grow flex flex-col bg-white">
      <section className="w-full bg-white pt-[64px] md:pt-[96px] px-6 md:px-12 pb-16">
        <div className="max-w-[1100px] mx-auto flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pressItems.map((item, index) => {
              const isForthcoming = item.url === "#" || item.url === "";
              const CardWrapper = isForthcoming ? "div" : "a";
              const cardProps = isForthcoming
                ? {}
                : {
                    href: item.url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                  };

              return (
                <div key={index} className="h-full">
                  <ScrollReveal className="h-full">
                    <CardWrapper
                      {...(cardProps as any)}
                      className={`flex flex-col h-full bg-white border border-[#e0e0e0] group relative overflow-hidden ${isForthcoming ? "opacity-70" : "transition-colors"}`}
                    >
                      <div className="w-full py-[120px] flex items-center justify-center px-6">
                        {item.logo ? (
                          <img
                            src={item.logo}
                            alt={item.publication}
                            className="w-[200px] object-contain"
                          />
                        ) : (
                          <span
                            className={`text-[28px] text-center px-4 leading-tight text-ink ${item.publication === "Psychology Today" ? "font-sans font-bold tracking-tight" : "font-serif"} text-balance`}
                          >
                            {item.publication}
                          </span>
                        )}
                      </div>

                      <div className="w-full h-px bg-[#e0e0e0]"></div>

                      <div className="p-6 flex flex-col flex-grow relative">
                        <span className="font-sans text-[12px] uppercase tracking-[0.1em] text-[#999999] mb-3 block">
                          {item.date}
                        </span>
                        <h3 className="font-serif text-[18px] text-ink leading-[1.4] mb-4">
                          {item.headline}
                        </h3>
                        <div className="mt-auto">
                          <span className="font-sans text-[12px] uppercase tracking-[0.1em] text-[#46443D]">
                            {item.attribution}
                          </span>
                        </div>
                      </div>

                      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-ink opacity-90 group-hover:opacity-100 transition-opacity"></div>
                    </CardWrapper>
                  </ScrollReveal>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
