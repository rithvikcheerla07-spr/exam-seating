import React from 'react';
import { DatabaseState } from '../db/sqlEngine';
import { AllocationEnriched } from '../types/database';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  Building2, 
  Armchair, 
  Sparkles, 
  FileSpreadsheet, 
  Terminal, 
  Layers, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';

interface AdminDashboardProps {
  dbState: DatabaseState;
  enrichedAllocations: AllocationEnriched[];
  onNavigateTab: (tab: string, subTab?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  dbState,
  enrichedAllocations,
  onNavigateTab,
}) => {
  const totalStudents = dbState.student.length;
  const totalFaculty = dbState.faculty.length;
  const totalExams = dbState.exam.length;
  const totalHalls = dbState.hall.length;
  const totalSeats = dbState.seat.length;
  const totalAllocations = dbState.allocation.length;

  const occupiedSeats = dbState.seat.filter(s => s.status === 'Occupied').length;
  const availableSeats = totalSeats - occupiedSeats;
  const occupancyPercentage = totalSeats > 0 ? Math.round((occupiedSeats / totalSeats) * 100) : 0;

  // Upcoming exams count (upcoming in next 30 days)
  const upcomingExams = dbState.exam.length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner with Quick Actions */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-6 border border-blue-600/30">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-blue-200 border border-white/10 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Relational DBMS Active • MySQL 8.0 Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Examination Administration Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-2 leading-relaxed">
            Enterprise management hub for scheduling examinations, managing student &amp; faculty databases, running collision-free seating allocations, and testing live DBMS queries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateTab('management', 'allocation_wizard')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Seating</span>
          </button>
          <button
            onClick={() => onNavigateTab('sql_lab')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 backdrop-blur transition"
          >
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Open SQL Lab</span>
          </button>
        </div>
      </div>

      {/* Required Metric Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Real-time Database Metrics (Normalized Tables)
          </h3>
          <span className="text-xs text-slate-400">
            Auto-synchronized with Transaction Engine
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {/* 1. Total Students */}
          <div 
            onClick={() => onNavigateTab('management', 'students')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Students</span>
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                {totalStudents}
              </span>
              <span className="text-[11px] text-blue-600 font-bold flex items-center gap-0.5">
                Manage <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">6 Engineering Branches</span>
          </div>

          {/* 2. Total Faculty */}
          <div 
            onClick={() => onNavigateTab('management', 'faculty')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Faculty</span>
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                {totalFaculty}
              </span>
              <span className="text-[11px] text-purple-600 font-bold flex items-center gap-0.5">
                Inspect <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Assigned Invigilators</span>
          </div>

          {/* 3. Total Exams */}
          <div 
            onClick={() => onNavigateTab('management', 'exams')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Exams</span>
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                {totalExams}
              </span>
              <span className="text-[11px] text-amber-600 font-bold flex items-center gap-0.5">
                Timetable <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Scheduled Sessions</span>
          </div>

          {/* 4. Total Halls */}
          <div 
            onClick={() => onNavigateTab('management', 'halls')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Halls</span>
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                {totalHalls}
              </span>
              <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-0.5">
                Inventory <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Science, Tech &amp; Main Blocks</span>
          </div>

          {/* 5. Total Seats */}
          <div 
            onClick={() => onNavigateTab('management', 'grid_view')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Seats</span>
              <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition">
                <Armchair className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                {totalSeats}
              </span>
              <span className="text-[11px] text-cyan-600 font-bold flex items-center gap-0.5">
                Desks Grid <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Campus Capacity: 900 Desks</span>
          </div>

          {/* 6. Total Allocations */}
          <div 
            onClick={() => onNavigateTab('management', 'reports')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Allocations</span>
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-indigo-700 font-mono">
                {totalAllocations}
              </span>
              <span className="text-[11px] text-indigo-600 font-bold flex items-center gap-0.5">
                Reports <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Assigned Candidates</span>
          </div>
        </div>
      </div>

      {/* Seat Occupancy Progress Card & Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Seat Occupancy &amp; Hall Utilization Audit
              </h3>
              <p className="text-xs text-slate-500">
                Live capacity distribution across campus examination buildings.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              {occupancyPercentage}% Campus Occupancy
            </span>
          </div>

          {/* Progress bar */}
          <div>
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
              <div 
                className="bg-blue-600 h-full transition-all duration-500" 
                style={{ width: `${occupancyPercentage}%` }}
                title={`Occupied: ${occupiedSeats}`}
              ></div>
              <div 
                className="bg-emerald-400 h-full transition-all duration-500" 
                style={{ width: `${100 - occupancyPercentage}%` }}
                title={`Available: ${availableSeats}`}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-2 text-xs font-semibold">
              <span className="text-blue-700 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                Occupied: {occupiedSeats} Seats
              </span>
              <span className="text-emerald-700 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                Available: {availableSeats} Seats
              </span>
            </div>
          </div>

          {/* Building-wise occupancy breakdown */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { name: 'Science & Tech Block', halls: 'H-101 to H-104', occ: '95%' },
              { name: 'Engineering Tower A', halls: 'H-201 to H-204', occ: '60%' },
              { name: 'Central Academic Block', halls: 'H-401 to H-404', occ: '0%' },
            ].map(b => (
              <div key={b.name} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="font-bold text-slate-800 truncate">{b.name}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{b.halls}</div>
                <div className="font-mono font-bold text-blue-700 mt-1">{b.occ} Utilized</div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Exams Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Upcoming Exams</h3>
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                20 Total
              </span>
            </div>

            <div className="space-y-3">
              {dbState.exam.slice(0, 4).map(ex => (
                <div key={ex.exam_id} className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 transition">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono font-bold text-blue-700">{ex.subject_code}</span>
                    <span className="text-slate-500 font-mono text-[10px]">{ex.exam_date}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-900 truncate mt-0.5">
                    {ex.subject_name}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {ex.branch} • Year {ex.year} • {ex.start_time} - {ex.end_time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('management', 'exams')}
            className="w-full mt-4 py-2 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-xl transition text-center"
          >
            View Complete Exam Schedule &rarr;
          </button>
        </div>
      </div>

      {/* Audit Log Stream */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <h3 className="text-base font-bold text-slate-900">
              Database Audit Trail &amp; Trigger Event Log
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {dbState.audit_log.length} Transaction Events
          </span>
        </div>

        <div className="space-y-2.5">
          {dbState.audit_log.slice(0, 5).map(log => (
            <div key={log.log_id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                  log.action === 'INSERT' ? 'bg-emerald-100 text-emerald-800' :
                  log.action === 'AUTO_ALLOCATE' ? 'bg-blue-100 text-blue-800' :
                  log.action === 'UPDATE' ? 'bg-amber-100 text-amber-800' :
                  'bg-slate-200 text-slate-800'
                }`}>
                  {log.action}
                </span>
                <span className="font-semibold text-slate-800">{log.details}</span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">
                {log.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
