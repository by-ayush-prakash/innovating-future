import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

// Types
import { Essay, BookImprint } from "./types";

// Components
import { HoldingPatternSection } from "./components/HoldingPatternSection";
import { PeopleSection } from "./components/PeopleSection";
import { CorrespondenceSection } from "./components/CorrespondenceSection";
import { CredoSection } from "./components/CredoSection";

import aiSkepticismBg from "./assets/images/image-1.jpg";
import podcastBg from "./assets/images/image-4.webp";

// ==========================================
// STATIC CONST BRAND DATA
// ==========================================

const SAMPLE_ESSAYS: Essay[] = [
  {
    id: "compute-sovereignty",
    title: "The Sovereign Compute Gap",
    date: "April 2026",
    category: "Essays & Journals",
    readTime: "9 min read",
    summary: "Why hosting specialized neural architectures on local hardware is the only viable guard of intellectual freedom.",
    content: [
      "In the immediate aftermath of the initial machine learning surge, society has consolidated around convenient corporate APIs. These API gateways act as high-efficiency delivery tubes, but their core weights are fundamentally custodial. They can be censored, metrics can be throttled, and pricing structures are locked within capital jurisdictions.",
      "True technical excellence does not rely on fragile external routing. It mandates physical custody: compiling micro-models to run on specific high-performance silicon stacks directly within defensive zones. We present a blueprint for specialized, localized compute containers.",
      "The next era will reward those who took the longer view. Relying on megawatt server centers across high-latency borders is a structural liability. The container company model holds equity in property structures that operate offline-first."
    ]
  },
  {
    id: "anti-hype",
    title: "Skepticism as a Product Standard",
    date: "November 2025",
    category: "Field Notes",
    readTime: "6 min read",
    summary: "Reclaiming technology from speculative marketing pipelines to restore long-view engineering discipline.",
    content: [
      "Hype cycle valuations serve secondary financiers; they seldom represent durable progress. Over-advertising generative capabilities has resulted in massive structural debt. True technical breakthroughs emerge through hard, skeptical inquiry rather than promotional vanity.",
      "CIF mandates a simple metric for all partners: can the underlying technology survive without the injection of temporary speculative capital? When the answer is no, we re-architect. We look for hardware and software systems structured around sixty-year cycles rather than sixty-day exit loops."
    ]
  }
];

const CITIES_LIST = [
  { name: "Toronto", timezone: "America/Toronto" },
  { name: "Montréal", timezone: "America/Montreal" },
  { name: "New York", timezone: "America/New_York" },
  { name: "Washington", timezone: "America/New_York" },
  { name: "Miami", timezone: "America/New_York" },
  { name: "Budapest", timezone: "Europe/Budapest" },
  { name: "Paris", timezone: "Europe/Paris" },
  { name: "London", timezone: "Europe/London" },
  { name: "Moscow", timezone: "Europe/Moscow" },
  { name: "Mumbai", timezone: "Asia/Kolkata" },
  { name: "Beijing", timezone: "Asia/Shanghai" },
  { name: "Shanghai", timezone: "Asia/Shanghai" },
  { name: "Singapore", timezone: "Asia/Singapore" }
];

const BOOK_IMPRINTS: BookImprint[] = [
  {
    id: "vol-1",
    volume: "VOL. I",
    title: "The Transcendence of Money",
    year: "Forthcoming Winter 2026",
    subtitle: "In Work",
    shortIntro: <>Money has fundamentally changed Humanity. The way we wield money in all its forms (gold, fiat, cryptocurrency) produces different civilizations with different preferences and longevities.</>,
    chapters: [
      "I. The Custodial Fallacy",
      "II. Protocol-Level Settlement Networks",
      "III. Jurisdictional Ingress and Containment Protocols",
      "IV. The Post-Reserve Reality"
    ],
    excerptHeader: "From Chapter I: The Custodial Fallacy",
    excerptText: <><i>The Transcendence of Money</i> is an exploration of how Humans have wielded money, how it has changed us, and how we might transcend this complex entirely.</>
  },
  {
    id: "vol-2",
    volume: "VOL. II",
    title: "Cybersocial",
    year: "In Work",
    subtitle: "How The Internet Evolved Humanity",
    shortIntro: "How The Internet Evolved Humanity.",
    chapters: [
      "I. The Death of the Global Search Engine",
      "II. Localized Model Curators and Truth Indexes",
      "III. Physical Guild Clusters",
      "IV. Preserving Personal Memory in Silicon"
    ],
    excerptHeader: "From Chapter II: Localized Model Curators",
    excerptText: "When humans look back on this century, they will ask one main question: how did the Internet evolve Humanity? That’s what this book seeks to answer. The intricacy, depth, and vastness of this answer is quite astonishing. Every nook and cranny of the human brain, mind, and soul has been ravaged, touch, even molested, by the Internet. In an utterly brutal sentence, the Internet has raped Humanity."
  }
];



export default function App() {

  // Synchronized ticker clock state for nodes list
  const [tickerTime, setTickerTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCityTime = (time: Date, timeZone: string) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(time);
    } catch (e) {
      return time.toLocaleTimeString();
    }
  };

  // State managers
  const [isLogoHovered, setIsLogoHovered ] = useState(false);
  const [isFooterHovered, setIsFooterHovered] = useState(false);
  const [isCifHovered, setIsCifHovered] = useState(false);
  const [showCredo, setShowCredo] = useState(false);
  
  // Interactive Property Reader states
  const [selectedEssay, setSelectedEssay] = useState<Essay | null>(null);
  
  // Custom Book Imprint interactive states
  const [selectedBook, setSelectedBook] = useState<BookImprint | null>(null);

  return (
    <div className="min-h-screen bg-[#F4F3F1] text-[#2D2D2D] flex flex-col font-sans selection:bg-[#3171C6] selection:text-[#F4F3F1] antialiased">
      
      {/* 1. Header/Navigation Brand Bar */}
      <nav className="bg-[#F4F3F1]/75 backdrop-blur-md sticky top-0 z-50 py-5 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center">
            <span 
              className="text-base font-mono tracking-[0.25em] text-[#2D2D2D] font-medium flex items-center cursor-pointer select-none"
              onMouseEnter={() => setIsLogoHovered(true)}
              onMouseLeave={() => setIsLogoHovered(false)}
            >
              <span>C</span>
              <span 
                className={`transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap inline-block ${
                  isLogoHovered ? "max-w-[300px] opacity-100" : "max-w-0 opacity-0"
                }`}
              >
                entre for&nbsp;
              </span>
              <span>I</span>
              <span 
                className={`transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap inline-block ${
                  isLogoHovered ? "max-w-[400px] opacity-100" : "max-w-0 opacity-0"
                }`}
              >
                nnovating the&nbsp;
              </span>
              <span>F</span>
              <span 
                className={`transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap inline-block ${
                  isLogoHovered ? "max-w-[200px] opacity-100" : "max-w-0 opacity-0"
                }`}
              >
                uture
              </span>
            </span>
          </div>

          {/* Navigation Links Desk */}
          <div className="flex items-center font-mono text-base uppercase font-medium tracking-[0.25em] text-[#2D2D2D]/70 select-none gap-6 md:gap-8">
            <button 
              onClick={() => setShowCredo(true)} 
              className="hover:text-[#3171C6] transition duration-150 cursor-pointer uppercase text-base font-mono font-medium tracking-[0.25em]"
            >
              Credo
            </button>
            <a href="#correspondence" className="hover:text-[#3171C6] transition duration-150">Contact</a>
          </div>
        </div>
      </nav>

      {/* 2. Redesigned Hero Section (Minimalist Unilateral Layout) */}
      <header className="max-w-7xl mx-auto w-full px-6 md:px-12 py-20 lg:py-28 flex flex-col items-start justify-center">
        <div className="space-y-6 sm:space-y-8 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif text-[#2D2D2D] font-light tracking-tight leading-tight text-balance">
            Ventures at the frontier of <span className="font-medium text-[#3171C6]">Technology</span> and <span className="font-medium text-[#3171C6]">Society</span>
          </h1>
          <p className="text-lg md:text-xl text-[#2D2D2D]/90 font-sans font-light tracking-wide max-w-3xl leading-relaxed text-pretty">
             <span className="font-medium text-[#2D2D2D]">Centre for Innovating the Future</span> is an intellectual enterprise based in Toronto. We build ventures, publish books, host long-form interviews, and work with organizations whose work leaves people more capable, more connected, and more sovereign.
          </p>
        </div>
      </header>

      {/* 2b. Infinite Scrolling Geopolitical Node Cities Ticker */}
      <section className="w-full border-t border-b border-[#2D2D2D]/20 bg-[#F4F3F1] py-5 select-none overflow-hidden relative flex">
        <div className="animate-marquee-infinite flex justify-around items-center">
          {[...CITIES_LIST, ...CITIES_LIST, ...CITIES_LIST, ...CITIES_LIST].map((city, idx) => (
            <div key={idx} className="flex items-center gap-5 shrink-0 px-8">
              <span className="font-serif text-lg text-[#2D2D2D]/80 font-light tracking-wide">
                {city.name}
              </span>
              <span className="font-mono text-xs border border-[#3171C6]/50 px-2.5 py-0.5 rounded-sm shadow-sm flex items-center gap-2 text-[#2D2D2D]/70 bg-[#F4F3F1]">
                <span className="text-[#2D2D2D] font-semibold">{formatCityTime(tickerTime, city.timezone)}</span>
              </span>
              <span className="text-[#2D2D2D]/30 select-none pl-4">•</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Section II: ACTIVE PILLARS */}
      <section id="properties" className="max-w-7xl mx-auto w-full px-6 md:px-12 pt-20 pb-10 space-y-6">
        
        {/* Left-aligned and responsively expanding brands header */}
        <div className="text-left w-full pb-4">
          <h2 className="text-3xl sm:text-4xl font-serif text-[#2D2D2D] font-light leading-tight tracking-tight">
            <span>Powered By </span>
            <span 
              className="text-[#2D2D2D] font-medium inline-block relative cursor-pointer select-none"
              onMouseEnter={() => setIsCifHovered(true)}
              onMouseLeave={() => setIsCifHovered(false)}
              onClick={() => setIsCifHovered(!isCifHovered)}
            >
              {/* Desktop view: expands inline elegantly without layout jitter or spring bounce, matching nav logotype */}
              <span className="hidden md:inline-flex items-center">
                <span>C</span>
                <span 
                  className={`transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap inline-block ${
                    isCifHovered ? "max-w-[400px] opacity-100" : "max-w-0 opacity-0"
                  }`}
                  style={{ textTransform: "none" }}
                >
                  entre for&nbsp;
                </span>
                <span>I</span>
                <span 
                  className={`transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap inline-block ${
                    isCifHovered ? "max-w-[500px] opacity-100" : "max-w-0 opacity-0"
                  }`}
                  style={{ textTransform: "none" }}
                >
                  nnovating the&nbsp;
                </span>
                <span>F</span>
                <span 
                  className={`transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap inline-block ${
                    isCifHovered ? "max-w-[200px] opacity-100" : "max-w-0 opacity-0"
                  }`}
                  style={{ textTransform: "none" }}
                >
                  uture
                </span>
              </span>
              {/* Mobile view: static header text to avoid line-wrapping and layout breaking */}
              <span className="md:hidden inline-block">
                CIF
              </span>
            </span>
          </h2>

          {/* Mobile view: subtitle reveal under header */}
          <div className="md:hidden overflow-hidden">
            <AnimatePresence>
              {isCifHovered && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="text-base font-mono uppercase tracking-[0.2em] text-[#2D2D2D]/70 font-medium"
                >
                  Centre for Innovating the Future
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Restructured properties into pristine, high-impact side-by-side split cards with interactive infographic previews */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-0">
          
          {/* Card 1: AI Skepticism */}
          <div 
            onClick={() => {
              window.open("https://aiskepticism.org", "_blank", "noopener,noreferrer");
            }}
            className="group relative cursor-pointer overflow-hidden rounded-sm min-h-[400px] md:min-h-[500px] bg-zinc-800 flex flex-col"
          >
            {/* Background Image Placeholder */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out group-hover:scale-105"
              style={{ backgroundImage: `url(${aiSkepticismBg})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 z-0" />
            
            {/* Hover Blur Overlay */}
            <div className="absolute inset-0 backdrop-blur-md bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

            {/* Hover Content */}
            <div className="absolute inset-0 z-20 flex flex-col justify-start p-8 md:p-10 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out py-8 pb-[180px] md:pb-[200px]">
              <p className="text-2xl sm:text-3xl md:text-3xl font-sans font-medium text-white leading-snug tracking-tight mb-auto">
                A community for people who want to think carefully about what artificial intelligence and digital technology are actually doing to human life.
              </p>
            </div>

            {/* Persistent Bottom Content */}
            <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col justify-end p-8 md:p-10 pointer-events-none">
              <div className="flex flex-col text-white w-full transform transition-transform duration-500 ease-in-out translate-y-4 group-hover:translate-y-0">
                {/* Header row with brand and year */}
                <div className="flex justify-end items-baseline mb-3">
                  <span className="text-lg font-sans font-medium tracking-wide">2026</span>
                </div>
                
                {/* Separator line */}
                <div className="w-full h-[1px] bg-white/40 group-hover:bg-white/80 transition-colors duration-500 mb-4" />
                
                {/* Title */}
                <h3 className="text-4xl sm:text-5xl md:text-6xl font-sans font-medium tracking-tight">AI Skepticism</h3>
              </div>
            </div>
          </div>

          {/* Card 2: CIF Press */}
          <div 
            onClick={() => {
              setSelectedBook(BOOK_IMPRINTS[0]);
              setTimeout(() => {
                document.getElementById("cif-editions-drawer")?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className="group relative cursor-pointer overflow-hidden rounded-sm min-h-[400px] md:min-h-[500px] bg-zinc-800 flex flex-col"
          >
            {/* Background Image Placeholder */}
            <div className="absolute inset-0 bg-[#2D2D2D]/80 transition-transform duration-700 ease-in-out group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 z-0" />
            
            {/* Hover Blur Overlay */}
            <div className="absolute inset-0 backdrop-blur-md bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

            {/* Hover Content */}
            <div className="absolute inset-0 z-20 flex flex-col justify-start p-8 md:p-10 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out py-8 pb-[180px] md:pb-[200px]">
              <p className="text-2xl sm:text-3xl md:text-3xl font-sans font-medium text-white leading-snug tracking-tight mb-auto">
                An independent publisher for arguments too long for an essay and too witty for a textbook. Two volumes forthcoming: <span className="italic">The Transcendence of Money</span> and <span className="italic">Cybersocial</span>.
              </p>
            </div>

            {/* Persistent Bottom Content */}
            <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col justify-end p-8 md:p-10 pointer-events-none">
              <div className="flex flex-col text-white w-full transform transition-transform duration-500 ease-in-out translate-y-4 group-hover:translate-y-0">
                {/* Header row with brand and year */}
                <div className="flex justify-end items-baseline mb-3">
                  <span className="text-lg font-sans font-medium tracking-wide">2026</span>
                </div>
                
                {/* Separator line */}
                <div className="w-full h-[1px] bg-white/40 group-hover:bg-white/80 transition-colors duration-500 mb-4" />
                
                {/* Title */}
                <h3 className="text-4xl sm:text-5xl md:text-6xl font-sans font-medium tracking-tight">CIF Press</h3>
              </div>
            </div>
          </div>

          {/* Card 3: Ayush Prakash Podcast */}
          <div 
            className="group relative overflow-hidden rounded-sm bg-[#2D2D2D] flex flex-col"
          >
            {/* Background Image */}
            <img 
              src={podcastBg}
              alt="Ayush Prakash Podcast Cover"
              referrerPolicy="no-referrer"
              className="w-full h-auto block transition-transform duration-700 ease-in-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 z-0" />
            
            {/* Hover Blur Overlay */}
            <div className="absolute inset-0 backdrop-blur-md bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

            {/* Hover Content */}
            <div className="absolute inset-0 z-20 flex flex-col justify-start p-8 md:p-10 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out py-8 pb-[180px] md:pb-[200px]">
              <p className="text-2xl sm:text-3xl md:text-3xl font-sans font-medium text-white leading-snug tracking-tight mb-auto">
                Long-form interviews with leading scientists, visionaries, and CEOs on the past, present, and future of Humanity.
              </p>
              
              <div className="flex flex-wrap gap-4 mt-6">
                <a 
                  href="https://www.youtube.com/@ayushprakashofficial" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 border border-white/40 text-white hover:bg-white hover:text-black transition-colors pointer-events-auto rounded-sm text-sm font-medium tracking-wide uppercase"
                >
                  YouTube
                </a>
                <a 
                  href="https://open.spotify.com/show/1ILhje5HSua1FEOlTyFAhG" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 border border-white/40 text-white hover:bg-white hover:text-black transition-colors pointer-events-auto rounded-sm text-sm font-medium tracking-wide uppercase"
                >
                  Spotify
                </a>
              </div>
            </div>

            {/* Persistent Bottom Content */}
            <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col justify-end p-8 md:p-10 pointer-events-none">
              <div className="flex flex-col text-white w-full transform transition-transform duration-500 ease-in-out translate-y-4 group-hover:translate-y-0">
                {/* Header row with brand and year */}
                <div className="flex justify-end items-baseline mb-3">
                  <span className="text-lg font-sans font-medium tracking-wide">2021</span>
                </div>
                
                {/* Separator line */}
                <div className="w-full h-[1px] bg-white/40 group-hover:bg-white/80 transition-colors duration-500 mb-4" />
                
                {/* Title */}
                <h3 className="text-4xl sm:text-5xl md:text-6xl font-sans font-medium tracking-tight">Ayush Prakash Podcast</h3>
              </div>
            </div>
          </div>
        </div>

        {/* 4b. INTERACTIVE ESSAYS READER DRAW DOWN */}
        <AnimatePresence>
          {selectedEssay && (
            <motion.div
              id="ai-skepticism-drawer"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[#F4F3F1] border border-[#3171C6]/30 p-6 md:p-8 space-y-6 cream-card-glow overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3171C6]/20 pb-4">
                <div>
                  <span className="text-base font-medium font-mono tracking-widest text-[#2D2D2D]/70 uppercase">{selectedEssay.category} • {selectedEssay.readTime}</span>
                  <h3 className="text-2xl font-serif italic text-[#2D2D2D] font-light mt-1">{selectedEssay.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedEssay(null)}
                  className="px-3 py-1.5 border border-[#3171C6]/35 hover:border-[#2D2D2D] font-mono text-base font-medium text-[#2D2D2D]/80 hover:text-[#2D2D2D] hover:bg-[#3171C6]/10 transition uppercase cursor-pointer"
                >
                  CLOSE ESSAY
                </button>
              </div>

              {/* Sub-toggle index header */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
                <div className="lg:col-span-3 space-y-4">
                  <span className="text-base font-medium font-mono tracking-widest text-[#2D2D2D]/70 uppercase block">Essays Directory:</span>
                  <div className="flex flex-col gap-2">
                    {SAMPLE_ESSAYS.map(es => (
                      <button
                        key={es.id}
                        onClick={() => setSelectedEssay(es)}
                        className={`text-left p-3 border text-base font-medium cursor-pointer transition ${
                          selectedEssay.id === es.id 
                            ? "border-[#2D2D2D] bg-[#2D2D2D] text-[#F4F3F1] font-medium" 
                            : "border-[#3171C6]/25 hover:border-[#3171C6] text-[#2D2D2D]/80 hover:text-[#3171C6] bg-[#F4F3F1] hover:bg-[#3171C6]/10"
                        }`}
                      >
                        <span className="text-base font-medium font-mono block text-[#2D2D2D]/70">{es.date}</span>
                        <span>{es.title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-9 space-y-5 leading-relaxed text-base font-medium text-[#2D2D2D] font-serif max-w-3xl pr-4">
                  <div className="italic text-[#2D2D2D]/80 border-l border-[#3171C6] pl-4 py-1 mb-4 text-base font-medium font-sans">
                    Synopsis: {selectedEssay.summary}
                  </div>
                  {selectedEssay.content.map((para, pIdx) => (
                    <p key={pIdx} className="leading-relaxed font-medium">{para}</p>
                  ))}
                  <div className="text-base font-medium font-mono text-[#3171C6]/85 pt-6 border-t border-[#3171C6]/15 mt-6 flex justify-between">
                    <span>ESTABLISHED TORONTO</span>
                    <span>CO-SOCIETY INDEX: PRIVATE</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4c. INTERACTIVE BOOK COVER PREVIEWS */}
        <AnimatePresence>
          {selectedBook && (
            <motion.div
              id="cif-editions-drawer"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="bg-[#F4F3F1] border border-[#3171C6]/30 p-6 md:p-8 space-y-6 cream-card-glow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#3171C6]/20 pb-4">
                <div className="flex gap-6 sm:gap-8 overflow-x-auto whitespace-nowrap">
                  {BOOK_IMPRINTS.map(bk => (
                    <button
                      key={bk.id}
                      onClick={() => setSelectedBook(bk)}
                      className={`text-lg transition cursor-pointer font-sans tracking-wide pb-1 border-b-2 ${
                        selectedBook.id === bk.id 
                          ? "border-[#2D2D2D] text-[#2D2D2D] font-medium" 
                          : "border-transparent text-[#2D2D2D]/50 hover:text-[#2D2D2D]/80"
                      }`}
                    >
                      {bk.title}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setSelectedBook(null);
                  }}
                  className="px-3 py-1.5 border border-[#3171C6]/35 hover:border-[#2D2D2D] font-mono text-base font-medium text-[#2D2D2D]/80 hover:text-[#2D2D2D] hover:bg-[#F4F3F1] transition uppercase cursor-pointer whitespace-nowrap"
                >
                  CLOSE PREVIEW
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 3D-angled virtual book cover mockups as promised */}
                <div className="lg:col-span-4 flex flex-col items-center justify-center bg-[#3171C6]/5 border border-[#3171C6]/20 p-6 space-y-4">
                  <div className="w-56 h-80 bg-[#2D2D2D] border border-[#2D2D2D] relative p-6 flex flex-col items-center justify-center select-none shadow-xl animate-fade-in text-center">
                    {/* Spine texture simulation */}
                    <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-[#2D2D2D] border-r border-[#3171C6]/15" />
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#F4F3F1]/5" />
                    
                    <h4 className="text-2xl font-serif text-[#F4F3F1] tracking-wide ml-2 leading-snug font-light">
                      {selectedBook.title}
                    </h4>
                  </div>
                </div>

                {/* Description and Summary */}
                <div className="lg:col-span-8 flex flex-col justify-start space-y-6 pt-2">
                  <h4 className="text-2xl font-sans tracking-tight text-[#2D2D2D] font-medium uppercase">Description</h4>
                  <p className="text-lg text-[#2D2D2D]/80 font-sans leading-relaxed">
                    {selectedBook.shortIntro}
                  </p>
                  <p className="text-lg text-[#2D2D2D]/80 font-sans leading-relaxed">
                    {selectedBook.excerptText}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </section>

      {/* 5. Section III: MEMBERS */}
      <PeopleSection />

      {/* 6. Section I: THE CONTAINER & CORE OFFERINGS */}
      <HoldingPatternSection />

      {/* 7. Section IV: CORRESPONDENCE Memo Portal */}
      <CorrespondenceSection />

      {/* 8. Elegant Footer section */}
      <footer className="bg-[#F4F3F1] py-12 px-6 md:px-12 mt-auto text-base font-mono font-medium text-[#2D2D2D]/80 border-t border-[#2D2D2D]/15">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div 
            className="flex items-center cursor-pointer select-none"
            onMouseEnter={() => setIsFooterHovered(true)}
            onMouseLeave={() => setIsFooterHovered(false)}
          >
            <span className="font-serif text-[#2D2D2D] italic text-base font-medium flex items-center">
              <span>C</span>
              <span 
                className={`font-sans text-[#2D2D2D] text-base tracking-wide font-medium transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap inline-block ${
                  isFooterHovered ? "max-w-[300px] opacity-100 mx-1" : "max-w-0 opacity-0"
                }`}
              >
                entre for&nbsp;
              </span>
              <span>I</span>
              <span 
                className={`font-sans text-[#2D2D2D] text-base tracking-wide font-medium transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap inline-block ${
                  isFooterHovered ? "max-w-[400px] opacity-100 mx-1" : "max-w-0 opacity-0"
                }`}
              >
                nnovating the&nbsp;
              </span>
              <span>F</span>
              <span 
                className={`font-sans text-[#2D2D2D] text-base tracking-wide font-medium transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap inline-block ${
                  isFooterHovered ? "max-w-[200px] opacity-100 ml-1" : "max-w-0 opacity-0"
                }`}
              >
                uture
              </span>
            </span>
          </div>

          <div className="text-[#2D2D2D]/70 text-center tracking-normal md:text-left">
            <span>Toronto</span>
            <span className="mx-2 select-none text-[#3171C6]/60">•</span>
            <span>© 2026</span>
          </div>

          <div className="flex gap-6">
            <button 
              onClick={() => setShowCredo(true)} 
              className="hover:text-[#3171C6] transition uppercase font-medium font-mono text-base text-[#2D2D2D] cursor-pointer"
            >
              CREDO
            </button>
            <a href="#correspondence" className="hover:text-[#3171C6] transition uppercase font-medium text-[#2D2D2D]">CONTACT</a>
          </div>
        </div>
      </footer>

      {/* Dynamic Credo Manifest Screen Overlay */}
      <CredoSection isOpen={showCredo} onClose={() => setShowCredo(false)} />

    </div>
  );
}
