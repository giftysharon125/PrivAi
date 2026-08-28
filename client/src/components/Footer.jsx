import React from 'react';
import { ShieldCheck, Lock, Cpu } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Col 1: Brand & Tagline */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">PrivAI</span>
          </div>
          <p className="text-sm text-slate-400 max-w-md leading-relaxed">
            Privacy-first AI student eligibility verification. Extract document facts, evaluate deterministic rules, and prove claims without exposing raw underlying documents or sensitive PII.
          </p>
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Pre-Hackathon Foundation Phase</span>
          </div>
        </div>

        {/* Col 2: Architecture */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Architecture</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center space-x-2">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span>AI JSON Schema Parser</span>
            </li>
            <li className="flex items-center space-x-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Deterministic Rules Engine</span>
            </li>
            <li className="flex items-center space-x-2">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Private Claim Data Separation</span>
            </li>
          </ul>
        </div>

        {/* Col 3: Pre-Hackathon Disclaimer */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Midnight ZK Roadmap</h4>
          <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            Midnight privacy integration is intentionally reserved for the hackathon implementation phase. Zero-Knowledge proofs will verify eligibility claims on-chain without revealing sensitive student marksheets.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} PrivAI. All rights reserved.</p>
        <p className="mt-2 sm:mt-0 font-mono">Prove it. Don't reveal it.</p>
      </div>
    </footer>
  );
};

export default Footer;
