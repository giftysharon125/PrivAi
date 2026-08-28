import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  TrendingUp,
  PlusCircle,
  ArrowRight,
  Sparkles,
  Clock,
  ExternalLink
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { getEligibilityHistory } from '../services/eligibilityService';
import { getUserDocuments, loadSampleDocument } from '../services/documentService';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [demoLoading, setDemoLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [histRes, docRes] = await Promise.all([
        getEligibilityHistory(),
        getUserDocuments()
      ]);
      setHistory(histRes.history || []);
      setDocuments(docRes.documents || []);
    } catch (error) {
      console.error('[Dashboard Error]', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSampleUpload = async (sampleType) => {
    try {
      setDemoLoading(true);
      const sampleRes = await loadSampleDocument(sampleType);
      navigate(`/analysis/${sampleRes.document.id}`);
    } catch (error) {
      console.error('[Sample Upload Error]', error.message);
    } finally {
      setDemoLoading(false);
    }
  };

  // Metrics Calculation
  const totalAnalyzedDocs = documents.length;
  const totalChecks = history.length;
  const eligibleCount = history.filter((h) => h.result === 'ELIGIBLE').length;
  const ineligibleCount = history.filter((h) => h.result === 'NOT_ELIGIBLE').length;
  const passRate = totalChecks > 0 ? Math.round((eligibleCount / totalChecks) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* HEADER BANNER */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PrivAI Verification Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {user?.name || 'Student'}!
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Private student internship eligibility verification dashboard.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/upload"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 flex items-center space-x-2 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Upload Document</span>
            </Link>
          </div>
        </div>
      </div>

      {/* METRICS STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Documents Analyzed</span>
            <FileText className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-white">{totalAnalyzedDocs}</div>
          <p className="text-[11px] text-slate-400">Uploaded & extracted</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Eligibility Checks</span>
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white">{totalChecks}</div>
          <p className="text-[11px] text-slate-400">Deterministic rule evaluations</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Eligible Claims</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">{eligibleCount}</div>
          <p className="text-[11px] text-slate-400">{ineligibleCount} Not Eligible</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Qualification Rate</span>
            <TrendingUp className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-cyan-400">{passRate}%</div>
          <p className="text-[11px] text-slate-400">Passing criteria match</p>
        </div>

      </div>

      {/* QUICK DEMO TRYOUT BANNER */}
      <div className="glass-panel p-6 rounded-2xl border border-blue-500/20 bg-slate-900/60 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-blue-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Instant Demo Mode</span>
            </div>
            <h3 className="text-lg font-bold text-white">Don't have a PDF ready?</h3>
            <p className="text-xs text-slate-400">
              Test AI extraction & deterministic rules instantly using pre-loaded academic certificates.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleQuickSampleUpload('eligible_cse')}
              disabled={demoLoading}
              className="px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold transition-all disabled:opacity-50"
            >
              ⚡ Test Eligible CSE (3rd Yr, 8.2 CGPA)
            </button>
            <button
              onClick={() => handleQuickSampleUpload('ineligible_cgpa')}
              disabled={demoLoading}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-all disabled:opacity-50"
            >
              ⚡ Test Low CGPA (6.4 CGPA)
            </button>
          </div>
        </div>
      </div>

      {/* RECENT VERIFICATION REQUESTS TABLE */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Recent Verification Requests</h3>
            <p className="text-xs text-slate-400">Your latest document eligibility evaluations</p>
          </div>
          <Link
            to="/history"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
          >
            <span>View All History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm space-y-2">
            <Clock className="w-6 h-6 animate-spin mx-auto text-blue-400" />
            <p>Loading verification history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <FileText className="w-12 h-12 text-slate-600 mx-auto" />
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">No Verification Checks Yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Upload your academic PDF or load a sample document to generate your first eligibility claim proof.
              </p>
            </div>
            <Link
              to="/upload"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Verify First Document</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Document</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Branch</th>
                  <th className="px-6 py-3.5">Year / CGPA</th>
                  <th className="px-6 py-3.5">Eligibility Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {history.slice(0, 5).map((item) => (
                  <tr key={item._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-4 font-medium text-white flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span className="truncate max-w-[200px]">
                        {item.documentId?.originalName || 'Academic_Certificate.pdf'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {item.analysisId?.extractedFields?.branch || 'CSE'}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono">
                      Yr {item.analysisId?.extractedFields?.year || 3} | {item.analysisId?.extractedFields?.cgpa || 8.0}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.result} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/result/${item._id}`}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-blue-400"
                      >
                        <span>View Result</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default DashboardPage;
