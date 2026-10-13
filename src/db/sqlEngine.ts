/**
 * Relational DBMS Query Engine for AI Studio
 * Simulates MySQL DDL, DML, JOINS, Aggregates, Views, and Transactions.
 */

import {
  Admin,
  Student,
  Faculty,
  Exam,
  Hall,
  Seat,
  Allocation,
  AuditLog,
  AllocationEnriched,
} from '../types/database';
import {
  initialAdmin,
  initialStudents,
  initialFaculty,
  initialExams,
  initialHalls,
  initialSeats,
  initialAllocations,
  initialAuditLogs,
} from './initialData';

export interface DatabaseState {
  admin: Admin[];
  student: Student[];
  faculty: Faculty[];
  exam: Exam[];
  hall: Hall[];
  seat: Seat[];
  allocation: Allocation[];
  audit_log: AuditLog[];
  views: Record<string, string>; // view_name -> query
  transactionStack: DatabaseState[];
  inTransaction: boolean;
}

export interface QueryResult {
  success: boolean;
  message?: string;
  columns?: string[];
  rows?: Record<string, any>[];
  rowCount?: number;
  executionTimeMs?: number;
  queryType?: string;
  isExplain?: boolean;
}

const STORAGE_KEY = 'exam_alloc_db_state_v1';

export function getInitialDatabaseState(): DatabaseState {
  return {
    admin: [{ ...initialAdmin }],
    student: initialStudents.map(s => ({ ...s })),
    faculty: initialFaculty.map(f => ({ ...f })),
    exam: initialExams.map(e => ({ ...e })),
    hall: initialHalls.map(h => ({ ...h })),
    seat: initialSeats.map(s => ({ ...s })),
    allocation: initialAllocations.map(a => ({ ...a })),
    audit_log: initialAuditLogs.map(l => ({ ...l })),
    views: {
      vw_student_allocations: `SELECT a.allocation_id, s.roll_no, s.student_name, s.branch, e.subject_code, e.subject_name, e.exam_date, e.start_time, h.hall_number, h.building, se.seat_number, se.row_number, se.column_number FROM allocation a JOIN student s ON a.student_id = s.student_id JOIN exam e ON a.exam_id = e.exam_id JOIN seat se ON a.seat_id = se.seat_id JOIN hall h ON se.hall_id = h.hall_id`,
      vw_hall_occupancy: `SELECT h.hall_id, h.hall_number, h.capacity, COUNT(a.allocation_id) AS occupied_seats, (h.capacity - COUNT(a.allocation_id)) AS available_seats, ROUND((COUNT(a.allocation_id) * 100.0 / h.capacity), 2) AS occupancy_percentage FROM hall h LEFT JOIN seat s ON h.hall_id = s.hall_id LEFT JOIN allocation a ON s.seat_id = a.seat_id GROUP BY h.hall_id`,
      vw_exam_schedule: `SELECT exam_id, subject_code, subject_name, branch, year, exam_date, start_time, end_time FROM exam ORDER BY exam_date ASC, start_time ASC`,
      vw_faculty_invigilation: `SELECT f.faculty_id, f.faculty_name, f.department, h.hall_number, h.building, e.subject_name, e.exam_date FROM faculty f CROSS JOIN hall h CROSS JOIN exam e LIMIT 30`,
      vw_seat_availability: `SELECT se.seat_id, se.seat_number, se.status, h.hall_number, h.building, se.row_number, se.column_number FROM seat se JOIN hall h ON se.hall_id = h.hall_id WHERE se.status = 'Available'`,
    },
    transactionStack: [],
    inTransaction: false,
  };
}

export function loadDatabaseState(): DatabaseState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.student && parsed.student.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to parse database state from storage', err);
  }
  const fresh = getInitialDatabaseState();
  saveDatabaseState(fresh);
  return fresh;
}

export function saveDatabaseState(state: DatabaseState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Could not save to localStorage', err);
  }
}

export function resetDatabaseState(): DatabaseState {
  const fresh = getInitialDatabaseState();
  saveDatabaseState(fresh);
  return fresh;
}

// Join helper to produce enriched allocations
export function getEnrichedAllocations(state: DatabaseState): AllocationEnriched[] {
  const studentMap = new Map<number, Student>(state.student.map(s => [s.student_id, s]));
  const examMap = new Map<number, Exam>(state.exam.map(e => [e.exam_id, e]));
  const seatMap = new Map<number, Seat>(state.seat.map(s => [s.seat_id, s]));
  const hallMap = new Map<number, Hall>(state.hall.map(h => [h.hall_id, h]));

  return state.allocation.map(a => {
    const student = studentMap.get(a.student_id);
    const exam = examMap.get(a.exam_id);
    const seat = seatMap.get(a.seat_id);
    const hall = seat ? hallMap.get(seat.hall_id) : undefined;

    return {
      allocation_id: a.allocation_id,
      student_id: a.student_id,
      roll_no: student ? student.roll_no : 'UNKNOWN',
      student_name: student ? student.student_name : 'Unknown',
      gender: student ? student.gender : 'Male',
      branch: student ? student.branch : 'CSE',
      year: student ? student.year : 3,
      section: student ? student.section : 'A',
      exam_id: a.exam_id,
      subject_code: exam ? exam.subject_code : 'NA',
      subject_name: exam ? exam.subject_name : 'NA',
      exam_date: exam ? exam.exam_date : 'NA',
      start_time: exam ? exam.start_time : 'NA',
      end_time: exam ? exam.end_time : 'NA',
      seat_id: a.seat_id,
      seat_number: seat ? seat.seat_number : 'NA',
      row_number: seat ? seat.row_number : 0,
      column_number: seat ? seat.column_number : 0,
      hall_id: hall ? hall.hall_id : 0,
      hall_number: hall ? hall.hall_number : 'NA',
      building: hall ? hall.building : 'NA',
      floor: hall ? hall.floor : 0,
      allocation_date: a.allocation_date,
    };
  });
}

/**
 * Executes a simulated SQL query against the database state
 */
export function executeSQLQuery(
  rawQuery: string,
  state: DatabaseState,
  onStateChange: (newState: DatabaseState) => void
): QueryResult {
  const startTime = performance.now();
  const trimmed = rawQuery.trim();
  const clean = trimmed.replace(/;$/, '').trim();
  const lower = clean.toLowerCase();

  // Handle Comments
  if (lower.startsWith('--') || lower.startsWith('/*')) {
    return {
      success: true,
      message: 'Comment processed successfully.',
      columns: ['status'],
      rows: [{ status: 'OK' }],
      executionTimeMs: 0.1,
    };
  }

  // 1. Transaction commands
  if (lower === 'begin' || lower === 'start transaction' || lower === 'begin transaction') {
    const snapshot = JSON.parse(JSON.stringify(state)) as DatabaseState;
    const newState: DatabaseState = {
      ...state,
      inTransaction: true,
      transactionStack: [...state.transactionStack, snapshot],
    };
    onStateChange(newState);
    return {
      success: true,
      message: 'Query OK, 0 rows affected. Transaction started.',
      columns: ['transaction_status'],
      rows: [{ transaction_status: 'ACTIVE' }],
      executionTimeMs: performance.now() - startTime,
    };
  }

  if (lower === 'commit') {
    if (!state.inTransaction) {
      return { success: false, message: 'Warning: No active transaction to commit.' };
    }
    const newState: DatabaseState = {
      ...state,
      inTransaction: false,
      transactionStack: [],
    };
    onStateChange(newState);
    return {
      success: true,
      message: 'Query OK, 0 rows affected. Transaction committed successfully.',
      columns: ['status'],
      rows: [{ status: 'COMMITTED' }],
      executionTimeMs: performance.now() - startTime,
    };
  }

  if (lower === 'rollback') {
    if (!state.inTransaction || state.transactionStack.length === 0) {
      return { success: false, message: 'Warning: No active transaction or savepoint to rollback.' };
    }
    const previous = state.transactionStack[state.transactionStack.length - 1];
    const newState: DatabaseState = {
      ...previous,
      inTransaction: false,
      transactionStack: [],
    };
    onStateChange(newState);
    return {
      success: true,
      message: 'Query OK, 0 rows affected. Rollback completed, previous state restored.',
      columns: ['status'],
      rows: [{ status: 'ROLLED_BACK' }],
      executionTimeMs: performance.now() - startTime,
    };
  }

  // 2. SHOW TABLES
  if (lower === 'show tables' || lower === 'show full tables') {
    const tables = [
      { Tables_in_exam_alloc_db: 'admin', Table_type: 'BASE TABLE' },
      { Tables_in_exam_alloc_db: 'student', Table_type: 'BASE TABLE' },
      { Tables_in_exam_alloc_db: 'faculty', Table_type: 'BASE TABLE' },
      { Tables_in_exam_alloc_db: 'exam', Table_type: 'BASE TABLE' },
      { Tables_in_exam_alloc_db: 'hall', Table_type: 'BASE TABLE' },
      { Tables_in_exam_alloc_db: 'seat', Table_type: 'BASE TABLE' },
      { Tables_in_exam_alloc_db: 'allocation', Table_type: 'BASE TABLE' },
      { Tables_in_exam_alloc_db: 'audit_log', Table_type: 'BASE TABLE' },
      ...Object.keys(state.views).map(v => ({
        Tables_in_exam_alloc_db: v,
        Table_type: 'VIEW',
      })),
    ];
    return {
      success: true,
      columns: ['Tables_in_exam_alloc_db', 'Table_type'],
      rows: tables,
      rowCount: tables.length,
      executionTimeMs: performance.now() - startTime,
    };
  }

  // 3. SHOW TRIGGERS
  if (lower.startsWith('show triggers')) {
    const triggers = [
      {
        Trigger: 'trg_prevent_duplicate_seat',
        Event: 'INSERT',
        Table: 'allocation',
        Timing: 'BEFORE',
        Statement: 'SIGNAL SQLSTATE 45000 IF seat already allocated for exam',
      },
      {
        Trigger: 'trg_update_seat_status_occupied',
        Event: 'INSERT',
        Table: 'allocation',
        Timing: 'AFTER',
        Statement: "UPDATE seat SET status = 'Occupied' WHERE seat_id = NEW.seat_id",
      },
      {
        Trigger: 'trg_update_seat_status_freed',
        Event: 'DELETE',
        Table: 'allocation',
        Timing: 'AFTER',
        Statement: "UPDATE seat SET status = 'Available' WHERE seat_id = OLD.seat_id",
      },
      {
        Trigger: 'trg_audit_student_insert',
        Event: 'INSERT',
        Table: 'student',
        Timing: 'AFTER',
        Statement: 'INSERT INTO audit_log (action, table_name, details) VALUES (...)',
      },
    ];
    return {
      success: true,
      columns: ['Trigger', 'Event', 'Table', 'Timing', 'Statement'],
      rows: triggers,
      rowCount: triggers.length,
      executionTimeMs: performance.now() - startTime,
    };
  }

  // 4. SHOW PROCEDURES
  if (lower.startsWith('show procedure status')) {
    const procs = [
      { Db: 'exam_alloc_db', Name: 'sp_add_student', Type: 'PROCEDURE', Definer: 'root@localhost' },
      { Db: 'exam_alloc_db', Name: 'sp_generate_seating', Type: 'PROCEDURE', Definer: 'root@localhost' },
      { Db: 'exam_alloc_db', Name: 'sp_assign_hall', Type: 'PROCEDURE', Definer: 'root@localhost' },
      { Db: 'exam_alloc_db', Name: 'sp_assign_seat', Type: 'PROCEDURE', Definer: 'root@localhost' },
      { Db: 'exam_alloc_db', Name: 'sp_generate_hall_report', Type: 'PROCEDURE', Definer: 'root@localhost' },
    ];
    return {
      success: true,
      columns: ['Db', 'Name', 'Type', 'Definer'],
      rows: procs,
      rowCount: procs.length,
      executionTimeMs: performance.now() - startTime,
    };
  }

  // 5. DESC / DESCRIBE table
  if (lower.startsWith('desc ') || lower.startsWith('describe ')) {
    const tableName = lower.replace(/^(desc|describe)\s+/, '').trim();
    const schemaMap: Record<string, { Field: string; Type: string; Null: string; Key: string; Default: string; Extra: string }[]> = {
      admin: [
        { Field: 'admin_id', Type: 'int(11)', Null: 'NO', Key: 'PRI', Default: 'NULL', Extra: 'auto_increment' },
        { Field: 'username', Type: 'varchar(50)', Null: 'NO', Key: 'UNI', Default: 'NULL', Extra: '' },
        { Field: 'password', Type: 'varchar(255)', Null: 'NO', Key: '', Default: 'NULL', Extra: '' },
        { Field: 'name', Type: 'varchar(100)', Null: 'NO', Key: '', Default: 'NULL', Extra: '' },
        { Field: 'email', Type: 'varchar(100)', Null: 'NO', Key: 'UNI', Default: 'NULL', Extra: '' },
      ],
      student: [
        { Field: 'student_id', Type: 'int(11)', Null: 'NO', Key: 'PRI', Default: 'NULL', Extra: 'auto_increment' },
        { Field: 'roll_no', Type: 'varchar(20)', Null: 'NO', Key: 'UNI', Default: 'NULL', Extra: '' },
        { Field: 'student_name', Type: 'varchar(100)', Null: 'NO', Key: '', Default: 'NULL', Extra: '' },
        { Field: 'gender', Type: "enum('Male','Female','Other')", Null: 'NO', Key: '', Default: "'Male'", Extra: '' },
        { Field: 'branch', Type: 'varchar(20)', Null: 'NO', Key: 'MUL', Default: 'NULL', Extra: '' },
        { Field: 'year', Type: 'int(1)', Null: 'NO', Key: '', Default: '1', Extra: '' },
        { Field: 'section', Type: 'char(1)', Null: 'NO', Key: '', Default: "'A'", Extra: '' },
        { Field: 'email', Type: 'varchar(100)', Null: 'NO', Key: 'UNI', Default: 'NULL', Extra: '' },
        { Field: 'phone', Type: 'varchar(15)', Null: 'YES', Key: '', Default: 'NULL', Extra: '' },
        { Field: 'password', Type: 'varchar(255)', Null: 'NO', Key: '', Default: 'NULL', Extra: '' },
      ],
      faculty: [
        { Field: 'faculty_id', Type: 'varchar(20)', Null: 'NO', Key: 'PRI', Default: 'NULL', Extra: '' },
        { Field: 'faculty_name', Type: 'varchar(100)', Null: 'NO', Key: '', Default: 'NULL', Extra: '' },
        { Field: 'department', Type: 'varchar(20)', Null: 'NO', Key: '', Default: 'NULL', Extra: '' },
        { Field: 'email', Type: 'varchar(100)', Null: 'NO', Key: 'UNI', Default: 'NULL', Extra: '' },
        { Field: 'phone', Type: 'varchar(15)', Null: 'YES', Key: '', Default: 'NULL', Extra: '' },
        { Field: 'password', Type: 'varchar(255)', Null: 'NO', Key: '', Default: 'NULL', Extra: '' },
      ],
      exam: [
        { Field: 'exam_id', Type: 'int(11)', Null: 'NO', Key: 'PRI', Default: 'NULL', Extra: 'auto_increment' },
        { Field: 'subject_code', Type: 'varchar(20)', Null: 'NO', Key: 'MUL', Default: 'NULL', Extra: '' },
        { Field: 'subject_name', Type: 'varchar(100)', Null: 'NO', Key: '', Default: 'NULL', Extra: '' },
        { Field: 'branch', Type: 'varchar(20)', Null: 'NO', Key: '', Default: 'NULL', Extra: '' },
        { Field: 'year', Type: 'int(1)', Null: 'NO', Key: '', Default: 'NULL', Extra: '' },
        { Field: 'exam_date', Type: 'date', Null: 'NO', Key: 'MUL', Default: 'NULL', Extra: '' },
        { Field: 'start_time', Type: 'time', Null: 'NO', Key: '', Default: 'NULL', Extra: '' },
        { Field: 'end_time', Type: 'time', Null: 'NO', Key: '', Default: 'NULL', Extra: '' },
      ],
      hall: [
        { Field: 'hall_id', Type: 'int(11)', Null: 'NO', Key: 'PRI', Default: 'NULL', Extra: 'auto_increment' },
        { Field: 'hall_number', Type: 'varchar(20)', Null: 'NO', Key: 'UNI', Default: 'NULL', Extra: '' },
        { Field: 'building', Type: 'varchar(50)', Null: 'NO', Key: '', Default: 'NULL', Extra: '' },
        { Field: 'floor', Type: 'int(2)', Null: 'NO', Key: '', Default: '1', Extra: '' },
        { Field: 'capacity', Type: 'int(4)', Null: 'NO', Key: '', Default: '60', Extra: '' },
        { Field: 'rows', Type: 'int(2)', Null: 'NO', Key: '', Default: '6', Extra: '' },
        { Field: 'columns', Type: 'int(2)', Null: 'NO', Key: '', Default: '10', Extra: '' },
      ],
      seat: [
        { Field: 'seat_id', Type: 'int(11)', Null: 'NO', Key: 'PRI', Default: 'NULL', Extra: 'auto_increment' },
        { Field: 'hall_id', Type: 'int(11)', Null: 'NO', Key: 'MUL', Default: 'NULL', Extra: 'FK -> hall(hall_id)' },
        { Field: 'seat_number', Type: 'varchar(20)', Null: 'NO', Key: 'MUL', Default: 'NULL', Extra: '' },
        { Field: 'row_number', Type: 'int(2)', Null: 'NO', Key: '', Default: 'NULL', Extra: '' },
        { Field: 'column_number', Type: 'int(2)', Null: 'NO', Key: '', Default: 'NULL', Extra: '' },
        { Field: 'status', Type: "enum('Available','Occupied','Maintenance')", Null: 'NO', Key: '', Default: "'Available'", Extra: '' },
      ],
      allocation: [
        { Field: 'allocation_id', Type: 'int(11)', Null: 'NO', Key: 'PRI', Default: 'NULL', Extra: 'auto_increment' },
        { Field: 'student_id', Type: 'int(11)', Null: 'NO', Key: 'MUL', Default: 'NULL', Extra: 'FK -> student(student_id)' },
        { Field: 'exam_id', Type: 'int(11)', Null: 'NO', Key: 'MUL', Default: 'NULL', Extra: 'FK -> exam(exam_id)' },
        { Field: 'seat_id', Type: 'int(11)', Null: 'NO', Key: 'MUL', Default: 'NULL', Extra: 'FK -> seat(seat_id)' },
        { Field: 'allocation_date', Type: 'datetime', Null: 'NO', Key: '', Default: 'CURRENT_TIMESTAMP', Extra: '' },
      ],
      audit_log: [
        { Field: 'log_id', Type: 'int(11)', Null: 'NO', Key: 'PRI', Default: 'NULL', Extra: 'auto_increment' },
        { Field: 'action', Type: 'varchar(50)', Null: 'NO', Key: '', Default: 'NULL', Extra: '' },
        { Field: 'table_name', Type: 'varchar(50)', Null: 'NO', Key: '', Default: 'NULL', Extra: '' },
        { Field: 'record_id', Type: 'varchar(50)', Null: 'YES', Key: '', Default: 'NULL', Extra: '' },
        { Field: 'timestamp', Type: 'datetime', Null: 'NO', Key: '', Default: 'CURRENT_TIMESTAMP', Extra: '' },
        { Field: 'details', Type: 'text', Null: 'YES', Key: '', Default: 'NULL', Extra: '' },
      ],
    };

    if (schemaMap[tableName]) {
      return {
        success: true,
        columns: ['Field', 'Type', 'Null', 'Key', 'Default', 'Extra'],
        rows: schemaMap[tableName],
        rowCount: schemaMap[tableName].length,
        executionTimeMs: performance.now() - startTime,
      };
    } else {
      return {
        success: false,
        message: `ERROR 1146 (42S02): Table 'exam_alloc_db.${tableName}' doesn't exist`,
      };
    }
  }

  // 6. EXPLAIN <query>
  if (lower.startsWith('explain ')) {
    return {
      success: true,
      columns: ['id', 'select_type', 'table', 'type', 'possible_keys', 'key', 'key_len', 'ref', 'rows', 'Extra'],
      rows: [
        { id: 1, select_type: 'SIMPLE', table: 'student', type: 'ref', possible_keys: 'idx_roll_no,idx_branch', key: 'idx_branch', key_len: '22', ref: 'const', rows: 60, Extra: 'Using index condition; Using where' },
        { id: 1, select_type: 'SIMPLE', table: 'allocation', type: 'eq_ref', possible_keys: 'PRIMARY,fk_alloc_student', key: 'PRIMARY', key_len: '4', ref: 'exam_alloc_db.student.student_id', rows: 1, Extra: 'Using where' },
        { id: 1, select_type: 'SIMPLE', table: 'seat', type: 'eq_ref', possible_keys: 'PRIMARY,fk_seat_hall', key: 'PRIMARY', key_len: '4', ref: 'exam_alloc_db.allocation.seat_id', rows: 1, Extra: '' },
      ],
      rowCount: 3,
      isExplain: true,
      executionTimeMs: performance.now() - startTime,
    };
  }

  // 7. CREATE VIEW
  if (lower.startsWith('create view ')) {
    const viewMatch = clean.match(/create\s+view\s+([a-zA-Z0-9_]+)\s+as\s+(.*)/i);
    if (viewMatch) {
      const viewName = viewMatch[1];
      const queryBody = viewMatch[2];
      const newState = {
        ...state,
        views: {
          ...state.views,
          [viewName]: queryBody,
        },
      };
      onStateChange(newState);
      return {
        success: true,
        message: `Query OK, 0 rows affected. View '${viewName}' created successfully.`,
        executionTimeMs: performance.now() - startTime,
      };
    }
  }

  // 8. DROP VIEW / DROP TABLE
  if (lower.startsWith('drop view ')) {
    const vName = clean.replace(/drop\s+view\s+/i, '').trim();
    if (state.views[vName]) {
      const newViews = { ...state.views };
      delete newViews[vName];
      onStateChange({ ...state, views: newViews });
      return {
        success: true,
        message: `Query OK, 0 rows affected. View '${vName}' dropped.`,
        executionTimeMs: performance.now() - startTime,
      };
    }
  }

  // 9. INSERT / UPDATE / DELETE handlers
  if (lower.startsWith('insert into student')) {
    // Basic parser for demonstration
    const dummyNewId = Math.max(...state.student.map(s => s.student_id), 0) + 1;
    const newStudent: Student = {
      student_id: dummyNewId,
      roll_no: `23DEMO${dummyNewId}`,
      student_name: 'Demonstration Scholar',
      gender: 'Male',
      branch: 'CSE',
      year: 3,
      section: 'A',
      email: `demo${dummyNewId}@student.univ.edu`,
      phone: '+91 99999 11111',
      password: 'password123',
    };
    const newState: DatabaseState = {
      ...state,
      student: [newStudent, ...state.student],
      audit_log: [
        {
          log_id: state.audit_log.length + 1,
          action: 'INSERT',
          table_name: 'student',
          record_id: dummyNewId,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          details: `Inserted record via SQL Console: roll_no ${newStudent.roll_no}`,
        },
        ...state.audit_log,
      ],
    };
    onStateChange(newState);
    return {
      success: true,
      message: 'Query OK, 1 row affected (0.003 sec). Last insert ID: ' + dummyNewId,
      executionTimeMs: performance.now() - startTime,
    };
  }

  // 10. SELECT Queries & Views Evaluator
  try {
    return evaluateSelectQuery(clean, state, startTime);
  } catch (err: any) {
    return {
      success: false,
      message: `SQL Syntax or Execution Error: ${err.message || 'Check statement syntax'}`,
      executionTimeMs: performance.now() - startTime,
    };
  }
}

/**
 * Robust SELECT Evaluator for Student, Faculty, Exam, Hall, Seat, Allocation, AuditLog, and Views
 */
function evaluateSelectQuery(query: string, state: DatabaseState, startTime: number): QueryResult {
  const enriched = getEnrichedAllocations(state);
  const qLower = query.toLowerCase();

  // Check if querying a predefined VIEW
  for (const [viewName, _] of Object.entries(state.views)) {
    if (qLower.includes(`from ${viewName.toLowerCase()}`) || qLower.includes(`from \`${viewName.toLowerCase()}\``)) {
      if (viewName === 'vw_hall_occupancy') {
        const rows = state.hall.map(h => {
          const occ = enriched.filter(e => e.hall_id === h.hall_id).length;
          return {
            hall_id: h.hall_id,
            hall_number: h.hall_number,
            building: h.building,
            capacity: h.capacity,
            occupied_seats: occ,
            available_seats: h.capacity - occ,
            occupancy_pct: `${Math.round((occ / h.capacity) * 100)}%`,
          };
        });
        return {
          success: true,
          columns: Object.keys(rows[0] || {}),
          rows,
          rowCount: rows.length,
          executionTimeMs: performance.now() - startTime,
        };
      }

      if (viewName === 'vw_exam_schedule') {
        return {
          success: true,
          columns: ['exam_id', 'subject_code', 'subject_name', 'branch', 'year', 'exam_date', 'start_time', 'end_time'],
          rows: state.exam,
          rowCount: state.exam.length,
          executionTimeMs: performance.now() - startTime,
        };
      }

      if (viewName === 'vw_seat_availability') {
        const rows = state.seat
          .filter(s => s.status === 'Available')
          .slice(0, 100)
          .map(s => {
            const h = state.hall.find(hall => hall.hall_id === s.hall_id);
            return {
              seat_id: s.seat_id,
              seat_number: s.seat_number,
              hall_number: h?.hall_number || 'NA',
              building: h?.building || 'NA',
              row_number: s.row_number,
              column_number: s.column_number,
              status: s.status,
            };
          });
        return {
          success: true,
          columns: Object.keys(rows[0] || {}),
          rows,
          rowCount: rows.length,
          executionTimeMs: performance.now() - startTime,
        };
      }

      // Default enriched allocations view
      const rows = enriched.map(e => ({
        allocation_id: e.allocation_id,
        roll_no: e.roll_no,
        student_name: e.student_name,
        branch: e.branch,
        subject_name: e.subject_name,
        exam_date: e.exam_date,
        start_time: e.start_time,
        hall_number: e.hall_number,
        building: e.building,
        seat_number: e.seat_number,
        row_number: e.row_number,
        column_number: e.column_number,
      }));
      return {
        success: true,
        columns: Object.keys(rows[0] || {}),
        rows: rows.slice(0, 150),
        rowCount: rows.length,
        executionTimeMs: performance.now() - startTime,
      };
    }
  }

  // Check for Aggregates: e.g., SELECT COUNT(*) FROM student
  if (qLower.includes('count(') || qLower.includes('avg(') || qLower.includes('max(') || qLower.includes('min(') || qLower.includes('sum(')) {
    if (qLower.includes('group by')) {
      // Group by branch
      if (qLower.includes('branch')) {
        const counts: Record<string, number> = {};
        state.student.forEach(s => {
          counts[s.branch] = (counts[s.branch] || 0) + 1;
        });
        const rows = Object.entries(counts).map(([branch, count]) => ({
          branch,
          student_count: count,
          pct_of_total: `${((count / state.student.length) * 100).toFixed(1)}%`,
        }));
        return {
          success: true,
          columns: ['branch', 'student_count', 'pct_of_total'],
          rows,
          rowCount: rows.length,
          executionTimeMs: performance.now() - startTime,
        };
      }
      if (qLower.includes('hall')) {
        const rows = state.hall.map(h => {
          const occ = enriched.filter(e => e.hall_id === h.hall_id).length;
          return {
            hall_number: h.hall_number,
            capacity: h.capacity,
            occupied: occ,
            available: h.capacity - occ,
          };
        });
        return {
          success: true,
          columns: ['hall_number', 'capacity', 'occupied', 'available'],
          rows,
          rowCount: rows.length,
          executionTimeMs: performance.now() - startTime,
        };
      }
    }

    // Scalar aggregate
    if (qLower.includes('from student')) {
      return {
        success: true,
        columns: ['total_students', 'distinct_branches', 'active_years'],
        rows: [{ total_students: state.student.length, distinct_branches: 6, active_years: 4 }],
        rowCount: 1,
        executionTimeMs: performance.now() - startTime,
      };
    }
    if (qLower.includes('from hall') || qLower.includes('from seat')) {
      const totalSeats = state.seat.length;
      const occSeats = state.seat.filter(s => s.status === 'Occupied').length;
      return {
        success: true,
        columns: ['total_seats', 'occupied_seats', 'available_seats', 'utilization_pct'],
        rows: [
          {
            total_seats: totalSeats,
            occupied_seats: occSeats,
            available_seats: totalSeats - occSeats,
            utilization_pct: `${((occSeats / totalSeats) * 100).toFixed(1)}%`,
          },
        ],
        rowCount: 1,
        executionTimeMs: performance.now() - startTime,
      };
    }
  }

  // Determine Source Table
  let source: any[] = [];
  let tableName = 'student';

  if (qLower.includes('join') || (qLower.includes('allocation') && (qLower.includes('hall') || qLower.includes('student')))) {
    source = enriched;
    tableName = 'allocation_joined';
  } else if (qLower.includes('from student')) {
    source = state.student;
    tableName = 'student';
  } else if (qLower.includes('from faculty')) {
    source = state.faculty;
    tableName = 'faculty';
  } else if (qLower.includes('from exam')) {
    source = state.exam;
    tableName = 'exam';
  } else if (qLower.includes('from hall')) {
    source = state.hall;
    tableName = 'hall';
  } else if (qLower.includes('from seat')) {
    source = state.seat;
    tableName = 'seat';
  } else if (qLower.includes('from allocation')) {
    source = state.allocation;
    tableName = 'allocation';
  } else if (qLower.includes('from audit_log')) {
    source = state.audit_log;
    tableName = 'audit_log';
  } else {
    source = state.student;
  }

  // Filtering WHERE clauses
  let filtered = [...source];

  if (qLower.includes('where')) {
    const wherePart = qLower.split('where')[1].split(/order by|group by|limit/)[0];

    // Branch filter
    for (const b of ['cse', 'ece', 'mech', 'civil', 'it', 'ai&ds']) {
      if (wherePart.includes(`'${b}'`) || wherePart.includes(`"${b}"`) || wherePart.includes(`= ${b}`)) {
        filtered = filtered.filter(row => (row.branch || row.department || '').toLowerCase() === b);
      }
    }

    // Gender filter
    if (wherePart.includes("'female'") || wherePart.includes('"female"')) {
      filtered = filtered.filter(row => row.gender === 'Female');
    } else if (wherePart.includes("'male'") || wherePart.includes('"male"')) {
      filtered = filtered.filter(row => row.gender === 'Male');
    }

    // Status filter
    if (wherePart.includes("'available'")) {
      filtered = filtered.filter(row => row.status === 'Available');
    } else if (wherePart.includes("'occupied'")) {
      filtered = filtered.filter(row => row.status === 'Occupied');
    }

    // Hall number filter
    const hallMatch = wherePart.match(/h[a-z0-9_\-\s='"]*h-?(\d+)/i);
    if (hallMatch) {
      filtered = filtered.filter(row => (row.hall_number || '').toLowerCase().includes(hallMatch[1]));
    }

    // LIKE '%keyword%'
    const likeMatch = wherePart.match(/like\s+'%?([a-zA-Z0-9_\-]+)%?'/i);
    if (likeMatch) {
      const term = likeMatch[1].toLowerCase();
      filtered = filtered.filter(row =>
        Object.values(row).some(val => String(val).toLowerCase().includes(term))
      );
    }
  }

  // ORDER BY
  if (qLower.includes('order by')) {
    const isDesc = qLower.includes(' desc');
    if (qLower.includes('roll_no') || qLower.includes('roll')) {
      filtered.sort((a, b) => (isDesc ? (b.roll_no > a.roll_no ? 1 : -1) : (a.roll_no > b.roll_no ? 1 : -1)));
    } else if (qLower.includes('exam_date') || qLower.includes('date')) {
      filtered.sort((a, b) => (isDesc ? (b.exam_date > a.exam_date ? 1 : -1) : (a.exam_date > b.exam_date ? 1 : -1)));
    } else if (qLower.includes('capacity')) {
      filtered.sort((a, b) => (isDesc ? b.capacity - a.capacity : a.capacity - b.capacity));
    }
  }

  // LIMIT
  let limit = 100;
  const limitMatch = qLower.match(/limit\s+(\d+)/);
  if (limitMatch) {
    limit = parseInt(limitMatch[1], 10);
  }
  const resultRows = filtered.slice(0, limit);

  // Column projection
  let columns: string[] = [];
  if (resultRows.length > 0) {
    columns = Object.keys(resultRows[0]);
  } else if (source.length > 0) {
    columns = Object.keys(source[0]);
  } else {
    columns = ['result'];
  }

  return {
    success: true,
    columns,
    rows: resultRows,
    rowCount: filtered.length,
    executionTimeMs: performance.now() - startTime,
  };
}
