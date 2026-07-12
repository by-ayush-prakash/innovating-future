import React, { useEffect, useState } from "react";
import { Play } from "lucide-react";

interface Episode {
  title: string;
  description: string;
  pubDate: string;
  episode: string;
  audio: string;
  image: string;
}

export function Podcast() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/episodes")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("Oops, we haven't got JSON!");
        }
        return res.json();
      })
      .then((data) => {
        if (data.episodes) {
          setEpisodes(data.episodes);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch episodes:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const trending = episodes.slice(0, 3);
  const allEpisodes = episodes.filter(
    (ep) =>
      ep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <main className="w-full flex-grow flex flex-col bg-white">
      <section className="w-full bg-white pt-[96px] md:pt-[120px] px-6 md:px-12 pb-16">
        <div className="max-w-[1100px] mx-auto flex flex-col">
          <div className="max-w-[800px] mx-auto flex flex-col space-y-6 items-center text-center mb-16">
            <h1 className="font-serif text-[40px] md:text-[48px] font-medium leading-tight text-ink text-balance">
              Conversations on the technologies reshaping how we think.
            </h1>
            <div className="flex flex-col space-y-4 font-sans text-[18px] text-[#46443D] leading-[1.6] max-w-[700px] mx-auto">
              <p className="text-balance">
                The Center for Innovating the Future (CIF) explores how emerging
                technologies shape human cognition, enterprise, and societal
                structure. The Ayush Prakash Podcast extends that mission
                through long-form, unscripted conversation, examining the
                structural implications of the tools we build rather than the
                hype around them.
              </p>
              <p className="text-balance">
                Hosted by CIF Director Ayush Prakash, the show features
                builders, researchers, and theorists working at the boundary of
                what's possible, from founders of frontier AI labs to cognitive
                scientists designing the next generation of computing paradigms.
              </p>
            </div>
          </div>
          <div className="mt-8 mx-auto font-mono text-[11px] leading-[1.7] text-[#84817A] max-w-[620px] text-center">
            Views expressed by guests on this podcast are their own and do not
            necessarily reflect the views of CIF. Conversations are presented
            for informational purposes and may be edited for length and clarity.
          </div>
        </div>
      </section>

      <section className="pt-[60px] px-[40px] pb-[70px] max-w-[1100px] mx-auto border-t border-[#D8D5CD] text-center">
        <div className="font-serif font-medium text-[44px] tracking-[-0.02em] text-[#14130F] mb-[28px]">
          AYUSH PRAKASH PODCAST
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <span className="font-mono text-[12px] text-[#84817A] uppercase tracking-widest">
            Follow the show on:
          </span>
          <div className="flex flex-wrap justify-center gap-3">
            <button className="px-6 py-2.5 border border-[#D8D5CD] rounded-full font-sans text-[14px] text-ink hover:bg-[#F9F9F9] transition-colors">
              Apple Podcasts
            </button>
            <a
              href="https://open.spotify.com/show/1ILhje5HSua1FEOlTyFAhG"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 border border-[#D8D5CD] rounded-full font-sans text-[14px] text-ink hover:bg-[#F9F9F9] transition-colors"
            >
              Spotify
            </a>
            <a
              href="https://www.youtube.com/@ayushprakashofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 border border-[#D8D5CD] rounded-full font-sans text-[14px] text-ink hover:bg-[#F9F9F9] transition-colors"
            >
              YouTube
            </a>
          </div>
        </div>
      </section>

      <section className="w-full max-w-[1100px] mx-auto px-6 md:px-12 pt-[48px] pb-[96px]">
        <div className="flex flex-col mb-12">
          <h2 className="font-serif text-[36px] text-ink leading-tight text-balance">
            Now Trending
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-[#D8D5CD] flex flex-col">
                <div className="w-full aspect-square bg-[#F9F9F9]" />
                <div className="p-6 flex flex-col space-y-4">
                  <div className="h-4 bg-[#F9F9F9] w-1/2" />
                  <div className="h-6 bg-[#F9F9F9] w-3/4" />
                  <div className="h-6 bg-[#F9F9F9] w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : trending.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trending.map((ep, idx) => (
              <div
                key={idx}
                className="border border-[#D8D5CD] flex flex-col group hover:border-ink transition-colors cursor-pointer rounded-sm overflow-hidden"
              >
                {ep.image && (
                  <div className="w-full aspect-square overflow-hidden border-b border-[#D8D5CD]">
                    <img
                      src={ep.image}
                      alt={ep.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-grow">
                  <span className="font-mono text-[11px] text-[#84817A] mb-3">
                    AYUSH PRAKASH PODCAST
                  </span>
                  <h3 className="font-sans font-bold text-[18px] text-ink leading-snug mb-8 flex-grow line-clamp-3 text-balance">
                    {ep.title}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setPlayingId(ep.audio);
                    }}
                    className="flex items-center gap-2 font-mono text-[12px] text-ink uppercase tracking-wider font-semibold"
                  >
                    <span className="w-6 h-6 rounded-full bg-ink flex items-center justify-center text-white">
                      <Play size={12} fill="currentColor" className="ml-0.5" />
                    </span>
                    LISTEN NOW
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 border border-[#D8D5CD] text-center rounded-sm">
            <p className="font-sans text-[16px] text-[#84817A]">
              No trending episodes available at this time.
            </p>
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <a
            href="#all-episodes"
            className="px-8 py-3.5 border border-[#D8D5CD] rounded-full font-sans font-semibold text-ink hover:bg-[#F9F9F9] transition-colors"
          >
            All Episodes
          </a>
        </div>
      </section>

      <section
        id="all-episodes"
        className="w-full max-w-[1100px] mx-auto px-6 md:px-12 pb-[96px]"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#D8D5CD] pb-6 mb-0">
          <h2 className="font-serif text-[36px] text-ink leading-tight mb-6 sm:mb-0 text-balance">
            All Episodes
          </h2>
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search episodes..."
              className="w-full sm:w-[280px] px-5 py-2.5 border border-[#D8D5CD] rounded-full font-sans text-[14px] text-ink placeholder-[#84817A] focus:outline-none focus:border-ink transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col">
          {loading ? (
            <div className="py-8 animate-pulse flex flex-col space-y-4">
              <div className="h-24 bg-[#F9F9F9] w-full" />
              <div className="h-24 bg-[#F9F9F9] w-full" />
            </div>
          ) : (
            allEpisodes.map((ep, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row gap-6 py-8 border-b border-[#D8D5CD] group"
              >
                {ep.image && (
                  <div className="w-[96px] h-[96px] flex-shrink-0 border border-[#D8D5CD] overflow-hidden rounded-sm">
                    <img
                      src={ep.image}
                      alt={ep.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-col flex-grow justify-center">
                  <h3 className="font-sans font-bold text-[20px] text-ink leading-tight mb-2 group-hover:text-[#46443D] transition-colors text-balance">
                    {ep.title}
                  </h3>
                  <p className="font-sans text-[15px] text-[#46443D] line-clamp-2 mb-4 leading-relaxed max-w-[800px]">
                    {ep.description}
                  </p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setPlayingId(ep.audio);
                    }}
                    className="flex items-center gap-2 font-mono text-[12px] text-ink uppercase tracking-wider font-semibold"
                  >
                    <span className="w-6 h-6 rounded-full bg-ink flex items-center justify-center text-white">
                      <Play size={12} fill="currentColor" className="ml-0.5" />
                    </span>
                    LISTEN NOW
                  </button>
                </div>
              </div>
            ))
          )}
          {!loading && allEpisodes.length === 0 && (
            <div className="py-12 text-center">
              <p className="font-sans text-[16px] text-[#84817A]">
                No episodes found matching your search.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="w-full bg-[#DCE8F0] py-[96px] px-6 md:px-12 text-center flex flex-col items-center">
        <h2 className="font-serif text-[40px] text-ink mb-8 leading-tight text-balance">
          New episodes, every week.
        </h2>
        <a
          href="https://www.youtube.com/@ayushprakashofficial"
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 bg-ink text-white rounded-full font-sans font-semibold tracking-wide hover:bg-[#33312B] transition-colors"
        >
          Subscribe on YouTube
        </a>
      </section>
      {playingId && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#14130F] py-4 px-6 z-50 flex items-center gap-4">
          <audio controls autoPlay src={playingId} className="flex-1" />
          <button
            onClick={() => setPlayingId(null)}
            className="text-[#FFFFFF] font-mono text-[12px]"
          >
            CLOSE
          </button>
        </div>
      )}
    </main>
  );
}
