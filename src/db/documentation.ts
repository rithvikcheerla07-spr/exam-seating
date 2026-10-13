export const academicDocumentation = {
  title: 'Exam Hall and Seating Allocation System',
  course: 'Capstone Bachelor Project (CBP) / Final Year Major Project',
  domain: 'Database Management Systems & Web Engineering',
  techStack: 'Python Flask, MySQL 8.0, HTML5/CSS3/JavaScript, React 19',

  abstract: `Examinations represent a mission-critical academic process in collegiate institutions, yet the traditional logistical methodology of manual seat planning and hall allocation is plagued by human errors, redundant paperwork, hall underutilization, and accidental duplicate assignments. This project presents the "Exam Hall and Seating Allocation System", an enterprise-grade automated web and relational database solution engineered to eliminate manual overhead. The system features a multi-tiered architecture: an Administrative Control Center providing complete CRUD capabilities, automated collision-free seating algorithms, comprehensive analytical reporting, and live database management utilities; alongside a unified, read-only Student and Faculty Portal offering instant admit-card seat inquiries, interactive hall seating visualizers, and printable invigilation door charts. The underlying database schema is rigorously normalized up to Boyce-Codd / Third Normal Form (3NF), implementing B+ Tree indexes, domain and referential integrity constraints, virtual views, audit triggers, and transactional ACID boundaries to guarantee bulletproof academic integrity and instantaneous sub-second query execution.`,

  problemStatement: `In contemporary educational establishments:
1. Examination administrative staff spend dozens of hours manually drawing seating charts on paper and whiteboards for thousands of examinees.
2. Manual allocation inevitably leads to duplicate seat assignments (two students assigned the exact same desk), causing high friction on exam morning.
3. Students crowd around physical notice boards creating severe hallway congestion and anxiety minutes before the exam commences.
4. Invigilation faculty lack real-time digital attendance checklists, increasing the likelihood of proxy attendance.
5. Lack of relational database constraints leads to data anomalies and inconsistent record-keeping across academic departments.`,

  objectives: [
    'Automate the allocation of examination seats using a deterministic row-major algorithm with zero manual intervention.',
    'Eliminate duplicate seat assignments through database unique constraints and event-driven triggers.',
    'Enforce physical hall capacities so that room limits are never breached under any circumstances.',
    'Provide instantaneous, self-service seating lookup for students via their university Roll Number.',
    'Supply invigilating faculty with printable door attendance sheets and interactive room seating maps.',
    'Demonstrate real-world application of core DBMS principles including 3NF normalization, referential integrity, stored procedures, triggers, views, and ACID transactions.',
  ],

  normalization: {
    unf: {
      title: 'Unnormalized Form (UNF)',
      description: 'Contains repeating groups and multi-valued attributes in a monolithic flat file.',
      schema: 'EXAM_SYSTEM_UNF (student_roll, student_name, branch, subjects_list, exam_dates, hall_numbers, seat_numbers, faculty_names)',
      issues: 'Repeating multivalued subjects, massive redundancy, dangerous update anomalies.',
    },
    inf: {
      title: 'First Normal Form (1NF)',
      description: 'All attributes are atomic scalar values; repeating groups removed; unique primary key established.',
      schema: `STUDENT_1NF (student_id [PK], roll_no [UNI], name, branch, year, section, email, phone)
HALL_1NF (hall_id [PK], hall_number, building, floor, capacity)
EXAM_1NF (exam_id [PK], subject_code, subject_name, branch, year, exam_date, start_time, end_time)
ALLOCATION_1NF (student_id [PK1], exam_id [PK2], hall_number, seat_number, allocation_date)`,
      issues: 'Partial functional dependency: In ALLOCATION_1NF, hall_number is partially dependent on the composite key.',
    },
    iinf: {
      title: 'Second Normal Form (2NF)',
      description: 'In 1NF and contains NO partial functional dependencies. Every non-prime attribute is fully functionally dependent on candidate key.',
      schema: `SEAT_2NF (seat_id [PK], hall_id [FK], seat_number, row_no, col_no, status)
ALLOCATION_2NF (allocation_id [PK], student_id [FK], exam_id [FK], seat_id [FK], allocation_date)`,
      issues: 'Transitive dependencies if room characteristics were stored inside SEAT.',
    },
    iiinf: {
      title: 'Third Normal Form (3NF)',
      description: 'In 2NF and contains NO transitive functional dependencies (X -> Y and Y -> Z eliminated). All attributes depend strictly on the key, the whole key, and nothing but the key.',
      schema: `STUDENT (student_id [PK], roll_no [UNI], student_name, gender, branch, year, section, email [UNI], phone, password)
FACULTY (faculty_id [PK], faculty_name, department, email [UNI], phone, password)
EXAM (exam_id [PK], subject_code, subject_name, branch, year, exam_date, start_time, end_time)
HALL (hall_id [PK], hall_number [UNI], building, floor, capacity, rows, columns)
SEAT (seat_id [PK], hall_id [FK], seat_number, row_number, column_number, status)
ALLOCATION (allocation_id [PK], student_id [FK], exam_id [FK], seat_id [FK], allocation_date)
AUDIT_LOG (log_id [PK], action, table_name, record_id, timestamp, details)`,
      benefits: 'Zero update anomalies, canonical storage, minimal storage footprint, referential purity.',
    },
  },

  erDiagram: {
    entities: [
      { name: 'ADMIN', attributes: ['admin_id (PK)', 'username (UNI)', 'password', 'name', 'email'] },
      { name: 'STUDENT', attributes: ['student_id (PK)', 'roll_no (UNI)', 'student_name', 'gender', 'branch', 'year', 'section', 'email', 'phone', 'password'] },
      { name: 'FACULTY', attributes: ['faculty_id (PK)', 'faculty_name', 'department', 'email', 'phone', 'password'] },
      { name: 'EXAM', attributes: ['exam_id (PK)', 'subject_code', 'subject_name', 'branch', 'year', 'exam_date', 'start_time', 'end_time'] },
      { name: 'HALL', attributes: ['hall_id (PK)', 'hall_number (UNI)', 'building', 'floor', 'capacity', 'rows', 'columns'] },
      { name: 'SEAT', attributes: ['seat_id (PK)', 'hall_id (FK)', 'seat_number', 'row_number', 'column_number', 'status'] },
      { name: 'ALLOCATION', attributes: ['allocation_id (PK)', 'student_id (FK)', 'exam_id (FK)', 'seat_id (FK)', 'allocation_date'] },
      { name: 'AUDIT_LOG', attributes: ['log_id (PK)', 'action', 'table_name', 'record_id', 'timestamp', 'details'] },
    ],
    relationships: [
      { from: 'HALL', to: 'SEAT', type: '1 : N', description: 'One Hall contains Many physical Seats (Total participation of Seat in Hall)' },
      { from: 'STUDENT', to: 'ALLOCATION', type: '1 : N', description: 'One Student receives Many Allocations across distinct exams' },
      { from: 'EXAM', to: 'ALLOCATION', type: '1 : N', description: 'One Exam involves Many Allocations' },
      { from: 'SEAT', to: 'ALLOCATION', type: '1 : N', description: 'One Seat is allocated to Many Allocations (on different dates/times)' },
    ],
  },

  algorithms: {
    allocationAlgorithm: `Algorithm: Automatic Row-Major Exam Seating Allocation
Input: target_exam_id, list_of_selected_hall_ids
Output: Success/Failure status and count of allocated examinees

1. START TRANSACTION (ACID isolation)
2. Fetch examinee students:
   STUDENTS = SELECT student_id, roll_no FROM student 
              WHERE branch = EXAM.branch AND year = EXAM.year 
              ORDER BY roll_no ASC
3. Fetch vacant seats across selected halls:
   SEATS = SELECT seat_id, hall_id, seat_number FROM seat 
           WHERE hall_id IN (selected_hall_ids) AND status = 'Available' 
           ORDER BY hall_id ASC, row_number ASC, column_number ASC
4. Verify capacity:
   IF LENGTH(SEATS) < LENGTH(STUDENTS) THEN
      ROLLBACK TRANSACTION
      RAISE EXCEPTION "Hall capacity insufficient for examinee headcount"
5. For i = 0 TO LENGTH(STUDENTS) - 1:
      current_student = STUDENTS[i]
      current_seat = SEATS[i]
      
      -- Insert Allocation record
      INSERT INTO allocation (student_id, exam_id, seat_id, allocation_date)
      VALUES (current_student.student_id, target_exam_id, current_seat.seat_id, NOW())
      
      -- Update physical seat state
      UPDATE seat SET status = 'Occupied' WHERE seat_id = current_seat.seat_id
6. COMMIT TRANSACTION
7. INSERT INTO audit_log VALUES ("AUTO_ALLOCATE", "ALLOCATION", LENGTH(STUDENTS), NOW(), "Completed without collision")
8. RETURN SUCCESS`,
  },

  rawMySQLScript: `-- =====================================================================
-- EXAM HALL AND SEATING ALLOCATION SYSTEM - COMPLETE MYSQL DDL & DML
-- Final Year Capstone Bachelor Project (CBP)
-- Compatible with MySQL 8.0+ / MariaDB 10.5+
-- =====================================================================

DROP DATABASE IF EXISTS exam_alloc_db;
CREATE DATABASE exam_alloc_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE exam_alloc_db;

-- 1. ADMIN TABLE
CREATE TABLE admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. STUDENT TABLE
CREATE TABLE student (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    roll_no VARCHAR(20) NOT NULL UNIQUE,
    student_name VARCHAR(100) NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL DEFAULT 'Male',
    branch VARCHAR(20) NOT NULL,
    year INT NOT NULL CHECK (year BETWEEN 1 AND 4),
    section CHAR(1) NOT NULL DEFAULT 'A',
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_student_roll (roll_no),
    INDEX idx_student_branch (branch)
) ENGINE=InnoDB;

-- 3. FACULTY TABLE
CREATE TABLE faculty (
    faculty_id VARCHAR(20) PRIMARY KEY,
    faculty_name VARCHAR(100) NOT NULL,
    department VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_faculty_dept (department)
) ENGINE=InnoDB;

-- 4. EXAM TABLE
CREATE TABLE exam (
    exam_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_code VARCHAR(20) NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    branch VARCHAR(20) NOT NULL,
    year INT NOT NULL CHECK (year BETWEEN 1 AND 4),
    exam_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_exam_date (exam_date),
    INDEX idx_exam_subject (subject_code)
) ENGINE=InnoDB;

-- 5. HALL TABLE
CREATE TABLE hall (
    hall_id INT AUTO_INCREMENT PRIMARY KEY,
    hall_number VARCHAR(20) NOT NULL UNIQUE,
    building VARCHAR(50) NOT NULL,
    floor INT NOT NULL DEFAULT 1,
    capacity INT NOT NULL CHECK (capacity > 0),
    \`rows\` INT NOT NULL DEFAULT 6,
    \`columns\` INT NOT NULL DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 6. SEAT TABLE
CREATE TABLE seat (
    seat_id INT AUTO_INCREMENT PRIMARY KEY,
    hall_id INT NOT NULL,
    seat_number VARCHAR(20) NOT NULL,
    row_number INT NOT NULL,
    column_number INT NOT NULL,
    status ENUM('Available', 'Occupied', 'Maintenance') NOT NULL DEFAULT 'Available',
    CONSTRAINT fk_seat_hall FOREIGN KEY (hall_id) REFERENCES hall (hall_id) ON DELETE CASCADE,
    CONSTRAINT uq_hall_seat UNIQUE (hall_id, seat_number),
    INDEX idx_seat_status (status)
) ENGINE=InnoDB;

-- 7. ALLOCATION TABLE
CREATE TABLE allocation (
    allocation_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    exam_id INT NOT NULL,
    seat_id INT NOT NULL,
    allocation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_alloc_student FOREIGN KEY (student_id) REFERENCES student (student_id) ON DELETE RESTRICT,
    CONSTRAINT fk_alloc_exam FOREIGN KEY (exam_id) REFERENCES exam (exam_id) ON DELETE CASCADE,
    CONSTRAINT fk_alloc_seat FOREIGN KEY (seat_id) REFERENCES seat (seat_id) ON DELETE RESTRICT,
    CONSTRAINT uq_student_exam UNIQUE (student_id, exam_id),
    CONSTRAINT uq_exam_seat UNIQUE (exam_id, seat_id)
) ENGINE=InnoDB;

-- 8. AUDIT_LOG TABLE
CREATE TABLE audit_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id VARCHAR(50),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    details TEXT
) ENGINE=InnoDB;

-- =====================================================================
-- DATABASE VIEWS
-- =====================================================================

CREATE OR REPLACE VIEW vw_student_allocations AS
SELECT 
    a.allocation_id,
    s.student_id,
    s.roll_no,
    s.student_name,
    s.gender,
    s.branch,
    s.year,
    s.section,
    e.exam_id,
    e.subject_code,
    e.subject_name,
    e.exam_date,
    e.start_time,
    e.end_time,
    h.hall_id,
    h.hall_number,
    h.building,
    h.floor,
    se.seat_id,
    se.seat_number,
    se.row_number,
    se.column_number,
    a.allocation_date
FROM allocation a
JOIN student s ON a.student_id = s.student_id
JOIN exam e ON a.exam_id = e.exam_id
JOIN seat se ON a.seat_id = se.seat_id
JOIN hall h ON se.hall_id = h.hall_id;

CREATE OR REPLACE VIEW vw_hall_occupancy AS
SELECT 
    h.hall_id,
    h.hall_number,
    h.building,
    h.floor,
    h.capacity,
    COUNT(a.allocation_id) AS occupied_seats,
    (h.capacity - COUNT(a.allocation_id)) AS available_seats,
    ROUND((COUNT(a.allocation_id) * 100.0 / h.capacity), 2) AS occupancy_percentage
FROM hall h
LEFT JOIN seat s ON h.hall_id = s.hall_id
LEFT JOIN allocation a ON s.seat_id = a.seat_id
GROUP BY h.hall_id, h.hall_number, h.building, h.floor, h.capacity;

-- =====================================================================
-- DATABASE TRIGGERS
-- =====================================================================

DELIMITER $$

-- Trigger 1: Prevent duplicate seat allocation
CREATE TRIGGER trg_prevent_duplicate_seat
BEFORE INSERT ON allocation
FOR EACH ROW
BEGIN
    IF EXISTS (SELECT 1 FROM allocation WHERE exam_id = NEW.exam_id AND seat_id = NEW.seat_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Integrity Violation: Seat already allocated for this exam session.';
    END IF;
END$$

-- Trigger 2: Update seat status to Occupied
CREATE TRIGGER trg_update_seat_occupied
AFTER INSERT ON allocation
FOR EACH ROW
BEGIN
    UPDATE seat SET status = 'Occupied' WHERE seat_id = NEW.seat_id;
END$$

-- Trigger 3: Revert seat status to Available upon cancellation
CREATE TRIGGER trg_update_seat_freed
AFTER DELETE ON allocation
FOR EACH ROW
BEGIN
    UPDATE seat SET status = 'Available' WHERE seat_id = OLD.seat_id;
END$$

-- =====================================================================
-- STORED PROCEDURES
-- =====================================================================

CREATE PROCEDURE sp_add_student(
    IN p_roll_no VARCHAR(20),
    IN p_name VARCHAR(100),
    IN p_gender VARCHAR(10),
    IN p_branch VARCHAR(20),
    IN p_year INT,
    IN p_section CHAR(1),
    IN p_email VARCHAR(100),
    IN p_phone VARCHAR(15),
    IN p_password VARCHAR(255)
)
BEGIN
    INSERT INTO student (roll_no, student_name, gender, branch, year, section, email, phone, password)
    VALUES (p_roll_no, p_name, p_gender, p_branch, p_year, p_section, p_email, p_phone, p_password);
END$$

DELIMITER ;
`,
};
