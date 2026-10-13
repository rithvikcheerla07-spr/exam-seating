import {
  Admin,
  Student,
  Faculty,
  Exam,
  Hall,
  Seat,
  Allocation,
  AuditLog,
  Branch,
  Gender,
  Section,
  Year,
} from '../types/database';

export const initialAdmin: Admin = {
  admin_id: 1,
  username: 'admin',
  password: 'password123',
  name: 'Chief Examination Officer',
  email: 'examcell@university.edu',
};

// Generate 30 Faculty
const branches: Branch[] = ['CSE', 'ECE', 'MECH', 'CIVIL', 'IT', 'AI&DS'];
const facultyFirstNames = [
  'Arun', 'Priya', 'Rajesh', 'Suresh', 'Deepa', 'Venkatesh', 'Ananya', 'Kavitha',
  'Siddharth', 'Lakshmi', 'Ramesh', 'Meenakshi', 'Harish', 'Sunita', 'Girish',
  'Swati', 'Karthik', 'Nandini', 'Prashant', 'Rekha', 'Manoj', 'Bhavana', 'Satish',
  'Pallavi', 'Vikram', 'Divya', 'Raghav', 'Shruti', 'Santosh', 'Usha'
];
const facultyLastNames = [
  'Sharma', 'Verma', 'Rao', 'Nair', 'Iyer', 'Patel', 'Reddy', 'Choudhury',
  'Deshmukh', 'Kulkarni', 'Bose', 'Menon', 'Gupta', 'Pillai', 'Naidu',
  'Bhat', 'Shetty', 'Pawar', 'Joshi', 'Mukherjee', 'Das', 'Sen', 'Tripathi',
  'Mishra', 'Pandey', 'Saxena', 'Kapoor', 'Malhotra', 'Bhattacharya', 'Dubey'
];

export const initialFaculty: Faculty[] = facultyFirstNames.map((first, idx) => {
  const last = facultyLastNames[idx % facultyLastNames.length];
  const dept = branches[idx % branches.length];
  const idNum = (101 + idx).toString();
  return {
    faculty_id: `FAC${idNum}`,
    faculty_name: `Dr. ${first} ${last}`,
    department: dept,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@university.edu`,
    phone: `+91 98765 ${10000 + idx}`,
    password: 'password123',
  };
});

// Generate 20 Exams
export const initialExams: Exam[] = [
  { exam_id: 1, subject_code: 'CS401', subject_name: 'Database Management Systems', branch: 'CSE', year: 3, exam_date: '2026-11-10', start_time: '09:30', end_time: '12:30' },
  { exam_id: 2, subject_code: 'CS402', subject_name: 'Operating Systems & Concurrency', branch: 'CSE', year: 3, exam_date: '2026-11-12', start_time: '09:30', end_time: '12:30' },
  { exam_id: 3, subject_code: 'CS403', subject_name: 'Design and Analysis of Algorithms', branch: 'CSE', year: 3, exam_date: '2026-11-14', start_time: '09:30', end_time: '12:30' },
  { exam_id: 4, subject_code: 'CS404', subject_name: 'Computer Networks', branch: 'CSE', year: 3, exam_date: '2026-11-17', start_time: '09:30', end_time: '12:30' },
  { exam_id: 5, subject_code: 'EC301', subject_name: 'Digital Signal Processing', branch: 'ECE', year: 3, exam_date: '2026-11-10', start_time: '09:30', end_time: '12:30' },
  { exam_id: 6, subject_code: 'EC302', subject_name: 'VLSI Circuit Design', branch: 'ECE', year: 3, exam_date: '2026-11-13', start_time: '09:30', end_time: '12:30' },
  { exam_id: 7, subject_code: 'EC303', subject_name: 'Microprocessors and Interfacing', branch: 'ECE', year: 3, exam_date: '2026-11-16', start_time: '09:30', end_time: '12:30' },
  { exam_id: 8, subject_code: 'ME401', subject_name: 'Applied Thermodynamics', branch: 'MECH', year: 3, exam_date: '2026-11-11', start_time: '14:00', end_time: '17:00' },
  { exam_id: 9, subject_code: 'ME402', subject_name: 'Fluid Mechanics & Turbomachinery', branch: 'MECH', year: 3, exam_date: '2026-11-14', start_time: '14:00', end_time: '17:00' },
  { exam_id: 10, subject_code: 'ME403', subject_name: 'Finite Element Analysis', branch: 'MECH', year: 4, exam_date: '2026-11-18', start_time: '14:00', end_time: '17:00' },
  { exam_id: 11, subject_code: 'CE301', subject_name: 'Structural Analysis II', branch: 'CIVIL', year: 3, exam_date: '2026-11-11', start_time: '14:00', end_time: '17:00' },
  { exam_id: 12, subject_code: 'CE302', subject_name: 'Geotechnical Engineering', branch: 'CIVIL', year: 3, exam_date: '2026-11-15', start_time: '14:00', end_time: '17:00' },
  { exam_id: 13, subject_code: 'IT401', subject_name: 'Full Stack Web Engineering', branch: 'IT', year: 3, exam_date: '2026-11-10', start_time: '09:30', end_time: '12:30' },
  { exam_id: 14, subject_code: 'IT402', subject_name: 'Cloud Computing & Virtualization', branch: 'IT', year: 3, exam_date: '2026-11-13', start_time: '09:30', end_time: '12:30' },
  { exam_id: 15, subject_code: 'AI301', subject_name: 'Machine Learning Foundations', branch: 'AI&DS', year: 3, exam_date: '2026-11-10', start_time: '09:30', end_time: '12:30' },
  { exam_id: 16, subject_code: 'AI302', subject_name: 'Deep Learning & Neural Networks', branch: 'AI&DS', year: 3, exam_date: '2026-11-15', start_time: '09:30', end_time: '12:30' },
  { exam_id: 17, subject_code: 'CS201', subject_name: 'Data Structures and Algorithms', branch: 'CSE', year: 2, exam_date: '2026-11-20', start_time: '09:30', end_time: '12:30' },
  { exam_id: 18, subject_code: 'CS202', subject_name: 'Discrete Mathematical Structures', branch: 'CSE', year: 2, exam_date: '2026-11-22', start_time: '09:30', end_time: '12:30' },
  { exam_id: 19, subject_code: 'EC201', subject_name: 'Electronic Devices & Circuits', branch: 'ECE', year: 2, exam_date: '2026-11-21', start_time: '14:00', end_time: '17:00' },
  { exam_id: 20, subject_code: 'HS101', subject_name: 'Professional Ethics & Cyber Law', branch: 'CSE', year: 1, exam_date: '2026-11-25', start_time: '09:30', end_time: '12:30' }
];

// Generate 15 Halls
export const initialHalls: Hall[] = [
  { hall_id: 1, hall_number: 'H-101', building: 'Science & Tech Block', floor: 1, capacity: 60, rows: 6, columns: 10 },
  { hall_id: 2, hall_number: 'H-102', building: 'Science & Tech Block', floor: 1, capacity: 60, rows: 6, columns: 10 },
  { hall_id: 3, hall_number: 'H-103', building: 'Science & Tech Block', floor: 1, capacity: 60, rows: 6, columns: 10 },
  { hall_id: 4, hall_number: 'H-104', building: 'Science & Tech Block', floor: 1, capacity: 60, rows: 6, columns: 10 },
  { hall_id: 5, hall_number: 'H-201', building: 'Engineering Tower A', floor: 2, capacity: 60, rows: 6, columns: 10 },
  { hall_id: 6, hall_number: 'H-202', building: 'Engineering Tower A', floor: 2, capacity: 60, rows: 6, columns: 10 },
  { hall_id: 7, hall_number: 'H-203', building: 'Engineering Tower A', floor: 2, capacity: 60, rows: 6, columns: 10 },
  { hall_id: 8, hall_number: 'H-204', building: 'Engineering Tower A', floor: 2, capacity: 60, rows: 6, columns: 10 },
  { hall_id: 9, hall_number: 'H-301', building: 'Engineering Tower B', floor: 3, capacity: 60, rows: 6, columns: 10 },
  { hall_id: 10, hall_number: 'H-302', building: 'Engineering Tower B', floor: 3, capacity: 60, rows: 6, columns: 10 },
  { hall_id: 11, hall_number: 'H-303', building: 'Engineering Tower B', floor: 3, capacity: 60, rows: 6, columns: 10 },
  { hall_id: 12, hall_number: 'H-401', building: 'Central Academic Block', floor: 4, capacity: 60, rows: 6, columns: 10 },
  { hall_id: 13, hall_number: 'H-402', building: 'Central Academic Block', floor: 4, capacity: 60, rows: 6, columns: 10 },
  { hall_id: 14, hall_number: 'H-403', building: 'Central Academic Block', floor: 4, capacity: 60, rows: 6, columns: 10 },
  { hall_id: 15, hall_number: 'H-404', building: 'Central Academic Block', floor: 4, capacity: 60, rows: 6, columns: 10 },
];

// Generate 900 Seats (60 seats per hall = 15 * 60 = 900 seats)
export const initialSeats: Seat[] = [];
let seatCounter = 1;
for (const hall of initialHalls) {
  for (let r = 1; r <= hall.rows; r++) {
    for (let c = 1; c <= hall.columns; c++) {
      const seatNum = `${hall.hall_number.replace('-', '')}-R${r}C${c}`;
      initialSeats.push({
        seat_id: seatCounter++,
        hall_id: hall.hall_id,
        seat_number: seatNum,
        row_number: r,
        column_number: c,
        status: 'Available',
      });
    }
  }
}

// Generate 300 Students
const studentFirstNames = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
  'Dhruv', 'Shaurya', 'Kabir', 'Rishi', 'Atharv', 'Rohan', 'Aryan', 'Samarth', 'Advait', 'Pranav',
  'Diya', 'Saanvi', 'Ananya', 'Aadhya', 'Pari', 'Anika', 'Navya', 'Angel', 'Isha', 'Myra',
  'Kavya', 'Riya', 'Siya', 'Shanaya', 'Tanvi', 'Ahana', 'Meera', 'Sara', 'Avani', 'Aditi',
  'Manish', 'Nikhil', 'Tanmay', 'Tushar', 'Yash', 'Varun', 'Omkar', 'Gaurav', 'Abhishek', 'Akash',
  'Pooja', 'Sneha', 'Shreya', 'Divya', 'Neha', 'Komal', 'Swati', 'Preeti', 'Kritika', 'Nidhi'
];
const studentLastNames = [
  'Sharma', 'Verma', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Choudhary', 'Iyer', 'Nair', 'Rao',
  'Deshmukh', 'Kulkarni', 'Joshi', 'Bose', 'Gupta', 'Shah', 'Mehta', 'Mishra', 'Pandey', 'Pawar'
];

export const initialStudents: Student[] = [];
let studentId = 1;

// 60 CSE, 50 ECE, 40 MECH, 40 CIVIL, 50 IT, 60 AI&DS = 300 students
const branchQuotas: { branch: Branch; code: string; count: number }[] = [
  { branch: 'CSE', code: '23CS', count: 60 },
  { branch: 'ECE', code: '23EC', count: 50 },
  { branch: 'MECH', code: '23ME', count: 40 },
  { branch: 'CIVIL', code: '23CE', count: 40 },
  { branch: 'IT', code: '23IT', count: 50 },
  { branch: 'AI&DS', code: '23AI', count: 60 },
];

for (const quota of branchQuotas) {
  for (let i = 1; i <= quota.count; i++) {
    const fn = studentFirstNames[(studentId - 1) % studentFirstNames.length];
    const ln = studentLastNames[(studentId * 3) % studentLastNames.length];
    const isFemale = ((studentId - 1) % studentFirstNames.length) >= 20 && ((studentId - 1) % studentFirstNames.length) < 40;
    const gender: Gender = isFemale ? 'Female' : 'Male';
    const rollNo = `${quota.code}${i.toString().padStart(3, '0')}`;
    const section: Section = i % 2 === 0 ? 'B' : 'A';
    const year: Year = 3;

    initialStudents.push({
      student_id: studentId,
      roll_no: rollNo,
      student_name: `${fn} ${ln}`,
      gender,
      branch: quota.branch,
      year,
      section,
      email: `${rollNo.toLowerCase()}@student.univ.edu`,
      phone: `+91 91234 ${50000 + studentId}`,
      password: 'password123',
    });
    studentId++;
  }
}

// Generate 300 Initial Allocations for Exam 1 (Database Management Systems, 3rd year CSE) + Exam 5 (DSP, ECE)
// Let's allocate all 60 CSE students (Exam 1) into Hall 101, 50 ECE students (Exam 5) into Hall 102, 
// 50 IT students (Exam 13) into Hall 103, 60 AI&DS (Exam 15) into Hall 104, 40 MECH into Hall 105, 40 CIVIL into Hall 201
// Total 300 students allocated!
export const initialAllocations: Allocation[] = [];
let allocId = 1;

interface PlanAlloc {
  branch: Branch;
  examId: number;
  hallId: number;
}

const planMatrix: PlanAlloc[] = [
  { branch: 'CSE', examId: 1, hallId: 1 },
  { branch: 'ECE', examId: 5, hallId: 2 },
  { branch: 'IT', examId: 13, hallId: 3 },
  { branch: 'AI&DS', examId: 15, hallId: 4 },
  { branch: 'MECH', examId: 8, hallId: 5 },
  { branch: 'CIVIL', examId: 11, hallId: 6 },
];

for (const plan of planMatrix) {
  const branchStudents = initialStudents.filter(s => s.branch === plan.branch);
  const hallSeats = initialSeats.filter(s => s.hall_id === plan.hallId);

  branchStudents.forEach((student, idx) => {
    if (idx < hallSeats.length) {
      const seat = hallSeats[idx];
      seat.status = 'Occupied';
      initialAllocations.push({
        allocation_id: allocId++,
        student_id: student.student_id,
        exam_id: plan.examId,
        seat_id: seat.seat_id,
        allocation_date: '2026-11-01 10:00:00',
      });
    }
  });
}

export const initialAuditLogs: AuditLog[] = [
  {
    log_id: 1,
    action: 'SCHEMA_INITIALIZED',
    table_name: 'SYSTEM',
    record_id: 'DB_INIT',
    timestamp: '2026-11-01 09:00:00',
    details: 'Database tables created with Primary and Foreign key constraints, unique indexes, and domain checks.',
  },
  {
    log_id: 2,
    action: 'BULK_IMPORT',
    table_name: 'STUDENT',
    record_id: '300_RECORDS',
    timestamp: '2026-11-01 09:15:00',
    details: 'Imported 300 verified undergraduate student records across CSE, ECE, MECH, CIVIL, IT, AI&DS.',
  },
  {
    log_id: 3,
    action: 'AUTO_ALLOCATE',
    table_name: 'ALLOCATION',
    record_id: '300_SEATS',
    timestamp: '2026-11-01 10:00:00',
    details: 'Executed stored procedure SP_GENERATE_SEATING. Allocated 300 students into Halls H-101 through H-202. Zero collision detected.',
  },
];
