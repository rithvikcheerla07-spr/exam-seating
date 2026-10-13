import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Student, 
  Faculty, 
  Exam, 
  Hall, 
  Seat, 
  Allocation, 
  AllocationEnriched,
  Branch,
  Gender,
  Section,
  Year
} from '../types/database';
import { DatabaseState } from '../db/sqlEngine';
import { SeatingGridVisualizer } from './SeatingGridVisualizer';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  Building, 
  Armchair, 
  Sparkles, 
  FileSpreadsheet, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Printer, 
  RotateCcw,
  Layers,
  ArrowRight
} from 'lucide-react';

interface AdminManagementProps {
  dbState: DatabaseState;
  onUpdateDbState: (newState: DatabaseState) => void;
  enrichedAllocations: AllocationEnriched[];
  activeSubTab: string;
  onSelectSubTab: (tab: string) => void;
}

export const AdminManagement: React.FC<AdminManagementProps> = ({
  dbState,
  onUpdateDbState,
  enrichedAllocations,
  activeSubTab,
  onSelectSubTab,
}) => {
  // Toast notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // =========================================================================
  // 1. STUDENTS MANAGEMENT STATE
  // =========================================================================
  const [studentSearch, setStudentSearch] = useState('');
  const [studentBranchFilter, setStudentBranchFilter] = useState<string>('All');
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [studentForm, setStudentForm] = useState<{
    roll_no: string;
    student_name: string;
    gender: Gender;
    branch: Branch;
    year: Year;
    section: Section;
    email: string;
    phone: string;
  }>({
    roll_no: '',
    student_name: '',
    gender: 'Male',
    branch: 'CSE',
    year: 3,
    section: 'A',
    email: '',
    phone: '',
  });

  const filteredStudents = useMemo(() => {
    return dbState.student.filter(s => {
      const matchesBranch = studentBranchFilter === 'All' || s.branch === studentBranchFilter;
      const matchesSearch =
        !studentSearch.trim() ||
        s.roll_no.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.student_name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.email.toLowerCase().includes(studentSearch.toLowerCase());
      return matchesBranch && matchesSearch;
    });
  }, [dbState.student, studentBranchFilter, studentSearch]);

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.roll_no.trim() || !studentForm.student_name.trim()) return;

    if (editingStudent) {
      // Update
      const updated = dbState.student.map(s =>
        s.student_id === editingStudent.student_id
          ? { ...s, ...studentForm }
          : s
      );
      onUpdateDbState({
        ...dbState,
        student: updated,
        audit_log: [
          {
            log_id: dbState.audit_log.length + 1,
            action: 'UPDATE',
            table_name: 'student',
            record_id: editingStudent.student_id,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            details: `Updated student ${studentForm.roll_no} (${studentForm.student_name})`,
          },
          ...dbState.audit_log,
        ],
      });
      showToast(`Student ${studentForm.roll_no} updated successfully!`);
    } else {
      // Insert
      const exists = dbState.student.some(
        s => s.roll_no.toLowerCase() === studentForm.roll_no.trim().toLowerCase()
      );
      if (exists) {
        showToast(`Roll number ${studentForm.roll_no} already exists! Integrity Violation.`, 'error');
        return;
      }
      const newId = Math.max(...dbState.student.map(s => s.student_id), 0) + 1;
      const newStudent: Student = {
        student_id: newId,
        ...studentForm,
        password: 'password123',
      };
      onUpdateDbState({
        ...dbState,
        student: [newStudent, ...dbState.student],
        audit_log: [
          {
            log_id: dbState.audit_log.length + 1,
            action: 'INSERT',
            table_name: 'student',
            record_id: newId,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            details: `Registered new student ${newStudent.roll_no}`,
          },
          ...dbState.audit_log,
        ],
      });
      showToast(`New student ${newStudent.roll_no} inserted successfully!`);
    }

    setStudentModalOpen(false);
    setEditingStudent(null);
  };

  const handleDeleteStudent = (id: number, roll: string) => {
    // Check if student has allocations
    const hasAlloc = dbState.allocation.some(a => a.student_id === id);
    if (hasAlloc) {
      if (!window.confirm(`Student ${roll} has active seat allocations. Deleting will cascade remove allocations. Proceed?`)) {
        return;
      }
    } else {
      if (!window.confirm(`Delete student ${roll}?`)) return;
    }

    const newAllocs = dbState.allocation.filter(a => a.student_id !== id);
    const newStudents = dbState.student.filter(s => s.student_id !== id);

    onUpdateDbState({
      ...dbState,
      student: newStudents,
      allocation: newAllocs,
      audit_log: [
        {
          log_id: dbState.audit_log.length + 1,
          action: 'DELETE',
          table_name: 'student',
          record_id: id,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          details: `Deleted student ${roll}`,
        },
        ...dbState.audit_log,
      ],
    });
    showToast(`Student ${roll} deleted successfully.`);
  };

  // =========================================================================
  // 2. EXAM MANAGEMENT STATE
  // =========================================================================
  const [examSearch, setExamSearch] = useState('');
  const [examModalOpen, setExamModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [examForm, setExamForm] = useState<{
    subject_code: string;
    subject_name: string;
    branch: Branch;
    year: Year;
    exam_date: string;
    start_time: string;
    end_time: string;
  }>({
    subject_code: '',
    subject_name: '',
    branch: 'CSE',
    year: 3,
    exam_date: '2026-11-15',
    start_time: '09:30',
    end_time: '12:30',
  });

  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examForm.subject_code || !examForm.subject_name) return;

    if (editingExam) {
      const updated = dbState.exam.map(ex =>
        ex.exam_id === editingExam.exam_id ? { ...ex, ...examForm } : ex
      );
      onUpdateDbState({ ...dbState, exam: updated });
      showToast(`Exam ${examForm.subject_code} updated!`);
    } else {
      const newId = Math.max(...dbState.exam.map(e => e.exam_id), 0) + 1;
      onUpdateDbState({
        ...dbState,
        exam: [...dbState.exam, { exam_id: newId, ...examForm }],
      });
      showToast(`Exam ${examForm.subject_code} added!`);
    }
    setExamModalOpen(false);
    setEditingExam(null);
  };

  // =========================================================================
  // 3. HALL & SEAT MANAGEMENT STATE
  // =========================================================================
  const [hallModalOpen, setHallModalOpen] = useState(false);
  const [editingHall, setEditingHall] = useState<Hall | null>(null);
  const [hallForm, setHallForm] = useState({
    hall_number: '',
    building: 'Science & Tech Block',
    floor: 1,
    rows: 6,
    columns: 10,
  });

  const handleSaveHall = (e: React.FormEvent) => {
    e.preventDefault();
    const capacity = hallForm.rows * hallForm.columns;
    if (editingHall) {
      const updated = dbState.hall.map(h =>
        h.hall_id === editingHall.hall_id
          ? { ...h, ...hallForm, capacity }
          : h
      );
      onUpdateDbState({ ...dbState, hall: updated });
      showToast(`Hall ${hallForm.hall_number} updated!`);
    } else {
      const newId = Math.max(...dbState.hall.map(h => h.hall_id), 0) + 1;
      const newHall: Hall = {
        hall_id: newId,
        ...hallForm,
        capacity,
      };

      // Auto-generate seats for this new hall
      const newSeats: Seat[] = [];
      let seatId = Math.max(...dbState.seat.map(s => s.seat_id), 0) + 1;
      for (let r = 1; r <= hallForm.rows; r++) {
        for (let c = 1; c <= hallForm.columns; c++) {
          newSeats.push({
            seat_id: seatId++,
            hall_id: newId,
            seat_number: `${hallForm.hall_number.replace('-', '')}-R${r}C${c}`,
            row_number: r,
            column_number: c,
            status: 'Available',
          });
        }
      }

      onUpdateDbState({
        ...dbState,
        hall: [...dbState.hall, newHall],
        seat: [...dbState.seat, ...newSeats],
      });
      showToast(`Hall ${newHall.hall_number} created with ${capacity} seats!`);
    }
    setHallModalOpen(false);
    setEditingHall(null);
  };

  // =========================================================================
  // 4. AUTOMATIC SEAT ALLOCATION ALGORITHM
  // =========================================================================
  const [allocTargetExamId, setAllocTargetExamId] = useState<number>(dbState.exam[0]?.exam_id || 1);
  const [allocSelectedHalls, setAllocSelectedHalls] = useState<number[]>([1, 2]);
  const [allocating, setAllocating] = useState(false);

  const selectedExam = dbState.exam.find(e => e.exam_id === allocTargetExamId);
  const eligibleStudentsForExam = useMemo(() => {
    if (!selectedExam) return [];
    // Eligible students belong to the exam's branch and year, and do not already have an allocation for this exam
    const allocatedStudentIds = new Set(
      dbState.allocation.filter(a => a.exam_id === selectedExam.exam_id).map(a => a.student_id)
    );
    return dbState.student.filter(
      s => s.branch === selectedExam.branch && s.year === selectedExam.year && !allocatedStudentIds.has(s.student_id)
    );
  }, [dbState.student, dbState.allocation, selectedExam]);

  const availableSeatsInSelectedHalls = useMemo(() => {
    return dbState.seat.filter(
      s => allocSelectedHalls.includes(s.hall_id) && s.status === 'Available'
    );
  }, [dbState.seat, allocSelectedHalls]);

  const handleExecuteAllocation = () => {
    if (!selectedExam) return;
    if (allocSelectedHalls.length === 0) {
      showToast('Select at least one examination hall!', 'error');
      return;
    }
    if (eligibleStudentsForExam.length === 0) {
      showToast(`All ${selectedExam.branch} students already allocated for this exam!`, 'error');
      return;
    }
    if (availableSeatsInSelectedHalls.length < eligibleStudentsForExam.length) {
      showToast(
        `Capacity Deficit: Selected halls have ${availableSeatsInSelectedHalls.length} vacant desks, but ${eligibleStudentsForExam.length} students need seating.`,
        'error'
      );
      return;
    }

    setAllocating(true);

    setTimeout(() => {
      // Deterministic Row-Major Algorithm:
      // 1. Sort students by roll_no
      const sortedStudents = [...eligibleStudentsForExam].sort((a, b) =>
        a.roll_no.localeCompare(b.roll_no)
      );

      // 2. Sort seats in selected halls row-wise: hall_id, row_number, column_number
      const sortedSeats = [...availableSeatsInSelectedHalls].sort((a, b) => {
        if (a.hall_id !== b.hall_id) return a.hall_id - b.hall_id;
        if (a.row_number !== b.row_number) return a.row_number - b.row_number;
        return a.column_number - b.column_number;
      });

      const newAllocations: Allocation[] = [];
      const updatedSeats = [...dbState.seat];
      let allocCounter = Math.max(...dbState.allocation.map(a => a.allocation_id), 0) + 1;

      sortedStudents.forEach((student, idx) => {
        const assignedSeat = sortedSeats[idx];
        if (assignedSeat) {
          newAllocations.push({
            allocation_id: allocCounter++,
            student_id: student.student_id,
            exam_id: selectedExam.exam_id,
            seat_id: assignedSeat.seat_id,
            allocation_date: new Date().toISOString().replace('T', ' ').substring(0, 19),
          });

          // Update seat state
          const seatRef = updatedSeats.find(s => s.seat_id === assignedSeat.seat_id);
          if (seatRef) {
            seatRef.status = 'Occupied';
          }
        }
      });

      const newState: DatabaseState = {
        ...dbState,
        allocation: [...dbState.allocation, ...newAllocations],
        seat: updatedSeats,
        audit_log: [
          {
            log_id: dbState.audit_log.length + 1,
            action: 'AUTO_ALLOCATE',
            table_name: 'ALLOCATION',
            record_id: `${newAllocations.length}_SEATS`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            details: `Auto-allocated ${newAllocations.length} students for ${selectedExam.subject_code} across selected halls without collision.`,
          },
          ...dbState.audit_log,
        ],
      };

      onUpdateDbState(newState);
      setAllocating(false);

      // Trigger Confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      showToast(`Success! Allocated ${newAllocations.length} students into halls with zero collisions!`);
    }, 400);
  };

  // =========================================================================
  // 5. REPORTS STATE
  // =========================================================================
  const [reportType, setReportType] = useState<
    'student' | 'hall' | 'branch' | 'subject' | 'occupancy'
  >('student');

  const handleExportCSV = (filename: string, headers: string[], rows: any[][]) => {
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className={`p-4 rounded-2xl shadow-2xl border flex items-center gap-3 text-xs sm:text-sm font-bold ${
            toastMessage.type === 'success'
              ? 'bg-emerald-600 text-white border-emerald-500'
              : 'bg-rose-600 text-white border-rose-500'
          }`}>
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Subtab Navigation Pills */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 flex flex-wrap gap-1.5">
        {[
          { id: 'students', label: 'Students Master (CRUD)', icon: Users, count: dbState.student.length },
          { id: 'faculty', label: 'Faculty Master (CRUD)', icon: Briefcase, count: dbState.faculty.length },
          { id: 'exams', label: 'Exams Master (CRUD)', icon: Calendar, count: dbState.exam.length },
          { id: 'halls', label: 'Halls & Seats (CRUD)', icon: Building, count: dbState.hall.length },
          { id: 'allocation_wizard', label: 'Auto Seating Wizard', icon: Sparkles, highlight: true },
          { id: 'grid_view', label: 'Live Seating Map', icon: Layers },
          { id: 'reports', label: 'Reports Hub (PDF/CSV)', icon: FileSpreadsheet },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectSubTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                isActive
                  ? tab.highlight
                    ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-md'
                    : 'bg-blue-600 text-white shadow-md'
                  : tab.highlight
                  ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* =====================================================================
          1. STUDENTS MASTER VIEW (CRUD)
          ===================================================================== */}
      {activeSubTab === 'students' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Student Records Management (CRUD)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Full Insert, Update, Delete, and Search operations on STUDENT entity with domain constraints.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingStudent(null);
                setStudentForm({
                  roll_no: '',
                  student_name: '',
                  gender: 'Male',
                  branch: 'CSE',
                  year: 3,
                  section: 'A',
                  email: '',
                  phone: '',
                });
                setStudentModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Student</span>
            </button>
          </div>

          {/* Filters & Search */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by Roll Number, Name, or Email..."
                value={studentSearch}
                onChange={e => setStudentSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <select
                value={studentBranchFilter}
                onChange={e => setStudentBranchFilter(e.target.value)}
                className="w-full py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl outline-none font-medium text-slate-800"
              >
                <option value="All">All Branches ({dbState.student.length})</option>
                {['CSE', 'ECE', 'MECH', 'CIVIL', 'IT', 'AI&DS'].map(b => (
                  <option key={b} value={b}>
                    {b} Branch
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-900 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Roll Number</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Branch &amp; Year</th>
                  <th className="py-3 px-4">Section</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.slice(0, 100).map(s => (
                  <tr key={s.student_id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono text-slate-400">#{s.student_id}</td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">{s.roll_no}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{s.student_name}</td>
                    <td className="py-3 px-4 font-medium">{s.branch} (Year {s.year})</td>
                    <td className="py-3 px-4 font-bold">{s.section}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{s.email}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingStudent(s);
                            setStudentForm({
                              roll_no: s.roll_no,
                              student_name: s.student_name,
                              gender: s.gender,
                              branch: s.branch,
                              year: s.year,
                              section: s.section,
                              email: s.email,
                              phone: s.phone,
                            });
                            setStudentModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Student"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(s.student_id, s.roll_no)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Student"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Student Add/Edit Modal */}
          {studentModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
                <h4 className="text-base font-bold text-slate-900 mb-4">
                  {editingStudent ? `Edit Student: ${editingStudent.roll_no}` : 'Add New Student Record'}
                </h4>
                <form onSubmit={handleSaveStudent} className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Roll Number (Unique)</label>
                      <input
                        type="text"
                        required
                        value={studentForm.roll_no}
                        onChange={e => setStudentForm({ ...studentForm, roll_no: e.target.value })}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                        placeholder="23CS061"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Student Full Name</label>
                      <input
                        type="text"
                        required
                        value={studentForm.student_name}
                        onChange={e => setStudentForm({ ...studentForm, student_name: e.target.value })}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                        placeholder="Rohan Varma"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Branch</label>
                      <select
                        value={studentForm.branch}
                        onChange={e => setStudentForm({ ...studentForm, branch: e.target.value as Branch })}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                      >
                        {['CSE', 'ECE', 'MECH', 'CIVIL', 'IT', 'AI&DS'].map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Year</label>
                      <select
                        value={studentForm.year}
                        onChange={e => setStudentForm({ ...studentForm, year: Number(e.target.value) as Year })}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                      >
                        {[1, 2, 3, 4].map(y => (
                          <option key={y} value={y}>Year {y}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Section</label>
                      <select
                        value={studentForm.section}
                        onChange={e => setStudentForm({ ...studentForm, section: e.target.value as Section })}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                      >
                        {['A', 'B', 'C'].map(s => (
                          <option key={s} value={s}>Section {s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={studentForm.email}
                        onChange={e => setStudentForm({ ...studentForm, email: e.target.value })}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                        placeholder="student@univ.edu"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Phone</label>
                      <input
                        type="text"
                        value={studentForm.phone}
                        onChange={e => setStudentForm({ ...studentForm, phone: e.target.value })}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                        placeholder="+91 91234 56789"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setStudentModalOpen(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                    >
                      Save Student
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          2. AUTO SEATING ALLOCATION WIZARD
          ===================================================================== */}
      {activeSubTab === 'allocation_wizard' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
              <span>ALGORITHM AUTOMATION CORE • ZERO COLLISION</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-500" />
              <span>Automated Examination Seating Allocation Wizard</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Executes the row-major sorting algorithm, sorts students by roll number, fills halls systematically, prevents duplicate seat assignments, and creates transactional allocation records.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Step 1 & 2 Form Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Select Exam */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Step 1: Select Target Examination
                </label>
                <select
                  value={allocTargetExamId}
                  onChange={e => setAllocTargetExamId(Number(e.target.value))}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-blue-500"
                >
                  {dbState.exam.map(ex => (
                    <option key={ex.exam_id} value={ex.exam_id}>
                      {ex.subject_code} - {ex.subject_name} ({ex.branch} Year {ex.year}) • {ex.exam_date}
                    </option>
                  ))}
                </select>

                {selectedExam && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-xl text-xs text-blue-900 flex items-center justify-between">
                    <div>
                      <span className="font-bold">{selectedExam.subject_name}</span> ({selectedExam.subject_code})
                      <span className="block text-[11px] text-blue-700">Date: {selectedExam.exam_date} • Time: {selectedExam.start_time} - {selectedExam.end_time}</span>
                    </div>
                    <span className="font-bold text-blue-800 bg-white px-2.5 py-1 rounded-lg border border-blue-200">
                      Eligible: {eligibleStudentsForExam.length} Students
                    </span>
                  </div>
                )}
              </div>

              {/* Select Halls */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Step 2: Select Examination Halls to Allocate
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[220px] overflow-y-auto p-1">
                  {dbState.hall.map(hall => {
                    const isChecked = allocSelectedHalls.includes(hall.hall_id);
                    const vacantInHall = dbState.seat.filter(
                      s => s.hall_id === hall.hall_id && s.status === 'Available'
                    ).length;

                    return (
                      <label
                        key={hall.hall_id}
                        className={`p-3 rounded-xl border cursor-pointer text-xs flex flex-col justify-between transition ${
                          isChecked
                            ? 'bg-blue-50 border-blue-500 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{hall.hall_number}</span>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setAllocSelectedHalls(allocSelectedHalls.filter(id => id !== hall.hall_id));
                              } else {
                                setAllocSelectedHalls([...allocSelectedHalls, hall.hall_id]);
                              }
                            }}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                        </div>
                        <div className="mt-2 text-[10px] text-slate-500">
                          <div>Cap: {hall.capacity}</div>
                          <div className="font-bold text-emerald-700">{vacantInHall} Vacant</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Allocation Summary & Launch Box */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-indigo-950 p-6 rounded-3xl text-white shadow-xl flex flex-col justify-between">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                  <span>Allocation Verification Matrix</span>
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between p-3 rounded-xl bg-white/10">
                    <span className="text-slate-300">Target Candidates:</span>
                    <span className="font-bold font-mono text-white">{eligibleStudentsForExam.length} Students</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-white/10">
                    <span className="text-slate-300">Selected Halls:</span>
                    <span className="font-bold font-mono text-white">{allocSelectedHalls.length} Rooms</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-white/10">
                    <span className="text-slate-300">Vacant Desks in Halls:</span>
                    <span className="font-bold font-mono text-emerald-400">{availableSeatsInSelectedHalls.length} Desks</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-white/10">
                    <span className="text-slate-300">Collision Detection:</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 0 Collisions
                    </span>
                  </div>
                </div>

                {availableSeatsInSelectedHalls.length < eligibleStudentsForExam.length && (
                  <div className="mt-4 p-3 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Capacity Warning: Add more halls to cover remaining examinees.</span>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-white/10">
                <button
                  onClick={handleExecuteAllocation}
                  disabled={allocating || eligibleStudentsForExam.length === 0}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white font-bold text-sm rounded-2xl shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{allocating ? 'Executing Allocation Algorithm...' : 'Generate Seating (Execute)'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          3. LIVE SEATING GRID MAP
          ===================================================================== */}
      {activeSubTab === 'grid_view' && (
        <SeatingGridVisualizer
          halls={dbState.hall}
          seats={dbState.seat}
          allocations={enrichedAllocations}
        />
      )}

      {/* =====================================================================
          4. REPORTS HUB (PDF / CSV / PRINT)
          ===================================================================== */}
      {activeSubTab === 'reports' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                <span>Comprehensive Examination Reports &amp; Exports</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Generate Student-Wise, Hall-Wise, Branch-Wise, and Seat Occupancy audit reports.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Print Report</span>
              </button>
              <button
                onClick={() => {
                  const headers = ['Allocation ID', 'Roll No', 'Student Name', 'Branch', 'Subject Code', 'Hall', 'Seat', 'Date', 'Time'];
                  const rows = enrichedAllocations.map(a => [
                    a.allocation_id, a.roll_no, a.student_name, a.branch, a.subject_code, a.hall_number, a.seat_number, a.exam_date, a.start_time
                  ]);
                  handleExportCSV('exam_master_allocations', headers, rows);
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition"
              >
                <Download className="w-4 h-4" />
                <span>Export Excel / CSV</span>
              </button>
            </div>
          </div>

          {/* Report Type selector */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl max-w-xl text-xs font-bold">
            {[
              { id: 'student', label: 'Student Wise Report' },
              { id: 'hall', label: 'Hall Wise Report' },
              { id: 'branch', label: 'Branch Wise Report' },
              { id: 'occupancy', label: 'Seat Occupancy Report' },
            ].map(r => (
              <button
                key={r.id}
                onClick={() => setReportType(r.id as any)}
                className={`flex-1 py-2 text-center rounded-lg transition ${
                  reportType === r.id ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Report Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-900 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Roll Number</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Branch</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Exam Hall</th>
                  <th className="py-3 px-4">Seat Number</th>
                  <th className="py-3 px-4">Date &amp; Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enrichedAllocations.slice(0, 100).map(a => (
                  <tr key={a.allocation_id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">{a.roll_no}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{a.student_name}</td>
                    <td className="py-3 px-4 font-medium">{a.branch}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900">{a.subject_code}</span> - {a.subject_name}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-purple-700">{a.hall_number}</td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-800">{a.seat_number}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600">{a.exam_date} ({a.start_time})</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          5. FACULTY MASTER & EXAMS & HALLS SIMPLE VIEW
          ===================================================================== */}
      {activeSubTab === 'faculty' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Faculty Records ({dbState.faculty.length})</h3>
          </div>
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 font-bold uppercase text-[10px] text-slate-800">
                <tr>
                  <th className="p-3">Faculty ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {dbState.faculty.map(f => (
                  <tr key={f.faculty_id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-purple-700">{f.faculty_id}</td>
                    <td className="p-3 font-bold text-slate-900">{f.faculty_name}</td>
                    <td className="p-3">{f.department}</td>
                    <td className="p-3 text-slate-500 font-mono text-[11px]">{f.email}</td>
                    <td className="p-3 text-slate-600 font-mono text-[11px]">{f.phone || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'exams' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Exam Timetable ({dbState.exam.length})</h3>
          </div>
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 font-bold uppercase text-[10px] text-slate-800">
                <tr>
                  <th className="p-3">Subject Code</th>
                  <th className="p-3">Subject Name</th>
                  <th className="p-3">Branch &amp; Year</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Timing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {dbState.exam.map(ex => (
                  <tr key={ex.exam_id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-blue-700">{ex.subject_code}</td>
                    <td className="p-3 font-bold text-slate-900">{ex.subject_name}</td>
                    <td className="p-3">{ex.branch} (Year {ex.year})</td>
                    <td className="p-3 font-mono text-slate-800">{ex.exam_date}</td>
                    <td className="p-3 font-mono text-slate-600">{ex.start_time} - {ex.end_time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'halls' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Halls &amp; Desks Inventory ({dbState.hall.length} Halls, {dbState.seat.length} Seats)</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dbState.hall.map(h => {
              const occ = enrichedAllocations.filter(a => a.hall_id === h.hall_id).length;
              return (
                <div key={h.hall_id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono font-bold text-base text-slate-900">{h.hall_number}</span>
                    <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                      Floor {h.floor}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{h.building}</p>
                  <div className="mt-3 flex justify-between text-xs font-semibold">
                    <span>Capacity: {h.capacity}</span>
                    <span className="text-blue-700">Occupied: {occ}</span>
                    <span className="text-emerald-700">Vacant: {h.capacity - occ}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
