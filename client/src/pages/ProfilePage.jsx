import React from 'react';
import { User, Mail, ShieldCheck, Cpu, Key, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-white">Student Account & Security</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your account profile and inspect PrivAI security configuration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* User Card */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 md:col-span-2">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-500/20">
              {user?.name ? user.name[0].toUpperCase() : 'S'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user?.name || 'Student User'}</h2>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold uppercase mt-1">
                {user?.role || 'Student'} Account
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div>
              <label className="text-xs text-slate-500 font-semibold block uppercase">Registered Email</label>
              <div className="flex items-center space-x-2 text-sm text-slate-200 mt-1">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{user?.email || 'student@privai.dev'}</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 font-semibold block uppercase">Authentication Method</label>
              <div className="flex items-center space-x-2 text-sm text-slate-200 mt-1">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>JWT Token Auth (Bcrypt Hashed Passwords)</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI System Config Card */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-white">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>AI System Status</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block font-semibold mb-1">Active AI Provider</span>
              <span className="text-cyan-300 font-mono font-bold">Google Gemini API</span>
              <p className="text-[11px] text-slate-400 mt-1">Fallback to Demo Mock Mode if API key absent</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block font-semibold mb-1">Rules Engine Mode</span>
              <span className="text-emerald-400 font-bold">Deterministic Rules Engine</span>
              <p className="text-[11px] text-slate-400 mt-1">Zero LLM hallucination in eligibility decision</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block font-semibold mb-1">Midnight Roadmap</span>
              <span className="text-indigo-400 font-semibold">Pre-Hackathon Foundation</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ProfilePage;
