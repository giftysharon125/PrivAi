import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Cpu, CheckCircle2, ArrowRight, FileText, Sparkles, Layers, EyeOff } from 'lucide-react';
import PrivacyCard from '../components/PrivacyCard';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-24 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 lg:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-semibold text-blue-400">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Pre-Hackathon Foundation Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Prove your eligibility <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">
              without exposing everything.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            PrivAI combines AI document extraction with deterministic eligibility rules to verify student internship qualifications while keeping raw transcripts strictly private.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? "/upload" : "/register"}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white font-bold text-lg shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all flex items-center justify-center space-x-3"
            >
              <span>Verify Eligibility</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to={isAuthenticated ? "/dashboard" : "/login"}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-semibold text-lg border border-slate-800 transition-colors flex items-center justify-center space-x-2"
            >
              <FileText className="w-5 h-5 text-slate-400" />
              <span>{isAuthenticated ? "Go to Dashboard" : "Sign In & Demo"}</span>
            </Link>
          </div>

          {/* Quick Features Micro-Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-400">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>AI Document Parser</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Deterministic Rules Engine</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>ZK Privacy Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM VS SOLUTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Problem Card */}
          <div className="glass-panel p-8 rounded-2xl border border-rose-900/30 bg-rose-950/10 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
              <EyeOff className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">The Core Problem</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Traditional verification forces students to submit full academic certificates, marksheet PDFs, and resumes to recruiters or portals. This exposes unnecessary sensitive personal information (address, DOB, individual course marks, roll numbers).
            </p>
          </div>

          {/* PrivAI Solution Card */}
          <div className="glass-panel p-8 rounded-2xl border border-emerald-900/30 bg-emerald-950/10 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">The PrivAI Solution</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              PrivAI parses your certificate locally with AI, evaluates your criteria against deterministic rules (Branch == CSE, Year &ge; 3, CGPA &ge; 7.0), and outputs a verifiable eligibility claim without revealing raw sensitive documents.
            </p>
          </div>

        </div>
      </section>

      {/* HOW PRIVAI WORKS (4-STEP WORKFLOW) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-14">
          <h2 className="text-3xl font-extrabold text-white">How PrivAI Works</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            From raw PDF to verifiable zero-knowledge eligibility claim in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 relative">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center text-sm border border-blue-500/30">
              01
            </div>
            <h4 className="text-lg font-bold text-white">Upload Certificate</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload your academic PDF or transcript into PrivAI's secure environment.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 relative">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 font-bold flex items-center justify-center text-sm border border-indigo-500/30">
              02
            </div>
            <h4 className="text-lg font-bold text-white">AI Schema Extraction</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gemini AI extracts structured fields (Branch, Year, CGPA, Status) into strict JSON.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 relative">
            <div className="w-8 h-8 rounded-lg bg-cyan-600/20 text-cyan-400 font-bold flex items-center justify-center text-sm border border-cyan-500/30">
              03
            </div>
            <h4 className="text-lg font-bold text-white">Deterministic Rules</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our rules engine objectively verifies criteria without relying on LLM guesswork.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 relative">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 font-bold flex items-center justify-center text-sm border border-emerald-500/30">
              04
            </div>
            <h4 className="text-lg font-bold text-white">Shareable Proof</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Share your ELIGIBLE claim digest with recruiters while keeping your document private.
            </p>
          </div>

        </div>
      </section>

      {/* PRIVACY UX MATRIX DEMO */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-8">
          <h2 className="text-2xl font-bold text-white">Privacy-First Experience</h2>
          <p className="text-slate-400 text-xs">
            See exactly what data remains private vs what is shared as a claim proof.
          </p>
        </div>
        <PrivacyCard proofHash="0x8f3c7a29e1d4b68902f5a31e47c2b901a58d6f3e4c1a2b90871e3456789abcde" />
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-10 text-center space-y-6 border border-blue-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950/40 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-extrabold text-white">
              Ready to verify student eligibility?
            </h2>
            <p className="text-slate-300 text-sm">
              Try the complete PrivAI AI extraction and deterministic rules engine today.
            </p>
            <Link
              to={isAuthenticated ? "/upload" : "/register"}
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-base shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
