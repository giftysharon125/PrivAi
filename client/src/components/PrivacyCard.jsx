import React from 'react';
import { Lock, EyeOff, Share2, ShieldCheck, Info } from 'lucide-react';

const PrivacyCard = ({ studentName = 'Student', proofHash = '' }) => {
  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">What is shared?</h3>
            <p className="text-xs text-slate-400">Zero-Knowledge Data Privacy Guarantee</p>
          </div>
        </div>
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-800 text-cyan-400 border border-cyan-500/30 flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>PrivAI ZK-Ready</span>
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center space-x-3">
            <EyeOff className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-300">Raw PDF Certificate</span>
          </div>
          <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center space-x-1">
            <Lock className="w-3 h-3" />
            <span>PRIVATE</span>
          </span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center space-x-3">
            <EyeOff className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-300">Student Name</span>
          </div>
          <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center space-x-1">
            <Lock className="w-3 h-3" />
            <span>PRIVATE</span>
          </span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center space-x-3">
            <EyeOff className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-300">Exact CGPA & Marksheets</span>
          </div>
          <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center space-x-1">
            <Lock className="w-3 h-3" />
            <span>PRIVATE</span>
          </span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
          <div className="flex items-center space-x-3">
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-300">Internship Eligibility Claim</span>
          </div>
          <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SHAREABLE PROOF</span>
          </span>
        </div>
      </div>

      {proofHash && (
        <div className="mt-4 pt-4 border-t border-slate-800/60">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-400 font-medium">Privacy Proof Hash Digest:</span>
            <span className="text-[10px] text-cyan-400 font-mono">Simulated ZK Digest</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 font-mono text-[11px] text-slate-300 break-all border border-slate-800 select-all">
            {proofHash}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 rounded-xl bg-blue-950/30 border border-blue-800/40 flex items-start space-x-2 text-xs text-blue-300">
        <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <p>
          Recruiters verify the mathematical proof digest without ever holding or storing your underlying academic transcript.
        </p>
      </div>
    </div>
  );
};

export default PrivacyCard;
