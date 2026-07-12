const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(appPath, 'utf8');

const startTag = '{/* Left-aligned and responsively expanding brands header */}';
const endTag = '{/* 4b. INTERACTIVE ESSAYS READER DRAW DOWN */}';

const startIndex = content.indexOf(startTag);
const endIndex = content.indexOf(endTag);

if (startIndex !== -1 && endIndex !== -1) {
  const newSection = `{/* Section Heading */}
        <div className="text-center w-full pb-10">
          <h2 className="text-[28px] md:text-[40px] font-display text-ink font-bold leading-tight tracking-tight">
            CIF Ventures
          </h2>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-8">
          
          {/* Card 1: AI Skepticism */}
          <div 
            onClick={() => window.open("https://aiskepticism.org", "_blank", "noopener,noreferrer")}
            className="group flex flex-col sm:flex-row overflow-hidden rounded-sm cursor-pointer hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-md"
          >
            {/* LEFT IMAGE */}
            <div 
              className="w-full sm:w-[40%] min-h-[200px] flex-shrink-0 bg-cover bg-center"
              style={{ backgroundImage: \`url(\${aiSkepticismBg})\` }}
            />
            {/* RIGHT CONTENT */}
            <div className="w-full sm:w-[60%] flex flex-col justify-center bg-[#FBFAF6] p-8 space-y-4">
              <h3 className="text-[22px] font-display font-bold text-ink leading-tight">AI Skepticism</h3>
              <p className="text-[16px] font-sans text-ink-70 leading-relaxed">
                A community for people who want to think carefully about what artificial intelligence and digital technology are actually doing to human life.
              </p>
              <div className="pt-2">
                <span className="text-[15px] font-sans font-semibold text-ink relative inline-flex items-center gap-1 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[1px] after:bg-ink after:scale-x-0 after:origin-left group-hover:after:scale-x-100 after:transition-transform after:duration-200">
                  Learn more 
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
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
            className="group flex flex-col sm:flex-row overflow-hidden rounded-sm cursor-pointer hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-md"
          >
            {/* LEFT IMAGE */}
            <div className="w-full sm:w-[40%] min-h-[200px] flex-shrink-0 bg-ink relative flex items-start p-6">
              <div className="text-paper text-sm font-mono border border-paper/30 px-2 py-1 rounded-sm opacity-80">2026</div>
            </div>
            {/* RIGHT CONTENT */}
            <div className="w-full sm:w-[60%] flex flex-col justify-center bg-[#FBFAF6] p-8 space-y-4">
              <h3 className="text-[22px] font-display font-bold text-ink leading-tight">CIF Press</h3>
              <p className="text-[16px] font-sans text-ink-70 leading-relaxed">
                An independent publisher for arguments too long for an essay and too witty for a textbook.
              </p>
              <div className="pt-2">
                <span className="text-[15px] font-sans font-semibold text-ink relative inline-flex items-center gap-1 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[1px] after:bg-ink after:scale-x-0 after:origin-left group-hover:after:scale-x-100 after:transition-transform after:duration-200">
                  Learn more 
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Ayush Prakash Podcast */}
          <div 
            onClick={() => window.open("https://www.youtube.com/@ayushprakashofficial", "_blank", "noopener,noreferrer")}
            className="group flex flex-col sm:flex-row overflow-hidden rounded-sm cursor-pointer hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-md"
          >
            {/* LEFT IMAGE */}
            <div 
              className="w-full sm:w-[40%] min-h-[200px] flex-shrink-0 bg-cover bg-center relative"
              style={{ backgroundImage: \`url(\${podcastBg})\` }}
            >
              <div className="absolute inset-0 bg-black/10" />
            </div>
            {/* RIGHT CONTENT */}
            <div className="w-full sm:w-[60%] flex flex-col justify-center bg-[#FBFAF6] p-8 space-y-4">
              <h3 className="text-[22px] font-display font-bold text-ink leading-tight">Ayush Prakash Podcast</h3>
              <p className="text-[16px] font-sans text-ink-70 leading-relaxed">
                Long-form interviews with leading scientists, visionaries, and CEOs on the past, present, and future of Humanity.
              </p>
              <div className="pt-2">
                <span className="text-[15px] font-sans font-semibold text-ink relative inline-flex items-center gap-1 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[1px] after:bg-ink after:scale-x-0 after:origin-left group-hover:after:scale-x-100 after:transition-transform after:duration-200">
                  Listen 
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

        </div>

        `;
  
  content = content.substring(0, startIndex) + newSection + content.substring(endIndex);
  fs.writeFileSync(appPath, content, 'utf8');
}
