import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  History,
  FileText,
  Search,
  ExternalLink,
  Filter,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { getEligibilityHistory } from '../services/eligibilityService';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterResult, setFilterResult] = useState('ALL'); // 'ALL', 'ELIGIBLE', 'NOT_ELIGIBLE'

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await getEligibilityHistory();
      setHistory(res.history || []);
    } catch (error) {
      console.error('[History Page Error]', error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter((item) => {
    const docName = item.documentId?.originalName || 'Academic Certificate';
    const matchesSearch = docName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterResult === 'ALL' || item.result === filterResult;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* HEADER & FILTERS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Verification Audit Log</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Verification History</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review past student eligibility evaluations and privacy claim digests.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search document name..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={filterResult}
              onChange={(e) => setFilterResult(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Outcomes</option>
              <option value="ELIGIBLE">Eligible Only</option>
              <option value="NOT_ELIGIBLE">Not Eligible Only</option>
            </select>
          </div>

        </div>
      </div>

      {/* TABLE LIST */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-16 text-center space-y-3">
            <Clock className="w-8 h-8 animate-spin text-blue-400 mx-auto" />
            <p className="text-xs text-slate-400">Loading history records...</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <FileText className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No Verification Records Found</h3>
            <p className="text-xs text-slate-400">Try adjusting your search filter or upload a new PDF document.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Document</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">AI Provider</th>
                  <th className="px-6 py-4">Criteria Checks</th>
                  <th className="px-6 py-4">Outcome</th>
                  <th className="px-6 py-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredHistory.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-4 font-medium text-white flex items-center space-x-3">
                      <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span className="truncate max-w-[220px]">
                        {item.documentId?.originalName || 'Academic_Certificate.pdf'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-cyan-400 uppercase">
                      {item.analysisId?.aiProvider || 'gemini'}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-400">CSE: {item.requirements?.branch ? '✓' : '✗'}</span>
                        <span className="text-slate-400">Yr: {item.requirements?.year ? '✓' : '✗'}</span>
                        <span className="text-slate-400">CGPA: {item.requirements?.cgpa ? '✓' : '✗'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.result} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/result/${item._id}`}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-blue-400 transition-colors"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3.5 h-3.5" />
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

export default HistoryPage;
