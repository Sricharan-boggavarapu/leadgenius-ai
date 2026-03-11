"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Building2, Globe, Briefcase, Mail, Zap, ChevronRight, Copy, Check, RefreshCw } from "lucide-react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [company, setCompany] = useState("");
  const [leads, setLeads] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showManualEmail, setShowManualEmail] = useState(false);
  
  // Fetch leads on mount
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
      }
    } catch (error) {
      console.error("Failed to fetch leads", error);
    }
  };

  const generateLeads = async () => {
    if (!query) return;
    setLoadingLeads(true);
    setEmail(""); // Clear existing email when generating new leads
    setCompany(""); // Clear the company input too
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.leads) {
        // Prepend new leads locally for immediate feedback before full refetch
        setLeads((prev) => [...(Array.isArray(data.leads) ? data.leads : []), ...prev]);
        fetchLeads(); // Sync with DB
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingLeads(false);
    }
  };

  const generateEmail = async (targetCompany?: string, targetIndustry?: string) => {
    const comp = targetCompany || company;
    if (!comp) return;
    
    // Set form input if clicked from card
    if (targetCompany && company !== targetCompany) setCompany(targetCompany);
    
    setLoadingEmail(true);
    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: comp,
          industry: targetIndustry || "Technology"
        }),
      });
      const data = await res.json();
      setEmail(data.email);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingEmail(false);
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-200 selection:bg-indigo-500/30 font-sans overflow-x-hidden">
      
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20">
        
        {/* Header */}
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
                LeadGenius AI
              </h1>
              <p className="mt-2 text-slate-400 font-medium text-lg">
                Supercharge your B2B outbound with structured AI intelligence.
              </p>
            </div>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT COLUMN: Controls */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Lead Generation Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
              
              <h2 className="text-2xl font-semibold text-white mb-2 flex items-center gap-2">
                <Search className="w-5 h-5 text-indigo-400" /> Discover Leads
              </h2>
              <p className="text-slate-400 mb-6 text-sm">
                Describe your target audience and let AI find high-quality B2B prospects instantly.
              </p>

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Briefcase className="w-5 h-5 text-slate-500" />
                  </div>
                  <input
                    className="w-full bg-slate-950/50 border border-slate-700/50 text-white rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                    placeholder="e.g. AI startups in California"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && generateLeads()}
                  />
                </div>

                <button
                  onClick={generateLeads}
                  disabled={loadingLeads || !query}
                  className="w-full relative group overflow-hidden rounded-xl bg-white text-slate-900 font-medium py-4 px-6 transition-all hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loadingLeads ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                      Mining Data...
                    </span>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" /> Generate Prospects
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Manual Email Button / Form */}
            {!showManualEmail ? (
              <button
                onClick={() => setShowManualEmail(true)}
                className="w-full flex items-center justify-between bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800 rounded-2xl p-4 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-medium group-hover:text-emerald-400 transition-colors">Write Custom Email</h3>
                    <p className="text-slate-400 text-xs mt-0.5">Target a specific company directly</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 transition-colors transform group-hover:translate-x-1" />
              </button>
            ) : (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-slate-900/50 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-400" /> Custom Outreach
                  </h2>
                  <button onClick={() => setShowManualEmail(false)} className="text-slate-500 hover:text-slate-300 text-sm">
                    Cancel
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <Building2 className="w-4 h-4 text-slate-500" />
                    </div>
                    <input
                      className="w-full bg-slate-950/50 border border-slate-700/50 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-slate-600 text-sm"
                      placeholder="Company name"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && generateEmail()}
                    />
                  </div>
                  <button
                    onClick={() => generateEmail()}
                    disabled={loadingEmail || !company}
                    className="w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium py-3 px-6 transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 text-sm"
                  >
                    {loadingEmail ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Writing...
                      </span>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" /> Generate
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

          </div>

          {/* RIGHT COLUMN: Results */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Leads Database Viewer */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-1 shadow-2xl flex flex-col h-[600px] lg:h-[calc(100vh-250px)]"
            >
              <div className="p-7 border-b border-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-400" /> Prospect Database
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">
                    {leads.length} leads stored in your pipeline
                  </p>
                </div>
                <div className="flex gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <span>Scroll to view all</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
                {leads.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-3">
                    <Search className="w-8 h-8 opacity-20" />
                    <p>No leads generated yet</p>
                  </div>
                ) : (
                  leads.map((lead: any, i: number) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={lead.id || i}
                      className="group bg-slate-950/50 border border-slate-800 hover:border-indigo-500/50 flex flex-col sm:flex-row justify-between p-5 rounded-2xl transition-all hover:bg-slate-900/80 hover:shadow-lg hover:shadow-indigo-500/5"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-white">
                            {lead.company}
                          </h4>
                          {lead.score && (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                              {lead.score} Score
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                          {lead.industry && (
                            <span className="flex items-center gap-1.5 bg-slate-900 py-1 px-2.5 rounded-lg border border-slate-800">
                              <Briefcase className="w-3.5 h-3.5" />
                              <span className="truncate max-w-[150px]">{lead.industry}</span>
                            </span>
                          )}
                          {lead.website && (
                            <a 
                              href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 bg-slate-900 py-1 px-2.5 rounded-lg border border-slate-800 hover:text-indigo-400 hover:border-indigo-500/30 transition-colors"
                            >
                              <Globe className="w-3.5 h-3.5" />
                              Website
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 sm:mt-0 sm:ml-4 flex items-center">
                          <button
                            onClick={() => generateEmail(lead.company, lead.industry)}
                            className="w-full sm:w-auto px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-medium text-sm border border-emerald-500/20 rounded-xl transition-all flex items-center justify-center gap-2 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500"
                          >
                            <Mail className="w-4 h-4" /> Generate Email
                          </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>

          </div>
        </div>

        {/* Email Result Full Width */}
        <AnimatePresence>
          {email && (
            <motion.div 
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-10 bg-slate-900/80 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-8 shadow-2xl relative"
            >
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-800">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                   <Sparkles className="w-5 h-5 text-emerald-400" /> Generated Email
                </h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => generateEmail()}
                    disabled={loadingEmail}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingEmail ? 'animate-spin' : ''}`} />
                    Regenerate
                  </button>
                  <button 
                    onClick={copyEmail}
                    className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors flex items-center gap-2 text-sm border border-emerald-500/20"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
              <div className="w-full">
                <textarea
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  ref={(textarea) => {
                    if (textarea) {
                      textarea.style.height = 'auto';
                      textarea.style.height = `${textarea.scrollHeight}px`;
                    }
                  }}
                  className="w-full min-h-[150px] text-slate-300 bg-slate-950/50 p-6 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 font-sans leading-relaxed transition-all overflow-hidden"
                  placeholder="Your generated email will appear here..."
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-sm">
          <p>
            Developed by <span className="text-slate-200 font-medium tracking-wide">Sricharan Boggavarapu</span>
          </p>
          <div className="flex items-center gap-6">
            <a 
              href="https://www.linkedin.com/in/boggavarapu-sricharan" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-indigo-400 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
              </svg>
              LinkedIn
            </a>
            <a 
              href="https://github.com/Sricharan-boggavarapu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-slate-200 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub
            </a>
          </div>
        </footer>

      </main>
      
      {/* Global CSS overrides inside component since we can't fully override globals.css easily without losing some base styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(51, 65, 85, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(71, 85, 105, 0.8);
        }
        body {
          background-color: #0a0f1c !important;
          color: white !important;
        }
      `}} />
    </div>
  );
}