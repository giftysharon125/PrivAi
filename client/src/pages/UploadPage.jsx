import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { uploadDocument, loadSampleDocument } from '../services/documentService';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setError('');
    if (!selectedFile) return;

    if (
      selectedFile.type !== 'application/pdf' &&
      !selectedFile.name.toLowerCase().endsWith('.pdf')
    ) {
      setError('Only PDF documents are currently supported.');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit. Please select a smaller PDF.');
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!file) return;
    setError('');
    setUploading(true);
    setProgress(0);

    try {
      const res = await uploadDocument(file, (percent) => {
        setProgress(percent);
      });
      // Navigate to AI Analysis page for this document
      navigate(`/analysis/${res.document.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
      setUploading(false);
    }
  };

  const handleSampleSelect = async (sampleType) => {
    setError('');
    setUploading(true);
    try {
      const res = await loadSampleDocument(sampleType);
      navigate(`/analysis/${res.document.id}`);
    } catch (err) {
      setError('Failed to load sample document.');
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Privacy-Preserving Document Processing</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Upload Academic Certificate</h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Upload your marksheet or academic PDF to extract eligibility fields and verify internship requirements.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* DROPZONE CARD */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
            dragActive
              ? 'border-blue-500 bg-blue-500/10'
              : file
              ? 'border-emerald-500/50 bg-emerald-500/5'
              : 'border-slate-800 hover:border-slate-700 bg-slate-900/50'
          }`}
          onClick={() => document.getElementById('file-input').click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          {file ? (
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white truncate max-w-md mx-auto">{file.name}</h4>
                <p className="text-xs text-slate-400 mt-1">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for AI extraction
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-slate-800 text-rose-400 text-xs font-semibold hover:bg-slate-700"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove file</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/10 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/20">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-bold text-white">
                  Drag and drop your academic PDF here
                </p>
                <p className="text-xs text-slate-400">
                  Or click to browse files from your computer (Max 5MB)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* UPLOAD PROGRESS BAR */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Extracting PDF text...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* ANALYZE BUTTON */}
        <button
          onClick={handleUploadAndAnalyze}
          disabled={!file || uploading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white font-bold text-base shadow-xl shadow-blue-500/20 hover:shadow-blue-500/35 transition-all flex items-center justify-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <span>Processing document with AI...</span>
          ) : (
            <>
              <span>Analyze with PrivAI</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

      {/* SAMPLE DEMO ACADEMIC CERTIFICATES */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2 text-sm font-bold text-slate-200">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Or Test with Demo Sample Certificates</span>
        </div>
        <p className="text-xs text-slate-400">
          Click any sample below to evaluate the complete AI extraction and eligibility engine flow without uploading your own file:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          <button
            onClick={() => handleSampleSelect('eligible_cse')}
            disabled={uploading}
            className="p-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-left space-y-1 transition-all group disabled:opacity-50"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
              <span>Sample: Eligible Student</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="text-sm font-bold text-white group-hover:text-blue-300">
              Gifty Sharon (CSE, Year 3, 8.2 CGPA)
            </p>
            <p className="text-[11px] text-slate-400">Passes all internship criteria</p>
          </button>

          <button
            onClick={() => handleSampleSelect('ineligible_cgpa')}
            disabled={uploading}
            className="p-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-left space-y-1 transition-all group disabled:opacity-50"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-rose-400">
              <span>Sample: Below Criteria</span>
              <XCircle className="w-4 h-4" />
            </div>
            <p className="text-sm font-bold text-white group-hover:text-blue-300">
              Alex Morgan (CSE, Year 3, 6.4 CGPA)
            </p>
            <p className="text-[11px] text-slate-400">CGPA below 7.0 requirement</p>
          </button>

        </div>
      </div>

    </div>
  );
};

export default UploadPage;
