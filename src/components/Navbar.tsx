import React from 'react';
import { 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  Database, 
  RotateCcw, 
  LogOut, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  currentPortal: 'admin' | 'portal';
  onSelectPortal: (portal: 'admin' | 'portal') => void;
  userRole: 'admin' | 'student' | 'faculty' | null;
  userName?: string;
  userRollNo?: string;
  onLogout: () => void;
  onQuickLogin: (role: 'admin' | 'student' | 'faculty') => void;
  onResetDB: () => void;
  totalStudents: number;
  totalAllocations: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPortal,
  onSelectPortal,
  userRole,
  userName,
  userRollNo,
  onLogout,
  onQuickLogin,
  onResetDB,
  totalStudents,
  totalAllocations,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white shadow-lg">
      {/* Top institution bar */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 px-4 py-1.5 text-xs flex justify-between items-center text-blue-100">
        <div className="flex items-center gap-2 font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>CAMPUS EXAMINATION CELL • RELATIONAL DBMS VERIFIED</span>
          <span className="hidden sm:inline text-blue-300">|</span>
          <span className="hidden sm:inline text-blue-200">MySQL 8.0 & 3NF Normalization Active</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-blue-800/80 px-2 py-0.5 rounded text-[11px] font-mono border border-blue-400/30">
            {totalAllocations} / {totalStudents} Allocated
          </span>
          <button
            onClick={() => {
              if (window.confirm('Reset database to clean initial seed data (300 students, 15 halls, 900 seats)?')) {
                onResetDB();
              }
            }}
            title="Reset Database to initial state"
            className="flex items-center gap-1 text-[11px] hover:text-white bg-blue-950/60 hover:bg-blue-900 px-2 py-0.5 rounded transition border border-blue-500/30"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset DB</span>
          </button>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-bold text-xl border border-blue-400/30">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
              Exam Hall &amp; Seating System
              <span className="text-[10px] uppercase font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded">
                Final Year CBP
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Automated Collision-Free Examination Allocation Platform
            </p>
          </div>
        </div>

        {/* Portals Switcher */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 flex items-center shadow-inner">
            <button
              onClick={() => onSelectPortal('portal')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                currentPortal === 'portal'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-blue-300" />
              <span>Student &amp; Faculty Portal</span>
              <span className="text-[10px] bg-slate-900/60 px-1.5 py-0.2 rounded font-normal text-blue-200">
                View Only
              </span>
            </button>

            <button
              onClick={() => onSelectPortal('admin')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                currentPortal === 'admin'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Admin Portal</span>
              <span className="text-[10px] bg-indigo-950/70 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 rounded font-normal">
                Full Control &amp; SQL Lab
              </span>
            </button>
          </div>

          {/* Quick Demo Login Switcher */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs border-l border-slate-800 pl-4">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Test Login:
            </span>
            <button
              onClick={() => onQuickLogin('student')}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded border border-slate-700 transition"
              title="Quick login as Student 23CS001"
            >
              Student (23CS001)
            </button>
            <button
              onClick={() => onQuickLogin('faculty')}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded border border-slate-700 transition"
              title="Quick login as Faculty FAC101"
            >
              Faculty (FAC101)
            </button>
            <button
              onClick={() => onQuickLogin('admin')}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded border border-slate-700 transition"
              title="Quick login as Admin"
            >
              Admin
            </button>
          </div>

          {/* User profile / Logout */}
          {userRole && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="hidden md:block text-right">
                <div className="text-xs font-semibold text-white leading-tight">
                  {userName || userRollNo}
                </div>
                <div className="text-[10px] uppercase font-mono text-blue-400">
                  {userRole}
                </div>
              </div>
              <button
                onClick={onLogout}
                title="Log out"
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
