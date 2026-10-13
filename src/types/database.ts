export type Gender = 'Male' | 'Female' | 'Other';
export type Branch = 'CSE' | 'ECE' | 'MECH' | 'CIVIL' | 'IT' | 'AI&DS';
export type Year = 1 | 2 | 3 | 4;
export type Section = 'A' | 'B' | 'C';
export type SeatStatus = 'Available' | 'Occupied' | 'Maintenance';

export interface Admin {
  admin_id: number;
  username: string;
  password: string;
  name: string;
  email: string;
}

export interface Student {
  student_id: number;
  roll_no: string;
  student_name: string;
  gender: Gender;
  branch: Branch;
  year: Year;
  section: Section;
  email: string;
  phone: string;
  password: string;
}

export interface Faculty {
  faculty_id: string; // e.g., FAC101
  faculty_name: string;
  department: Branch;
  email: string;
  phone?: string;
  password: string;
}

export interface Exam {
  exam_id: number;
  subject_code: string;
  subject_name: string;
  branch: Branch;
  year: Year;
  exam_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  end_time: string; // HH:MM
}

export interface Hall {
  hall_id: number;
  hall_number: string;
  building: string;
  floor: number;
  capacity: number;
  rows: number;
  columns: number;
}

export interface Seat {
  seat_id: number;
  hall_id: number;
  seat_number: string;
  row_number: number;
  column_number: number;
  status: SeatStatus;
}

export interface Allocation {
  allocation_id: number;
  student_id: number;
  exam_id: number;
  seat_id: number;
  allocation_date: string;
}

export interface AuditLog {
  log_id: number;
  action: string;
  table_name: string;
  record_id?: number | string;
  timestamp: string;
  details: string;
}

export interface AllocationEnriched {
  allocation_id: number;
  student_id: number;
  roll_no: string;
  student_name: string;
  gender: Gender;
  branch: Branch;
  year: Year;
  section: Section;
  exam_id: number;
  subject_code: string;
  subject_name: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  seat_id: number;
  seat_number: string;
  row_number: number;
  column_number: number;
  hall_id: number;
  hall_number: string;
  building: string;
  floor: number;
  allocation_date: string;
}
