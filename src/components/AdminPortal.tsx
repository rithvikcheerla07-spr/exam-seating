import React, { useState } from 'react';
import { DatabaseState } from '../db/sqlEngine';
import { AllocationEnriched } from '../types/database';
import { AdminDashboard } from './AdminDashboard';
import { AdminManagement } from './AdminManagement';
import { SQLLab } from './SQLLab';
import { VivaAndDocs } from './VivaAndDocs';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar, 
  Building2, 
  Sparkles, 
  Layers, 
  FileSpreadsheet, 
  Terminal, 
  BookOpen, 
  LogOut, 
  ShieldCheck, 
  Lock,
  RotateCcw
} from 'lucide-react';

interface AdminPortalProps {
  dbState: DatabaseState;
  onUpdateDbState: (newState: DatabaseState) => void;
  onResetDB: () => void;
  enrichedAllocations: AllocationEnriched[];
  isAdminLoggedIn: boolean;
  onAdminLogin: () => void;
  onAdminLogout: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  dbState,
  onUpdateDbState,
  onResetDB,
  enrichedAllocations,
  isAdminLoggedIn,
  onAdminLogin,
  onAdminLogout,
}) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [managementSubTab, setManagementSubTab] = useState<string>('students');

  // Admin login form state
  const [usernameInput, setUsernameInput] = useState('admin');
  const [passwordInput, setPasswordInput] = useState('password123');
  const [loginError, setLoginError] = useState('');

  const handleLoginForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      usernameInput.trim().toLowerCase() === 'admin' &&
      (passwordInput === 'password123' || passwordInput === 'admin123')
    ) {
      onAdminLogin();
      setLoginError('');
    } else {
      setLoginError('Invalid Administrator credentials. Default: admin / password123');
    }
  };

  const handleNavigate = (tab: string, subTab?: string) => {
    setActiveTab(tab);
    if (subTab) {
      setManagementSubTab(subTab);
    }
  };

  // If not logged in, show Admin Login
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
          <div className="text-center">
            <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-blue-700 text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/25 mb-3">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Admin Control Center
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Examination Cell Authority • Full DBMS &amp; CRUD Privileges
            </p>
          </div>

          <form onSubmit={handleLoginForm} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Username
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={e => setUsernameInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="admin"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="password123"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition"
            >
              Sign In as Administrator
            </button>
          </form>

          <div className="pt-4 border-t border-slate-200 text-center">
            <button
              type="button"
              onClick={onAdminLogin}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
            >
              ⚡ One-Click Demo Admin Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sidebarLinks = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'management', label: 'Management & CRUD', icon: Users, subTab: 'students' },
    { id: 'allocation_wizard', label: 'Auto Seating Wizard', icon: Sparkles, direct: true },
    { id: 'grid_view', label: 'Live Seating Map', icon: Layers, direct: true },
    { id: 'reports', label: 'Reports Hub', icon: FileSpreadsheet, direct: true },
    { id: 'sql_lab', label: 'DBMS Testing Lab & SQL', icon: Terminal, highlight: true },
    { id: 'viva_docs', label: 'Viva & Project Report', icon: BookOpen },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Admin Sub-bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {sidebarLinks.map(link => {
            const Icon = link.icon;
            const isSelected =
              activeTab === link.id ||
              (link.direct && activeTab === 'management' && managementSubTab === link.id);

            return (
              <button
                key={link.id}
                onClick={() => {
                  if (link.direct) {
                    setActiveTab('management');
                    setManagementSubTab(link.id);
                  } else {
                    setActiveTab(link.id);
                    if (link.subTab) setManagementSubTab(link.subTab);
                  }
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  isSelected
                    ? link.highlight
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'bg-slate-900 text-white shadow-md'
                    : link.highlight
                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (window.confirm('Reset database state?')) onResetDB();
            }}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50"
            title="Reset DB"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset State</span>
          </button>
          <button
            onClick={onAdminLogout}
            className="flex items-center gap-1 text-xs text-rose-600 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200 font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'dashboard' && (
        <AdminDashboard
          dbState={dbState}
          enrichedAllocations={enrichedAllocations}
          onNavigateTab={handleNavigate}
        />
      )}

      {activeTab === 'management' && (
        <AdminManagement
          dbState={dbState}
          onUpdateDbState={onUpdateDbState}
          enrichedAllocations={enrichedAllocations}
          activeSubTab={managementSubTab}
          onSelectSubTab={setManagementSubTab}
        />
      )}

      {activeTab === 'sql_lab' && (
        <SQLLab
          dbState={dbState}
          onUpdateDbState={onUpdateDbState}
          onResetDB={onResetDB}
        />
      )}

      {activeTab === 'viva_docs' && (
        <VivaAndDocs />
      )}
    </div>
  );
};
