import React, { useState, useEffect, useMemo } from 'react';
import { 
  DatabaseState, 
  loadDatabaseState, 
  saveDatabaseState, 
  resetDatabaseState, 
  getEnrichedAllocations 
} from './db/sqlEngine';
import { Student, Faculty } from './types/database';
import { Navbar } from './components/Navbar';
import { AdminPortal } from './components/AdminPortal';
import { StudentFacultyPortal } from './components/StudentFacultyPortal';
import { Building2, ShieldCheck, GraduationCap, Database } from 'lucide-react';

export default function App() {
  // Load persistent DB state
  const [dbState, setDbState] = useState<DatabaseState>(() => loadDatabaseState());

  // Portal selection: 'admin' vs 'portal' (Student & Faculty)
  const [currentPortal, setCurrentPortal] = useState<'admin' | 'portal'>('portal');

  // User session states
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(true);
  const [activePortalUser, setActivePortalUser] = useState<{
    role: 'student' | 'faculty';
    student?: Student;
    faculty?: Faculty;
  } | null>({
    role: 'student',
    student: dbState.student[0], // default to first student (23CS001) for instant preview
  });

  // Keep localStorage updated on db state modifications
  const handleUpdateDbState = (newState: DatabaseState) => {
    setDbState(newState);
    saveDatabaseState(newState);
  };

  const handleResetDB = () => {
    const fresh = resetDatabaseState();
    setDbState(fresh);
    if (activePortalUser?.role === 'student') {
      setActivePortalUser({ role: 'student', student: fresh.student[0] });
    }
  };

  // Enriched 4-table join allocations
  const enrichedAllocations = useMemo(() => {
    return getEnrichedAllocations(dbState);
  }, [dbState]);

  // Quick login helper
  const handleQuickLogin = (role: 'admin' | 'student' | 'faculty') => {
    if (role === 'admin') {
      setIsAdminLoggedIn(true);
      setCurrentPortal('admin');
    } else if (role === 'student') {
      setCurrentPortal('portal');
      setActivePortalUser({ role: 'student', student: dbState.student[0] });
    } else {
      setCurrentPortal('portal');
      setActivePortalUser({ role: 'faculty', faculty: dbState.faculty[0] });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top University Navigation */}
      <Navbar
        currentPortal={currentPortal}
        onSelectPortal={setCurrentPortal}
        userRole={
          currentPortal === 'admin'
            ? isAdminLoggedIn ? 'admin' : null
            : activePortalUser ? activePortalUser.role : null
        }
        userName={
          currentPortal === 'admin'
            ? 'Administrator'
            : activePortalUser?.role === 'student'
            ? activePortalUser.student?.student_name
            : activePortalUser?.faculty?.faculty_name
        }
        userRollNo={activePortalUser?.student?.roll_no}
        onLogout={() => {
          if (currentPortal === 'admin') {
            setIsAdminLoggedIn(false);
          } else {
            setActivePortalUser(null);
          }
        }}
        onQuickLogin={handleQuickLogin}
        onResetDB={handleResetDB}
        totalStudents={dbState.student.length}
        totalAllocations={dbState.allocation.length}
      />

      {/* Main Body */}
      <main className="flex-1">
        {currentPortal === 'admin' ? (
          <AdminPortal
            dbState={dbState}
            onUpdateDbState={handleUpdateDbState}
            onResetDB={handleResetDB}
            enrichedAllocations={enrichedAllocations}
            isAdminLoggedIn={isAdminLoggedIn}
            onAdminLogin={() => setIsAdminLoggedIn(true)}
            onAdminLogout={() => setIsAdminLoggedIn(false)}
          />
        ) : (
          <StudentFacultyPortal
            students={dbState.student}
            facultyList={dbState.faculty}
            halls={dbState.hall}
            seats={dbState.seat}
            exams={dbState.exam}
            allocations={enrichedAllocations}
            activeUser={activePortalUser}
            onLogin={(role, user) => {
              if (role === 'student') {
                setActivePortalUser({ role: 'student', student: user as Student });
              } else {
                setActivePortalUser({ role: 'faculty', faculty: user as Faculty });
              }
            }}
            onLogout={() => setActivePortalUser(null)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-200">
                Exam Hall and Seating Allocation System
              </p>
              <p className="text-[11px] text-slate-500">
                Final Year Major Capstone Bachelor Project (CBP) • University Examination Cell
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-blue-400" />
              MySQL 8.0 &amp; 3NF Normalized
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Role-Based Access Control
            </span>
            <span className="flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
              Student &amp; Faculty Read-Only Portal
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
