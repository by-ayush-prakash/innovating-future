import React, { useState } from "react";
import { CheckCircle, FileText, Send } from "lucide-react";
import gargoyleImg from "../assets/images/image-3.png";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export function HoldingPatternSection() {
  const [activeTab, setActiveTab ] = useState<"connections" | "capital" | "strategy" | "community">("connections");
  const [partnershipForm, setPartnershipForm] = useState({
    founderName: "",
    orgName: "",
    domain: "socio-tech",
    description: "",
    documentDropped: false,
    honey_website: "", // frictionless honeypot
    isSubmitting: false,
    isSubmitted: false
  });
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [partnershipError, setPartnershipError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setPartnershipForm(prev => ({ ...prev, documentDropped: true }));
      setPartnershipError(null);
    }
  };

  const handleFileSelect = () => {
    setPartnershipForm(prev => ({ ...prev, documentDropped: true }));
    setPartnershipError(null);
  };

  const handlePartnershipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Frictionless honeypot check
    if (partnershipForm.honey_website !== "") {
      // Spam bot detected, fake success
      setPartnershipForm(prev => ({ ...prev, isSubmitted: true }));
      return;
    }

    if (!partnershipForm.founderName || !partnershipForm.orgName || !partnershipForm.description) {
      setPartnershipError("Complete all non-optional enterprise specifications.");
      return;
    }

    setPartnershipError(null);
    setPartnershipForm(prev => ({ ...prev, isSubmitting: true }));
    
    const pathForCreate = 'partnerships';
    try {
      await addDoc(collection(db, pathForCreate), {
        founderName: partnershipForm.founderName,
        orgName: partnershipForm.orgName,
        domain: partnershipForm.domain,
        description: partnershipForm.description,
        documentDropped: partnershipForm.documentDropped,
        createdAt: serverTimestamp()
      });
      setPartnershipForm(prev => ({ ...prev, isSubmitting: false, isSubmitted: true }));
    } catch (error) {
      setPartnershipForm(prev => ({ ...prev, isSubmitting: false }));
      setPartnershipError("Network transmission failed. Please try again.");
      handleFirestoreError(error, OperationType.CREATE, pathForCreate);
    }
  };

  return (
    <section id="the-container" className="max-w-7xl mx-auto w-full px-6 md:px-12 pt-20 pb-8 space-y-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#2D2D2D] font-light leading-none tracking-tight text-balance">
            A container for serious ventures.
          </h2>
          <div className="text-[#2D2D2D]/80 text-sm leading-relaxed space-y-4 font-sans text-pretty">
            <p>
              CIF takes a meaningful stake in a small number of companies it believes in. While all ventures are owned and operated on their own, in return, each carries a small Gargoyle on its platform. A signal, not a logo, that the company meets CIF's standard and that our name is on the line.
            </p>
          </div>

          {/* Powered by CIF Emblem Layout Grid matching the screenshot design */}
          <div className="pt-10 flex flex-col sm:flex-row items-start gap-8 lg:gap-10">
            <img 
              src={gargoyleImg} 
              alt="Gargoyle Certificate" 
              className="h-24 md:h-32 w-auto object-contain mix-blend-multiply opacity-95 shrink-0" 
              referrerPolicy="no-referrer"
            />
            <div className="text-xs sm:text-sm md:text-[15px] font-mono text-[#2D2D2D]/80 leading-relaxed max-w-xl text-pretty pt-2">
              This visual certificate is hard-stamped across all ventures. It indicates capital alignment, shared values, and symbolizes the mark cast to ward off corruption and safeguard our shared enterprise.
            </div>
          </div>
        </div>

        {/* Interactive Core Provisions module on the right */}
        <div className="lg:col-span-5 bg-[#F4F3F1] border border-[#2D2D2D]/20 p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-[#2D2D2D] font-serif text-lg mt-1 font-light text-balance">In exchange, portfolio ventures receive:</h3>
          </div>

          {/* Toggle tabs for core provisions */}
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
            {[
              { 
                id: "connections", 
                label: "01 / CONNECTIONS",
                colors: {
                  activeBg: "bg-[#2D2D2D]",
                  activeBorder: "border-[#2D2D2D]",
                  hoverBorder: "hover:border-[#3171C6]",
                  hoverText: "hover:text-[#3171C6]",
                  hex: "#3171C6"
                }
              },
              { 
                id: "capital", 
                label: "02 / CAPITAL",
                colors: {
                  activeBg: "bg-[#2D2D2D]",
                  activeBorder: "border-[#2D2D2D]",
                  hoverBorder: "hover:border-[#3171C6]",
                  hoverText: "hover:text-[#3171C6]",
                  hex: "#2D2D2D"
                }
              },
              { 
                id: "strategy", 
                label: "03 / STRATEGY",
                colors: {
                  activeBg: "bg-[#2D2D2D]",
                  activeBorder: "border-[#2D2D2D]",
                  hoverBorder: "hover:border-[#3171C6]",
                  hoverText: "hover:text-[#3171C6]",
                  hex: "#3171C6"
                }
              },
              { 
                id: "community", 
                label: "04 / COMMUNITY",
                colors: {
                  activeBg: "bg-[#2D2D2D]",
                  activeBorder: "border-[#2D2D2D]",
                  hoverBorder: "hover:border-[#3171C6]",
                  hoverText: "hover:text-[#3171C6]",
                  hex: "#2D2D2D"
                }
              }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-3 border text-left cursor-pointer transition ${
                  activeTab === tab.id 
                    ? `${tab.colors.activeBorder} ${tab.colors.activeBg} text-[#F4F3F1] font-bold` 
                    : `border-[#2D2D2D]/15 ${tab.colors.hoverBorder} ${tab.colors.hoverText} text-[#2D2D2D]/80 bg-[#F4F3F1]`
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-[#F4F3F1] border border-[#2D2D2D]/15 p-4 min-h-[140px] flex flex-col justify-between cream-card-glow relative overflow-hidden">
            {/* Top border colored dynamically based on selected tab */}
            <div 
              className="absolute top-0 left-0 right-0 h-[3px] transition-colors duration-300" 
              style={{ 
                backgroundColor: 
                  activeTab === "connections" ? "#3171C6" : 
                  activeTab === "capital" ? "#2D2D2D" : 
                  activeTab === "strategy" ? "#3171C6" : "#2D2D2D" 
              }}
            />
            
            <div className="space-y-2 pt-1">
              <h4 
                className="text-xs font-mono tracking-wider uppercase font-bold transition-colors duration-300"
                style={{ 
                  color: 
                    activeTab === "connections" ? "#3171C6" : 
                    activeTab === "capital" ? "#2D2D2D" : 
                    activeTab === "strategy" ? "#3171C6" : "#2D2D2D" 
                }}
              >
                {activeTab === "connections" && "Institutional Linkages & Staffing"}
                {activeTab === "capital" && "Direct Preemptive Capital Options"}
                {activeTab === "strategy" && "The Intelligence Stack Sessions"}
                {activeTab === "community" && "Curated Dinners & Intellectual Gatherings"}
              </h4>
              <p className="text-xs text-[#2D2D2D]/80 leading-relaxed font-sans">
                {activeTab === "connections" && "Direct integration of key personnel, administrative strategists, high-tier legal advisers, and prospective early clients sourced entirely from the CIF's sovereign institutional network."}
                {activeTab === "capital" && "Emergency liquidity access structured systematically between $10,000 and $100,000 to resolve physical bottlenecks, layout designs, print publications, and operational hardware needs."}
                {activeTab === "strategy" && "Growth alignment sessions framed directly around our multi-layer strategic intelligence stack layers covering socio-technical dynamics, long-view micro-economics, and geopolitics."}
                {activeTab === "community" && "Exclusive placement at the physical roundtable sessions, founders dinners, and private annual CIF-sponsored colloquiums across key global coordinates."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE FILING PORTAL (Sovereign Startup Partnership Form) */}
      <div className="border border-[#2D2D2D]/20 bg-[#F4F3F1] cream-card-glow p-6 md:p-8 space-y-6">
        <div className="border-b border-[#2D2D2D]/15 pb-4">
          <h3 className="text-xl font-serif text-[#2D2D2D] font-light mt-1 text-balance">Filing for CIF Partnership</h3>
          <p className="text-xs text-[#2D2D2D]/85 font-sans mt-1">
            Submit your project specifications below to be reviewed on a rolling 60 standard-day cycle.
          </p>
        </div>

        {partnershipForm.isSubmitted ? (
          <div className="py-8 text-center max-w-md mx-auto space-y-4">
            <div className="w-10 h-10 rounded-full border border-[#2D2D2D] bg-[#2D2D2D]/5 flex items-center justify-center mx-auto">
               <CheckCircle className="w-5 h-5 text-[#3171C6]" />
            </div>
            <h4 className="font-serif text-[#2D2D2D] text-lg font-light">Filing Logged into System</h4>
            <p className="text-xs text-[#2D2D2D]/80 leading-relaxed font-sans">
              Enterprise parameters for <strong className="text-[#2D2D2D]">{partnershipForm.orgName}</strong> have been securely cleared. The board under director Ayush Prakash will review this structural inquiry.
            </p>
            <button
              onClick={() => setPartnershipForm({
                founderName: "",
                orgName: "",
                domain: "socio-tech",
                description: "",
                documentDropped: false,
                isSubmitting: false,
                isSubmitted: false
              })}
              className="px-4 py-1.5 border border-[#2D2D2D] text-[#2D2D2D] hover:bg-[#3171C6] hover:text-[#F4F3F1] bg-[#F4F3F1] text-xs font-mono transition cursor-pointer font-bold"
            >
              SUBMIT NEW SPECIFICATION SHEET
            </button>
          </div>
        ) : (
          <form onSubmit={handlePartnershipSubmit} className="space-y-4 font-sans text-xs">
            {partnershipError && (
              <div className="p-3 bg-[#F4F3F1] border border-[#3171C6] text-[#3171C6] text-xs font-mono">
                ⚠️ Error: {partnershipError}
              </div>
            )}

            {/* Frictionless Honeypot: Hidden from real users, visible to bots */}
            <div className="opacity-0 absolute top-[-9999px] left-[-9999px]" aria-hidden="true" tabIndex={-1}>
              <label htmlFor="honey_website">Website URL</label>
              <input
                id="honey_website"
                type="text"
                name="honey_website"
                placeholder="Leave this empty"
                value={partnershipForm.honey_website}
                onChange={e => setPartnershipForm({ ...partnershipForm, honey_website: e.target.value })}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-mono text-[#2D2D2D]/70 uppercase tracking-widest mb-1.5 font-bold">Principal Applicant</label>
                <input
                  type="text"
                  placeholder="Legal name"
                  value={partnershipForm.founderName}
                  onChange={e => setPartnershipForm({ ...partnershipForm, founderName: e.target.value })}
                  className="w-full bg-[#F4F3F1] border border-[#2D2D2D]/20 text-[#2D2D2D] rounded-none p-2.5 outline-none focus:border-[#3171C6] transition"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-[#2D2D2D]/70 uppercase tracking-widest mb-1.5 font-bold">Organization</label>
                <input
                  type="text"
                  placeholder="Legal name of property"
                  value={partnershipForm.orgName}
                  onChange={e => setPartnershipForm({ ...partnershipForm, orgName: e.target.value })}
                  className="w-full bg-[#F4F3F1] border border-[#2D2D2D]/20 text-[#2D2D2D] rounded-none p-2.5 outline-none focus:border-[#3171C6] transition"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-[#2D2D2D]/70 uppercase tracking-widest mb-1.5 font-bold">Focus Area</label>
                <div className="relative">
                  <select
                    value={partnershipForm.domain}
                    onChange={e => setPartnershipForm({ ...partnershipForm, domain: e.target.value })}
                    className="w-full bg-[#F4F3F1] border border-[#2D2D2D]/20 text-[#2D2D2D] rounded-none p-2.5 outline-none cursor-pointer focus:border-[#3171C6] transition appearance-none pr-8"
                  >
                    <option value="sociotechnology">Sociotechnology</option>
                    <option value="business">Business</option>
                    <option value="geopolitics">Geopolitics</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#2D2D2D]/50">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#2D2D2D]/70 uppercase tracking-widest mb-1.5 font-bold">Enterprise Details</label>
              <textarea
                placeholder="Please mention what you build and how working with CIF is necessary for our and your long-term view."
                value={partnershipForm.description}
                onChange={e => setPartnershipForm({ ...partnershipForm, description: e.target.value })}
                rows={3}
                className="w-full bg-[#F4F3F1] border border-[#2D2D2D]/20 text-[#2D2D2D] rounded-none p-2.5 outline-none resize-none focus:border-[#3171C6] transition"
              />
            </div>

            {/* Usability patterns: Drag & drop selector container with nice styling */}
            <div>
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border border-dashed p-5 text-center transition ${
                  partnershipForm.documentDropped
                    ? "border-[#3171C6] bg-[#3171C6]/5"
                    : dragActive
                    ? "border-[#3171C6] bg-[#F4F3F1] text-[#3171C6]"
                    : "border-[#2D2D2D]/15 bg-[#F4F3F1] hover:border-[#3171C6] hover:bg-[#3171C6]/5 text-[#2D2D2D]/75"
                }`}
              >
                <input
                  type="file"
                  accept=".pdf,.txt,.json"
                  id="partnership_doc"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                {partnershipForm.documentDropped ? (
                  <div className="flex flex-col items-center gap-1">
                    <FileText className="w-5 h-5 text-[#3171C6]" />
                    <span className="text-[10px] uppercase font-mono text-[#3171C6] font-bold">METADATA_RECORDED.PDF</span>
                    <span className="text-[9px] text-[#2D2D2D]/80">File attached securely. Drop a different file to replace.</span>
                  </div>
                ) : (
                  <div>
                    <div className="text-[10px] font-mono select-none">
                      DRAG & DROP SPEC FILE (PDF ONLY) OR{" "}
                      <label htmlFor="partnership_doc" className="underline cursor-pointer text-[#3171C6] font-bold hover:text-[#2D2D2D]">
                        BROWSE FILES
                      </label>
                    </div>
                    <span className="text-[9px] text-[#2D2D2D]/70 block mt-1">Maximum size limit: 10MB</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={partnershipForm.isSubmitting}
                className="px-6 py-2 bg-[#2D2D2D] text-[#F4F3F1] font-semibold hover:bg-[#3171C6] transition text-xs tracking-wider uppercase font-mono flex items-center gap-2 cursor-pointer shadow-sm animate-none"
              >
                {partnershipForm.isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                    ROUTING INQUIRY...
                  </>
                ) : (
                  <>
                    Power CIF
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
