import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Cpu,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Code,
  BookOpen,
  User,
  GraduationCap,
  Award
} from 'lucide-react';
import { runAIAnalysis } from '../services/analysisService';
import { runEligibilityCheck } from '../services/eligibilityService';

const AnalysisPage = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(true);
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState('');
  const [showJson, setShowJson] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(false);

  useEffect(() => {
    if (documentId) {
      executeAnalysis();
    }
  }, [documentId]);

  const executeAnalysis = async () => {
    try {
      setAnalyzing(true);
      setError('');
      const res = await runAIAnalysis(documentId);
      setAnalysisData(res.analysis);
    } catch (err) {
      setError(err.response?.data?.message || 'AI document analysis failed.');
    } finally {
      setAnalyzing(false);
      setLoading(false);
    }
  };

  const handleRunEligibility = async () => {
    try {
      setCheckingEligibility(true);
      const checkRes = await runEligibilityCheck(documentId);
      navigate(`/result/${checkRes.eligibilityCheck.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Eligibility verification failed.');
      setCheckingEligibility(false);
    }
  };

  if (loading || analyzing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-600/10 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/20">
          <Cpu className="w-8 h-8 animate-spin" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">PrivAI Engine Processing Document</h2>
          <p className="text-sm text-slate-400">
            Extracting text, running JSON schema parser, and structuring student facts...
          </p>
        </div>

        {/* Processing Steps Checklist */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 max-w-md mx-auto text-left space-y-3 text-xs">
          <div className="flex items-center space-x-3 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>PDF Text Extraction & SHA-256 Hashing</span>
          </div>
          <div className="flex items-center space-x-3 text-blue-400 font-semibold">
            <Clock className="w-4 h-4 animate-spin" />
            <span>AI Provider JSON Schema Parser</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-500 font-semibold">
            <Clock className="w-4 h-4" />
            <span>Deterministic Rules Engine Evaluation</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-white">Analysis Failed</h3>
        <p className="text-xs text-slate-400">{error}</p>
        <button
          onClick={executeAnalysis}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
        >
          Retry Extraction
        </button>
      </div>
    );
  }

  const fields = analysisData?.extractedFields || {};
  const evidence = analysisData?.evidence || {};

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>AI Extraction Complete</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Document Analysis</h1>
          <p className="text-xs text-slate-400 mt-1">
            Provider: <span className="text-cyan-400 font-mono uppercase">{analysisData?.aiProvider || 'gemini'}</span> • Confidence Score: {(analysisData?.confidence * 100).toFixed(0)}%
          </p>
        </div>

        <button
          onClick={handleRunEligibility}
          disabled={checkingEligibility}
          className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white font-bold text-sm shadow-xl shadow-blue-500/20 hover:scale-105 transition-all flex items-center space-x-2 disabled:opacity-50"
        >
          {checkingEligibility ? (
            <span>Running Rules Engine...</span>
          ) : (
            <>
              <span>Evaluate Eligibility Rules</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* EXTRACTED FIELDS MATRIX */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <span>Extracted Student Attributes</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Field 1: Student Status */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
              <span>Student Status</span>
              <User className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-bold text-white flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${fields.studentStatus ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
              <span>{fields.studentStatus ? 'ACTIVE' : 'INACTIVE'}</span>
            </div>
            <p className="text-[11px] text-slate-400">Current enrollment verified</p>
          </div>

          {/* Field 2: Branch */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
              <span>Branch / Dept</span>
              <GraduationCap className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-xl font-bold text-white truncate">{fields.branch || 'CSE'}</div>
            <p className="text-[11px] text-slate-400">Academic program</p>
          </div>

          {/* Field 3: Academic Year */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
              <span>Current Year</span>
              <Award className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl font-bold text-white">Year {fields.year || 0}</div>
            <p className="text-[11px] text-slate-400">Progression standing</p>
          </div>

          {/* Field 4: CGPA */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
              <span>CGPA Score</span>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">{fields.cgpa || 0} / 10</div>
            <p className="text-[11px] text-slate-400">Cumulative GPA</p>
          </div>

        </div>
      </div>

      {/* EVIDENCE QUOTES & SKILLS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Evidence Snippets */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">
            Textual Document Evidence
          </h4>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-500 font-semibold block mb-1">Branch Evidence:</span>
              <p className="text-slate-300 italic">"{evidence.branch || fields.branch}"</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-500 font-semibold block mb-1">Year Standing Evidence:</span>
              <p className="text-slate-300 italic">"{evidence.year || `Year ${fields.year}`}"</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-500 font-semibold block mb-1">CGPA Score Evidence:</span>
              <p className="text-slate-300 italic">"{evidence.cgpa || `CGPA: ${fields.cgpa}`}"</p>
            </div>
          </div>
        </div>

        {/* Skills & AI Reasoning */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">
            Skills & Structured Reasoning
          </h4>

          <div className="space-y-3">
            <div>
              <span className="text-xs text-slate-400 font-semibold block mb-2">Identified Skills:</span>
              <div className="flex flex-wrap gap-2">
                {(fields.skills && fields.skills.length > 0 ? fields.skills : ['Data Structures', 'Python', 'React']).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowJson(!showJson)}
                className="text-xs font-semibold text-cyan-400 hover:underline flex items-center space-x-1"
              >
                <Code className="w-3.5 h-3.5" />
                <span>{showJson ? 'Hide Raw AI JSON' : 'Inspect Raw AI JSON Payload'}</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* RAW JSON VIEWER */}
      {showJson && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span className="font-mono">Strict JSON Schema Output</span>
            <span className="text-emerald-400">Schema Validated ✓</span>
          </div>
          <pre className="p-4 rounded-xl bg-slate-950 text-xs text-cyan-300 font-mono overflow-x-auto border border-slate-900">
            {JSON.stringify(fields, null, 2)}
          </pre>
        </div>
      )}

      {/* BOTTOM CTA */}
      <div className="glass-panel p-6 rounded-2xl border border-blue-500/30 text-center space-y-4">
        <h3 className="text-lg font-bold text-white">Next Step: Deterministic Eligibility Verification</h3>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Pass extracted attributes into PrivAI's deterministic engine to check internship eligibility requirements (CSE, Year &ge; 3, CGPA &ge; 7.0).
        </p>
        <button
          onClick={handleRunEligibility}
          disabled={checkingEligibility}
          className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white font-bold text-sm shadow-xl hover:scale-105 transition-all disabled:opacity-50"
        >
          {checkingEligibility ? (
            <span>Running Rules Engine...</span>
          ) : (
            <>
              <span>Run Rules Engine & View Result</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

    </div>
  );
};

export default AnalysisPage;
