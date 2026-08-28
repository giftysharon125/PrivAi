import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Copy,
  Check,
  ArrowRight,
  Share2,
  Lock,
  RotateCcw
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import PrivacyCard from '../components/PrivacyCard';
import { getEligibilityDetails } from '../services/eligibilityService';

const EligibilityResultPage = () => {
  const { id } = useParams();
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      fetchResult();
    }
  }, [id]);

  const fetchResult = async () => {
    try {
      setLoading(true);
      const res = await getEligibilityDetails(id);
      setResultData(res.check);
    } catch (error) {
      console.error('[Result Page Error]', error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyProofDigest = () => {
    if (resultData?.privacyProofHash) {
      navigator.clipboard.writeText(resultData.privacyProofHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <Clock className="w-10 h-10 animate-spin text-blue-400 mx-auto" />
        <p className="text-slate-400 text-sm">Loading eligibility result...</p>
      </div>
    );
  }

  if (!resultData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h3 className="text-xl font-bold text-white">Result Not Found</h3>
        <p className="text-xs text-slate-400">Could not find eligibility check record with ID: {id}</p>
        <Link to="/dashboard" className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const isEligible = resultData.result === 'ELIGIBLE';
  const reqs = resultData.requirements || {};
  const config = resultData.requirementsConfig || {};
  const extracted = resultData.analysisId?.extractedFields || {};

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* GRAND HERO STATUS BANNER */}
      <div
        className={`glass-panel p-8 sm:p-10 rounded-3xl border relative overflow-hidden text-center space-y-6 ${
          isEligible
            ? 'border-emerald-500/40 bg-gradient-to-b from-emerald-950/30 via-slate-950 to-slate-950'
            : 'border-rose-500/40 bg-gradient-to-b from-rose-950/30 via-slate-950 to-slate-950'
        }`}
      >
        <div className="space-y-4">
          <div
            className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-2xl ${
              isEligible
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-emerald-500/20'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-rose-500/20'
            }`}
          >
            {isEligible ? <CheckCircle2 className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
          </div>

          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest font-bold text-slate-400">
              Evaluation Outcome
            </span>
            <h1
              className={`text-4xl sm:text-5xl font-black tracking-tight ${
                isEligible ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isEligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}
            </h1>
            <p className="text-xs text-slate-400 pt-1">
              Evaluated against Private Student Internship Verification criteria
            </p>
          </div>
        </div>

        {/* Quick Proof Copy Bar */}
        <div className="max-w-md mx-auto p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
          <div className="truncate text-left mr-2">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Verification Proof Hash</span>
            <span className="font-mono text-cyan-400 text-[11px] truncate block">{resultData.privacyProofHash}</span>
          </div>
          <button
            onClick={copyProofDigest}
            className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30 font-semibold text-[11px] flex items-center space-x-1 flex-shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Proof'}</span>
          </button>
        </div>
      </div>

      {/* REQUIREMENTS BREAKDOWN MATRIX */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Eligibility Criteria Breakdown</h3>
            <p className="text-xs text-slate-400">Deterministic Rule Evaluation Matrix</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {new Date(resultData.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Requirement</th>
                <th className="px-4 py-3">Required Rule</th>
                <th className="px-4 py-3">Extracted Fact</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              
              {/* Rule 1: Student Status */}
              <tr className="hover:bg-slate-900/40">
                <td className="px-4 py-3.5 font-semibold text-white">Student Status</td>
                <td className="px-4 py-3.5 text-xs text-slate-400">Active Enrollment Required</td>
                <td className="px-4 py-3.5 text-xs font-mono text-slate-300">
                  {extracted.studentStatus ? 'Active Student' : 'Inactive / Unknown'}
                </td>
                <td className="px-4 py-3.5 text-right">
                  <StatusBadge status={reqs.studentStatus} size="sm" />
                </td>
              </tr>

              {/* Rule 2: Branch */}
              <tr className="hover:bg-slate-900/40">
                <td className="px-4 py-3.5 font-semibold text-white">Branch Requirement</td>
                <td className="px-4 py-3.5 text-xs text-slate-400">Must match '{config.requiredBranch || 'CSE'}'</td>
                <td className="px-4 py-3.5 text-xs font-mono text-slate-300">
                  {extracted.branch || 'CSE'}
                </td>
                <td className="px-4 py-3.5 text-right">
                  <StatusBadge status={reqs.branch} size="sm" />
                </td>
              </tr>

              {/* Rule 3: Academic Year */}
              <tr className="hover:bg-slate-900/40">
                <td className="px-4 py-3.5 font-semibold text-white">Year Requirement</td>
                <td className="px-4 py-3.5 text-xs text-slate-400">Year &ge; {config.minimumYear || 3}</td>
                <td className="px-4 py-3.5 text-xs font-mono text-slate-300">
                  Year {extracted.year || 0}
                </td>
                <td className="px-4 py-3.5 text-right">
                  <StatusBadge status={reqs.year} size="sm" />
                </td>
              </tr>

              {/* Rule 4: CGPA */}
              <tr className="hover:bg-slate-900/40">
                <td className="px-4 py-3.5 font-semibold text-white">CGPA Requirement</td>
                <td className="px-4 py-3.5 text-xs text-slate-400">CGPA &ge; {config.minimumCGPA || 7.0}</td>
                <td className="px-4 py-3.5 text-xs font-mono text-slate-300">
                  CGPA {extracted.cgpa || 0}
                </td>
                <td className="px-4 py-3.5 text-right">
                  <StatusBadge status={reqs.cgpa} size="sm" />
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {/* PRIVACY UX ("WHAT IS SHARED?") */}
      <PrivacyCard proofHash={resultData.privacyProofHash} />

      {/* ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <Link
          to="/upload"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-xs flex items-center justify-center space-x-2 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Verify Another Document</span>
        </Link>

        <Link
          to="/history"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg flex items-center justify-center space-x-2 transition-all"
        >
          <span>View Verification History</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};

export default EligibilityResultPage;
