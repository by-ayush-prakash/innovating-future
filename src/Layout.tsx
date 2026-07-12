import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X, Linkedin } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Layout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = pathname === "/";

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col font-sans selection:bg-ink selection:text-paper antialiased">
      <nav
        className={`fixed w-full top-0 z-50 py-5 px-6 md:px-12 transition-colors duration-300 bg-paper/90 backdrop-blur-md ${isScrolled ? "border-b border-ink-15" : ""}`}
      >
        <div className="max-w-[1100px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center">
            <Link
              to="/"
              className={`flex items-center gap-[12px] cursor-pointer select-none text-[#14130F]`}
            >
              <span className="font-display font-[800] text-[28px] tracking-tight leading-none">
                CIF
              </span>
              <div
                className={`flex flex-col font-mono text-[11px] tracking-[0.05em] leading-[1.3] uppercase text-[#84817A]`}
              >
                <span>CENTER FOR</span>
                <span>INNOVATING THE FUTURE</span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8 md:gap-12">
            <div className={`flex items-center select-none gap-6 md:gap-8`}>
              <div className="relative group flex items-center">
                <span
                  className={`flex items-center gap-1.5 cursor-pointer py-2 nav-item-top`}
                >
                  Publishing & Press{" "}
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </span>

                <div className="absolute top-[100%] left-0 min-w-[200px] bg-paper border border-ink-15 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-ink shadow-lg">
                  <span className="dropdown-section-header">
                    PUBLISHING & PRESS
                  </span>
                  <Link
                    to="/news"
                    className="block px-6 py-4 border-b border-ink-15 hover:bg-[#F9F9F9] transition-colors font-sans normal-case tracking-normal text-[15px] font-medium"
                  >
                    Press
                  </Link>
                  <Link
                    to="/podcast"
                    className="block px-6 py-4 border-b border-ink-15 hover:bg-[#F9F9F9] transition-colors font-sans normal-case tracking-normal text-[15px] font-medium"
                  >
                    Podcast
                  </Link>
                  <Link
                    to="/books"
                    className="block px-6 py-4 border-b border-ink-15 hover:bg-[#F9F9F9] transition-colors font-sans normal-case tracking-normal text-[15px] font-medium"
                  >
                    Books
                  </Link>
                </div>
              </div>

              <div className="relative group flex items-center">
                <span
                  className={`flex items-center gap-1.5 cursor-pointer py-2 nav-item-top`}
                >
                  Work <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </span>

                <div className="absolute top-[100%] left-0 min-w-[200px] bg-paper border border-ink-15 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-ink shadow-lg">
                  <span className="dropdown-section-header">WORK</span>
                  <Link
                    to="/ventures/portfolio"
                    className="block px-6 py-4 border-b border-ink-15 hover:bg-[#F9F9F9] transition-colors font-sans normal-case tracking-normal text-[15px] font-medium"
                  >
                    Our Work
                  </Link>
                  <Link
                    to="/ventures"
                    className="block px-6 py-4 hover:bg-[#F9F9F9] transition-colors font-sans normal-case tracking-normal text-[15px] font-medium"
                  >
                    Our Principles
                  </Link>
                </div>
              </div>

              <div className="relative group flex items-center">
                <span
                  className={`flex items-center gap-1.5 cursor-pointer py-2 nav-item-top`}
                >
                  About <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </span>

                <div className="absolute top-[100%] left-0 min-w-[200px] bg-paper border border-ink-15 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-ink shadow-lg">
                  <span className="dropdown-section-header">ABOUT</span>
                  <Link
                    to="/credo"
                    className="block px-6 py-4 border-b border-ink-15 hover:bg-[#F9F9F9] transition-colors font-sans normal-case tracking-normal text-[15px] font-medium"
                  >
                    Credo
                  </Link>
                  <Link
                    to="/leadership"
                    className="block px-6 py-4 border-b border-ink-15 hover:bg-[#F9F9F9] transition-colors font-sans normal-case tracking-normal text-[15px] font-medium"
                  >
                    Leadership
                  </Link>
                  <Link
                    to="/careers"
                    className="block px-6 py-4 border-b border-ink-15 hover:bg-[#F9F9F9] transition-colors font-sans normal-case tracking-normal text-[15px] font-medium"
                  >
                    Careers
                  </Link>
                  <Link
                    to="/contact"
                    className="block px-6 py-4 hover:bg-[#F9F9F9] transition-colors font-sans normal-case tracking-normal text-[15px] font-medium"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </div>

            <Link
              to="/contact"
              className={`rounded-full px-[28px] py-[12px] border font-mono text-xs uppercase font-medium tracking-[0.25em] transition-colors bg-white text-ink border-[#D8D5CD] hover:bg-[#F9F9F9]`}
            >
              Contact
            </Link>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-ink hover:text-ink-45 transition-colors focus:outline-none z-50"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden fixed top-[72px] left-0 w-full bg-paper/98 backdrop-blur-md border-b border-[#D8D5CD] z-40 overflow-hidden shadow-xl px-6 py-8"
          >
            <div className="max-w-[1100px] mx-auto flex flex-col gap-6 font-sans">
              <Link
                to="/podcast"
                className="text-2xl font-medium text-[#14130F] hover:text-[#84817A] transition-colors"
              >
                Publishing & Press
              </Link>
              <div className="w-full h-px bg-[#D8D5CD] opacity-40"></div>

              <Link
                to="/ventures"
                className="text-2xl font-medium text-[#14130F] hover:text-[#84817A] transition-colors"
              >
                Work
              </Link>
              <div className="w-full h-px bg-[#D8D5CD] opacity-40"></div>

              <Link
                to="/credo"
                className="text-2xl font-medium text-[#14130F] hover:text-[#84817A] transition-colors"
              >
                About
              </Link>
              <div className="w-full h-px bg-[#D8D5CD] opacity-40"></div>

              <Link
                to="/contact"
                className="text-2xl font-medium text-[#14130F] hover:text-[#84817A] transition-colors"
              >
                Contact
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {["/credo", "/leadership", "/careers", "/contact"].includes(pathname) && (
        <div className="w-full bg-paper border-b border-[#D8D5CD] pt-[80px] z-30 relative">
          <div className="max-w-[1100px] mx-auto px-6 md:px-12 flex items-center h-[56px] overflow-hidden">
            <span className="font-serif text-[20px] text-[#14130F] pr-6 flex-shrink-0">
              About
            </span>
            <div className="w-px h-[24px] bg-[#D8D5CD] flex-shrink-0"></div>
            <div className="flex items-center gap-6 md:gap-8 pl-6 h-full overflow-x-auto whitespace-nowrap scrollbar-none">
              <Link
                to="/credo"
                className={`h-full flex items-center font-sans text-[15px] border-b-2 transition-colors flex-shrink-0 ${pathname === "/credo" ? "font-semibold text-[#14130F] border-[#14130F]" : "font-semibold text-[#46443D] border-transparent hover:text-[#14130F]"}`}
              >
                Credo
              </Link>
              <Link
                to="/leadership"
                className={`h-full flex items-center font-sans text-[15px] border-b-2 transition-colors flex-shrink-0 ${pathname === "/leadership" ? "font-semibold text-[#14130F] border-[#14130F]" : "font-semibold text-[#46443D] border-transparent hover:text-[#14130F]"}`}
              >
                Leadership
              </Link>
              <Link
                to="/careers"
                className={`h-full flex items-center font-sans text-[15px] border-b-2 transition-colors flex-shrink-0 ${pathname === "/careers" ? "font-semibold text-[#14130F] border-[#14130F]" : "font-semibold text-[#46443D] border-transparent hover:text-[#14130F]"}`}
              >
                Careers
              </Link>
              <Link
                to="/contact"
                className={`h-full flex items-center font-sans text-[15px] border-b-2 transition-colors flex-shrink-0 ${pathname === "/contact" ? "font-semibold text-[#14130F] border-[#14130F]" : "font-semibold text-[#46443D] border-transparent hover:text-[#14130F]"}`}
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      )}

      {["/podcast", "/news", "/books"].includes(pathname) && (
        <div className="w-full bg-paper border-b border-[#D8D5CD] pt-[80px] z-30 relative">
          <div className="max-w-[1100px] mx-auto px-6 md:px-12 flex items-center h-[56px] overflow-hidden">
            <span className="font-serif text-[20px] text-[#14130F] pr-6 flex-shrink-0">
              Publishing & Press
            </span>
            <div className="w-px h-[24px] bg-[#D8D5CD] flex-shrink-0"></div>
            <div className="flex items-center gap-6 md:gap-8 pl-6 h-full overflow-x-auto whitespace-nowrap scrollbar-none">
              <Link
                to="/news"
                className={`h-full flex items-center font-sans text-[15px] border-b-2 transition-colors flex-shrink-0 ${pathname === "/news" ? "font-semibold text-[#14130F] border-[#14130F]" : "font-semibold text-[#46443D] border-transparent hover:text-[#14130F]"}`}
              >
                Press
              </Link>
              <Link
                to="/podcast"
                className={`h-full flex items-center font-sans text-[15px] border-b-2 transition-colors flex-shrink-0 ${pathname === "/podcast" ? "font-semibold text-[#14130F] border-[#14130F]" : "font-semibold text-[#46443D] border-transparent hover:text-[#14130F]"}`}
              >
                Podcast
              </Link>
              <Link
                to="/books"
                className={`h-full flex items-center font-sans text-[15px] border-b-2 transition-colors flex-shrink-0 ${pathname === "/books" ? "font-semibold text-[#14130F] border-[#14130F]" : "font-semibold text-[#46443D] border-transparent hover:text-[#14130F]"}`}
              >
                Books
              </Link>
            </div>
          </div>
        </div>
      )}

      {["/ventures", "/ventures/portfolio"].includes(pathname) && (
        <div className="w-full bg-paper border-b border-[#D8D5CD] pt-[80px] z-30 relative">
          <div className="max-w-[1100px] mx-auto px-6 md:px-12 flex items-center h-[56px] overflow-hidden">
            <span className="font-serif text-[20px] text-[#14130F] pr-6 flex-shrink-0">
              Work
            </span>
            <div className="w-px h-[24px] bg-[#D8D5CD] flex-shrink-0"></div>
            <div className="flex items-center gap-6 md:gap-8 pl-6 h-full overflow-x-auto whitespace-nowrap scrollbar-none">
              <Link
                to="/ventures/portfolio"
                className={`h-full flex items-center font-sans text-[15px] border-b-2 transition-colors flex-shrink-0 ${pathname === "/ventures/portfolio" ? "font-semibold text-[#14130F] border-[#14130F]" : "font-semibold text-[#46443D] border-transparent hover:text-[#14130F]"}`}
              >
                Work
              </Link>
              <Link
                to="/ventures"
                className={`h-full flex items-center font-sans text-[15px] border-b-2 transition-colors flex-shrink-0 ${pathname === "/ventures" ? "font-semibold text-[#14130F] border-[#14130F]" : "font-semibold text-[#46443D] border-transparent hover:text-[#14130F]"}`}
              >
                Our Principles
              </Link>
            </div>
          </div>
        </div>
      )}

      <Outlet />

      <footer className="relative bg-black pt-[80px] pb-[48px] px-6 md:px-12 mt-auto overflow-hidden">
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-start justify-between gap-12 relative z-10 pb-[80px]">
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-[40px] md:text-[48px] text-[#ffffff] leading-[1.1] tracking-tight">
              CENTER FOR
              <br />
              INNOVATING
              <br />
              THE FUTURE
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-12 md:gap-24">
            <div className="flex flex-col">
              <span className="font-mono text-[13px] uppercase tracking-widest text-[#ffffff] mb-[20px]">
                PRESS & PODCAST
              </span>
              <div className="flex flex-col space-y-[24px]">
                <Link
                  to="/podcast"
                  className="text-left font-sans text-[16px] text-[#ffffff] hover:underline underline-offset-4 decoration-white/30 transition-all"
                >
                  Ayush Prakash Podcast
                </Link>
                <Link
                  to="/news"
                  className="text-left font-sans text-[16px] text-[#ffffff] hover:underline underline-offset-4 decoration-white/30 transition-all"
                >
                  Press
                </Link>
                <Link
                  to="/books"
                  className="text-left font-sans text-[16px] text-[#ffffff] hover:underline underline-offset-4 decoration-white/30 transition-all"
                >
                  Books
                </Link>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="font-mono text-[13px] uppercase tracking-widest text-[#ffffff] mb-[20px]">
                WORK
              </span>
              <div className="flex flex-col space-y-[24px]">
                <Link
                  to="/ventures/portfolio"
                  className="text-left font-sans text-[16px] text-[#ffffff] hover:underline underline-offset-4 decoration-white/30 transition-all"
                >
                  Work
                </Link>
                <Link
                  to="/ventures"
                  className="text-left font-sans text-[16px] text-[#ffffff] hover:underline underline-offset-4 decoration-white/30 transition-all"
                >
                  Our Principles
                </Link>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="font-mono text-[13px] uppercase tracking-widest text-[#ffffff] mb-[20px]">
                ABOUT
              </span>
              <div className="flex flex-col space-y-[24px]">
                <Link
                  to="/credo"
                  className="text-left font-sans text-[16px] text-[#ffffff] hover:underline underline-offset-4 decoration-white/30 transition-all"
                >
                  Credo
                </Link>
                <Link
                  to="/leadership"
                  className="text-left font-sans text-[16px] text-[#ffffff] hover:underline underline-offset-4 decoration-white/30 transition-all"
                >
                  Leadership
                </Link>
                <Link
                  to="/careers"
                  className="text-left font-sans text-[16px] text-[#ffffff] hover:underline underline-offset-4 decoration-white/30 transition-all"
                >
                  Careers
                </Link>
                <Link
                  to="/contact"
                  className="text-left font-sans text-[16px] text-[#ffffff] hover:underline underline-offset-4 decoration-white/30 transition-all"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1100px] mx-auto w-full h-px bg-[#333333] mb-[32px] relative z-10"></div>

        <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 w-full">
          <div className="text-[#ffffff] text-[12px] font-sans sm:flex-1 text-left">
            © 2026 CENTER FOR INNOVATING THE FUTURE, INC.
          </div>
          <div className="flex items-center justify-center gap-10 text-[#ffffff] text-[12px] font-sans sm:flex-1">
            <Link
              to="/terms"
              className="hover:underline underline-offset-4 decoration-white/30 transition-all"
            >
              Terms of Use
            </Link>
            <Link
              to="/privacy"
              className="hover:underline underline-offset-4 decoration-white/30 transition-all"
            >
              Privacy Policy
            </Link>
          </div>
          <div className="flex items-center justify-end sm:flex-1">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ffffff] hover:opacity-80 transition-opacity"
            >
              <Linkedin className="w-[20px] h-[20px]" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
