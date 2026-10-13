import React, { useState, useMemo } from 'react';
import { 
  Student, 
  Faculty, 
  AllocationEnriched, 
  Hall, 
  Seat, 
  Exam 
} from '../types/database';
import { SeatingGridVisualizer } from './SeatingGridVisualizer';
import { 
  GraduationCap, 
  Search, 
  Printer, 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  QrCode, 
  Layers, 
  BookOpen, 
  UserCheck, 
  Lock
} from 'lucide-react';

interface StudentFacultyPortalProps {
  students: Student[];
  facultyList: Faculty[];
  halls: Hall[];
  seats: Seat[];
  exams: Exam[];
  allocations: AllocationEnriched[];
  activeUser: { role: 'student' | 'faculty'; student?: Student; faculty?: Faculty } | null;
  onLogin: (role: 'student' | 'faculty', user: Student | Faculty) => void;
  onLogout: () => void;
}

export const StudentFacultyPortal: React.FC<StudentFacultyPortalProps> = ({
  students,
  facultyList,
  halls,
  seats,
  exams,
  allocations,
  activeUser,
  onLogin,
  onLogout,
}) => {
  // Login form state
  const [loginTab, setLoginTab] = useState<'student' | 'faculty'>('student');
  const [rollNoInput, setRollNoInput] = useState('');
  const [facultyIdInput, setFacultyIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Faculty view filters and search
  const [facultySelectedHall, setFacultySelectedHall] = useState<string>('H-101');
  const [facultySearchTerm, setFacultySearchTerm] = useState('');
  const [facultyFilterSubject, setFacultyFilterSubject] = useState('');

  // Quick Demo Logins
  const handleDemoStudent = (roll: string) => {
    const student = students.find(s => s.roll_no.toLowerCase() === roll.toLowerCase());
    if (student) {
      onLogin('student', student);
    }
  };

  const handleDemoFaculty = (facId: string) => {
    const fac = facultyList.find(f => f.faculty_id.toLowerCase() === facId.toLowerCase());
    if (fac) {
      onLogin('faculty', fac);
    }
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (loginTab === 'student') {
      const student = students.find(
        s => s.roll_no.trim().toLowerCase() === rollNoInput.trim().toLowerCase()
      );
      if (student) {
        if (!passwordInput || student.password === passwordInput || passwordInput === 'password123') {
          onLogin('student', student);
          return;
        }
      }
      setLoginError('Invalid Roll Number or Password. Try Roll No: 23CS001, Pass: password123');
    } else {
      const fac = facultyList.find(
        f => f.faculty_id.trim().toLowerCase() === facultyIdInput.trim().toLowerCase()
      );
      if (fac) {
        if (!passwordInput || fac.password === passwordInput || passwordInput === 'password123') {
          onLogin('faculty', fac);
          return;
        }
      }
      setLoginError('Invalid Faculty ID or Password. Try Faculty ID: FAC101, Pass: password123');
    }
  };

  // Student specific data
  const studentAllocations = useMemo(() => {
    if (activeUser?.role !== 'student' || !activeUser.student) return [];
    return allocations.filter(
      a => a.roll_no.toLowerCase() === activeUser.student!.roll_no.toLowerCase()
    );
  }, [allocations, activeUser]);

  // Faculty specific data
  const filteredHallAllocations = useMemo(() => {
    let result = allocations.filter(a => a.hall_number === facultySelectedHall);
    if (facultySearchTerm.trim()) {
      const term = facultySearchTerm.toLowerCase();
      result = result.filter(
        a =>
          a.roll_no.toLowerCase().includes(term) ||
          a.student_name.toLowerCase().includes(term) ||
          a.subject_name.toLowerCase().includes(term) ||
          a.subject_code.toLowerCase().includes(term)
      );
    }
    if (facultyFilterSubject) {
      result = result.filter(a => a.subject_code === facultyFilterSubject);
    }
    return result;
  }, [allocations, facultySelectedHall, facultySearchTerm, facultyFilterSubject]);

  // IF NOT LOGGED IN -> RENDER MODERN LOGIN PORTAL
  if (!activeUser) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
          <div className="text-center">
            <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/20 mb-3">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Student &amp; Faculty Portal
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Read-Only Access • View Admit Card &amp; Examination Hall Seating
            </p>
          </div>

          {/* Read Only Notice Badge */}
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">Notice:</span> Strict Read-Only Mode. Only <code className="font-mono font-bold bg-amber-100 px-1 rounded">SELECT</code> operations allowed for students and faculty.
            </div>
          </div>

          {/* Portal Tabs: Student vs Faculty */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => { setLoginTab('student'); setLoginError(''); }}
              className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition ${
                loginTab === 'student'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Student Login
            </button>
            <button
              onClick={() => { setLoginTab('faculty'); setLoginError(''); }}
              className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition ${
                loginTab === 'faculty'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Faculty Login
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleFormLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium">
                {loginError}
              </div>
            )}

            {loginTab === 'student' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  University Roll Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 23CS001, 23EC001, 23IT001"
                  value={rollNoInput}
                  onChange={e => setRollNoInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                  required
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Faculty Employee ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. FAC101, FAC102, FAC103"
                  value={facultyIdInput}
                  onChange={e => setFacultyIdInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password (default: password123)"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Demo default password is <code className="bg-slate-100 px-1 rounded">password123</code>
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition"
            >
              Sign In to {loginTab === 'student' ? 'Student' : 'Faculty'} Portal
            </button>
          </form>

          {/* Quick Demo Login Helpers */}
          <div className="pt-4 border-t border-slate-200">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick One-Click Demo Logins:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleDemoStudent('23CS001')}
                className="p-2 text-left bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-blue-900 font-medium transition"
              >
                <div className="font-bold text-[11px]">Student: 23CS001</div>
                <div className="text-[10px] text-blue-700">Aarav Sharma (CSE)</div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoStudent('23EC001')}
                className="p-2 text-left bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-blue-900 font-medium transition"
              >
                <div className="font-bold text-[11px]">Student: 23EC001</div>
                <div className="text-[10px] text-blue-700">Aditya Verma (ECE)</div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFaculty('FAC101')}
                className="p-2 text-left bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-purple-900 font-medium transition"
              >
                <div className="font-bold text-[11px]">Faculty: FAC101</div>
                <div className="text-[10px] text-purple-700">Dr. Arun Sharma</div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFaculty('FAC102')}
                className="p-2 text-left bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-purple-900 font-medium transition"
              >
                <div className="font-bold text-[11px]">Faculty: FAC102</div>
                <div className="text-[10px] text-purple-700">Dr. Priya Verma</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // LOGGED IN VIEW: STUDENT PORTAL
  // =========================================================================
  if (activeUser.role === 'student' && activeUser.student) {
    const student = activeUser.student;
    const primaryAlloc = studentAllocations[0];

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Read-Only Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span>Student View-Only Mode Active</span>
                <span className="text-[10px] bg-blue-200 text-blue-800 font-mono px-2 py-0.5 rounded font-bold">
                  SELECT ONLY
                </span>
              </div>
              <p className="text-xs text-slate-500">
                You have read-only access to view exam hall tickets, subject schedules, and seating layouts. No INSERT/UPDATE/DELETE permissions.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl shadow-sm transition"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print Hall Ticket</span>
            </button>
            <button
              onClick={onLogout}
              className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Digital Hall Ticket / Admit Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Admit Card Top Header */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white border-b border-blue-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center font-bold text-2xl text-blue-300">
                🏛️
              </div>
              <div>
                <span className="text-xs text-blue-300 uppercase tracking-widest font-semibold block">
                  CONTROLLER OF EXAMINATIONS • OFFICIAL ADMIT CARD
                </span>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  Semester End Examination Hall Ticket
                </h2>
                <p className="text-xs text-slate-300">
                  Academic Session 2026-2027 • Relational Allocation Verified
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur px-4 py-2 rounded-2xl border border-white/10">
              <QrCode className="w-10 h-10 text-white" />
              <div className="text-right">
                <div className="text-[10px] text-blue-200 uppercase font-mono">Roll Verification</div>
                <div className="font-mono font-bold text-sm tracking-wider text-white">{student.roll_no}</div>
              </div>
            </div>
          </div>

          {/* Student Profile Info Grid */}
          <div className="p-6 bg-slate-50/50 border-b border-slate-200">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Student Name</span>
                <span className="font-bold text-slate-900 text-sm">{student.student_name}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Roll Number</span>
                <span className="font-bold text-blue-700 text-sm font-mono">{student.roll_no}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Branch</span>
                <span className="font-bold text-slate-900 text-sm">{student.branch}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Year &amp; Section</span>
                <span className="font-bold text-slate-900 text-sm">Year {student.year} • Sec {student.section}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Gender</span>
                <span className="font-bold text-slate-900 text-sm">{student.gender}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Registered Email</span>
                <span className="font-medium text-slate-700 text-xs truncate block">{student.email}</span>
              </div>
            </div>
          </div>

          {/* Student Seating Table */}
          <div className="p-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Allocated Examination Schedule &amp; Seating Details</span>
            </h3>

            {studentAllocations.length === 0 ? (
              <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                No active exam seat allocated yet for roll number {student.roll_no}. Contact Examination Cell.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-[10px] tracking-wider border-y border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4">Date &amp; Time</th>
                      <th className="py-3 px-4">Exam Hall</th>
                      <th className="py-3 px-4">Building &amp; Floor</th>
                      <th className="py-3 px-4">Seat Number</th>
                      <th className="py-3 px-4 text-center">Row / Col</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentAllocations.map(alloc => (
                      <tr key={alloc.allocation_id} className="hover:bg-blue-50/40 transition">
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 block">{alloc.subject_code}</span>
                          <span className="text-slate-500 text-[11px]">{alloc.subject_name}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          <span className="font-semibold text-slate-800 block">{alloc.exam_date}</span>
                          <span className="text-blue-600 text-[11px]">{alloc.start_time} - {alloc.end_time}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 text-sm font-mono bg-blue-100 text-blue-800 px-2.5 py-1 rounded-lg">
                            {alloc.hall_number}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-medium text-slate-800 block">{alloc.building}</span>
                          <span className="text-slate-500 text-[11px]">Floor {alloc.floor}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-extrabold text-blue-700 text-base">
                            {alloc.seat_number}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-semibold">
                          Row {alloc.row_number} • Col {alloc.column_number}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Confirmed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Live Visual Hall Map for Student */}
        {primaryAlloc && (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Visual Hall Map: Find Your Desk in {primaryAlloc.hall_number}</span>
              </h3>
              <p className="text-xs text-slate-500">
                Your assigned seat ({primaryAlloc.seat_number}) is highlighted below with an animated indicator.
              </p>
            </div>

            <SeatingGridVisualizer
              halls={halls}
              seats={seats}
              allocations={allocations}
              selectedHallId={primaryAlloc.hall_id}
              highlightedStudentRollNo={student.roll_no}
              isReadOnly={true}
            />
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // LOGGED IN VIEW: FACULTY PORTAL
  // =========================================================================
  if (activeUser.role === 'faculty' && activeUser.faculty) {
    const faculty = activeUser.faculty;

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Read Only Banner */}
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span>Faculty Invigilation Mode: {faculty.faculty_name} ({faculty.faculty_id})</span>
                <span className="text-[10px] bg-purple-200 text-purple-900 font-mono px-2 py-0.5 rounded font-bold">
                  READ ONLY
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Department of {faculty.department} • Strictly SELECT queries active. View hall attendance rosters and examinee seating grids.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl shadow-sm transition"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print Hall Attendance Sheet</span>
            </button>
            <button
              onClick={onLogout}
              className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Faculty Search & Controls Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Hall selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select Examination Hall
              </label>
              <select
                value={facultySelectedHall}
                onChange={e => setFacultySelectedHall(e.target.value)}
                className="w-full text-sm bg-white border border-slate-300 rounded-xl px-3.5 py-2 font-medium text-slate-800 shadow-sm focus:ring-2 focus:ring-purple-500"
              >
                {halls.map(h => (
                  <option key={h.hall_id} value={h.hall_number}>
                    {h.hall_number} ({h.building} - Capacity: {h.capacity})
                  </option>
                ))}
              </select>
            </div>

            {/* Search by Roll Number or Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Search Student Roll Number / Name
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. 23CS001, Aarav..."
                  value={facultySearchTerm}
                  onChange={e => setFacultySearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>

            {/* Filter by Subject */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Filter by Subject Code
              </label>
              <select
                value={facultyFilterSubject}
                onChange={e => setFacultyFilterSubject(e.target.value)}
                className="w-full text-sm bg-white border border-slate-300 rounded-xl px-3.5 py-2 font-medium text-slate-800 shadow-sm focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Subjects in Hall</option>
                {exams.map(ex => (
                  <option key={ex.exam_id} value={ex.subject_code}>
                    {ex.subject_code} - {ex.subject_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Hall-wise Student Roster Table for Invigilation */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Hall Attendance &amp; Seating Roster:</span>
                <span className="font-mono text-purple-700">{facultySelectedHall}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing {filteredHallAllocations.length} students assigned to this examination hall.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-purple-100 text-purple-800 font-bold px-3 py-1 rounded-full border border-purple-200">
                Total Seated: {filteredHallAllocations.length}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-800 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Seat No</th>
                  <th className="py-3 px-4">Roll Number</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Branch &amp; Sec</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Exam Time</th>
                  <th className="py-3 px-4 text-center">Invigilator Sign</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHallAllocations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No students match the current hall and search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredHallAllocations.map((row, idx) => (
                    <tr key={row.allocation_id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">
                        {row.seat_number}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {row.roll_no}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {row.student_name}
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium">
                          {row.branch} (Sec {row.section})
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800">{row.subject_code}</span>
                        <span className="text-slate-400 block text-[10px]">{row.subject_name}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                        {row.start_time} - {row.end_time}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="w-24 h-6 border-b border-dashed border-slate-300 mx-auto"></div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Visual Seating Layout for Faculty */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-600" />
            <span>Hall Seating Visualizer ({facultySelectedHall})</span>
          </h3>
          <SeatingGridVisualizer
            halls={halls}
            seats={seats}
            allocations={allocations}
            selectedHallId={halls.find(h => h.hall_number === facultySelectedHall)?.hall_id}
            isReadOnly={true}
          />
        </div>
      </div>
    );
  }

  return null;
};
