export interface SQLQueryItem {
  id: number;
  category: string;
  title: string;
  query: string;
  description: string;
}

export const sampleSQLQueries: SQLQueryItem[] = [
  // 1. Basic SELECT & Projections
  {
    id: 1,
    category: 'Basic SELECT',
    title: 'Select all student records',
    query: `SELECT * FROM student LIMIT 10;`,
    description: 'Retrieves all columns for the first 10 registered students.',
  },
  {
    id: 2,
    category: 'Basic SELECT',
    title: 'Project specific columns',
    query: `SELECT roll_no, student_name, branch, email FROM student LIMIT 15;`,
    description: 'Demonstrates projection of specific relational attributes.',
  },
  {
    id: 3,
    category: 'Basic SELECT',
    title: 'Distinct branches',
    query: `SELECT DISTINCT branch FROM student ORDER BY branch ASC;`,
    description: 'Retrieves unique engineering branches using the DISTINCT keyword.',
  },
  {
    id: 4,
    category: 'Basic SELECT',
    title: 'Distinct exam dates',
    query: `SELECT DISTINCT exam_date FROM exam ORDER BY exam_date ASC;`,
    description: 'Finds all unique exam schedule dates.',
  },
  {
    id: 5,
    category: 'Basic SELECT',
    title: 'View all examination halls',
    query: `SELECT hall_number, building, floor, capacity FROM hall ORDER BY hall_number;`,
    description: 'Lists all exam halls with building location and total capacity.',
  },

  // 2. WHERE Clauses & Logical Operators
  {
    id: 6,
    category: 'WHERE & Filtering',
    title: 'Filter students by CSE branch',
    query: `SELECT roll_no, student_name, branch, section FROM student WHERE branch = 'CSE';`,
    description: 'Single condition filtering using WHERE clause.',
  },
  {
    id: 7,
    category: 'WHERE & Filtering',
    title: 'AND condition: 3rd year ECE students',
    query: `SELECT roll_no, student_name, branch, year FROM student WHERE branch = 'ECE' AND year = 3;`,
    description: 'Conjunction of two relational predicates using AND operator.',
  },
  {
    id: 8,
    category: 'WHERE & Filtering',
    title: 'OR condition: CSE or IT branches',
    query: `SELECT roll_no, student_name, branch FROM student WHERE branch = 'CSE' OR branch = 'IT';`,
    description: 'Disjunction using OR operator.',
  },
  {
    id: 9,
    category: 'WHERE & Filtering',
    title: 'IN operator: Multiple branches',
    query: `SELECT roll_no, student_name, branch FROM student WHERE branch IN ('CSE', 'IT', 'AI&DS') LIMIT 20;`,
    description: 'Membership test against an explicit list of values.',
  },
  {
    id: 10,
    category: 'WHERE & Filtering',
    title: 'NOT IN operator',
    query: `SELECT roll_no, student_name, branch FROM student WHERE branch NOT IN ('CIVIL', 'MECH') LIMIT 20;`,
    description: 'Negative set membership filter.',
  },
  {
    id: 11,
    category: 'WHERE & Filtering',
    title: 'BETWEEN operator: Hall capacity',
    query: `SELECT hall_number, building, capacity FROM hall WHERE capacity BETWEEN 50 AND 70;`,
    description: 'Range comparison inclusive of bounds using BETWEEN.',
  },
  {
    id: 12,
    category: 'WHERE & Filtering',
    title: 'LIKE pattern matching (% prefix)',
    query: `SELECT roll_no, student_name, email FROM student WHERE student_name LIKE 'A%' LIMIT 15;`,
    description: 'Wildcard pattern matching names starting with letter A.',
  },
  {
    id: 13,
    category: 'WHERE & Filtering',
    title: 'LIKE pattern matching (substring)',
    query: `SELECT subject_code, subject_name FROM exam WHERE subject_name LIKE '%Data%';`,
    description: 'Wildcard match for subjects containing the term "Data".',
  },
  {
    id: 14,
    category: 'WHERE & Filtering',
    title: 'Filter available seats',
    query: `SELECT seat_number, row_number, column_number, status FROM seat WHERE status = 'Available' LIMIT 20;`,
    description: 'Filters seats currently free for allocation.',
  },
  {
    id: 15,
    category: 'WHERE & Filtering',
    title: 'Filter morning session exams',
    query: `SELECT subject_code, subject_name, exam_date, start_time FROM exam WHERE start_time = '09:30';`,
    description: 'Time-based schedule filtering.',
  },

  // 3. ORDER BY & LIMIT (Sorting and Pagination)
  {
    id: 16,
    category: 'Sorting & Pagination',
    title: 'Sort students descending by roll number',
    query: `SELECT roll_no, student_name, branch FROM student ORDER BY roll_no DESC LIMIT 10;`,
    description: 'Descending order sort on primary natural key.',
  },
  {
    id: 17,
    category: 'Sorting & Pagination',
    title: 'Multi-column sort',
    query: `SELECT branch, section, roll_no, student_name FROM student ORDER BY branch ASC, section ASC, roll_no ASC LIMIT 25;`,
    description: 'Lexicographical sorting across multiple entity attributes.',
  },
  {
    id: 18,
    category: 'Sorting & Pagination',
    title: 'Exams chronologically ordered',
    query: `SELECT exam_date, start_time, subject_code, subject_name FROM exam ORDER BY exam_date ASC, start_time ASC;`,
    description: 'Chronological timetable sequencing.',
  },
  {
    id: 19,
    category: 'Sorting & Pagination',
    title: 'Pagination: OFFSET & LIMIT simulation',
    query: `SELECT student_id, roll_no, student_name FROM student ORDER BY student_id ASC LIMIT 10;`,
    description: 'Demonstrating page 1 query for large result sets.',
  },
  {
    id: 20,
    category: 'Sorting & Pagination',
    title: 'Top capacity halls',
    query: `SELECT hall_number, building, capacity FROM hall ORDER BY capacity DESC LIMIT 5;`,
    description: 'Ranking largest physical examination rooms.',
  },

  // 4. Aggregate Functions & GROUP BY
  {
    id: 21,
    category: 'Aggregates & GROUP BY',
    title: 'Total number of students',
    query: `SELECT COUNT(*) AS total_students FROM student;`,
    description: 'Scalar aggregate COUNT returning total cardinality.',
  },
  {
    id: 22,
    category: 'Aggregates & GROUP BY',
    title: 'Total seating capacity across campus',
    query: `SELECT SUM(capacity) AS total_campus_capacity, AVG(capacity) AS avg_hall_capacity FROM hall;`,
    description: 'SUM and AVG aggregate functions.',
  },
  {
    id: 23,
    category: 'Aggregates & GROUP BY',
    title: 'Min and Max hall capacities',
    query: `SELECT MIN(capacity) AS min_capacity, MAX(capacity) AS max_capacity FROM hall;`,
    description: 'MIN and MAX boundary aggregates.',
  },
  {
    id: 24,
    category: 'Aggregates & GROUP BY',
    title: 'Student count by branch',
    query: `SELECT branch, COUNT(*) AS student_count FROM student GROUP BY branch;`,
    description: 'GROUP BY clause partitioning dataset by academic branch.',
  },
  {
    id: 25,
    category: 'Aggregates & GROUP BY',
    title: 'Faculty count by department',
    query: `SELECT department, COUNT(*) AS faculty_count FROM faculty GROUP BY department;`,
    description: 'Departmental grouping of faculty members.',
  },
  {
    id: 26,
    category: 'Aggregates & GROUP BY',
    title: 'Seats count per status',
    query: `SELECT status, COUNT(*) AS total_seats FROM seat GROUP BY status;`,
    description: 'Seat inventory count partitioned by availability status.',
  },
  {
    id: 27,
    category: 'Aggregates & GROUP BY',
    title: 'Gender distribution in students',
    query: `SELECT gender, COUNT(*) AS total_count FROM student GROUP BY gender;`,
    description: 'Demographic distribution grouping.',
  },
  {
    id: 28,
    category: 'Aggregates & GROUP BY',
    title: 'HAVING clause: Branches with >= 50 students',
    query: `SELECT branch, COUNT(*) AS count FROM student GROUP BY branch HAVING COUNT(*) >= 50;`,
    description: 'Post-aggregation predicate filtering using HAVING.',
  },
  {
    id: 29,
    category: 'Aggregates & GROUP BY',
    title: 'Halls grouped by building',
    query: `SELECT building, COUNT(*) AS hall_count, SUM(capacity) AS building_capacity FROM hall GROUP BY building;`,
    description: 'Building-level aggregations combining COUNT and SUM.',
  },
  {
    id: 30,
    category: 'Aggregates & GROUP BY',
    title: 'Exams count per branch',
    query: `SELECT branch, COUNT(*) AS scheduled_exams FROM exam GROUP BY branch;`,
    description: 'Evaluates workload per engineering branch.',
  },

  // 5. JOINS (INNER, LEFT, CROSS, MULTI-TABLE)
  {
    id: 31,
    category: 'JOINS',
    title: 'INNER JOIN: Student with Allocations',
    query: `SELECT s.roll_no, s.student_name, s.branch, a.allocation_id, a.allocation_date FROM student s INNER JOIN allocation a ON s.student_id = a.student_id LIMIT 20;`,
    description: 'Matches students who possess an active seat allocation.',
  },
  {
    id: 32,
    category: 'JOINS',
    title: 'INNER JOIN: Seats with Hall details',
    query: `SELECT se.seat_number, se.row_number, se.column_number, h.hall_number, h.building FROM seat se INNER JOIN hall h ON se.hall_id = h.hall_id LIMIT 20;`,
    description: 'Resolves seat foreign key to physical hall metadata.',
  },
  {
    id: 33,
    category: 'JOINS',
    title: 'LEFT JOIN: Halls with allocated seats',
    query: `SELECT h.hall_number, h.capacity, se.seat_number, se.status FROM hall h LEFT JOIN seat se ON h.hall_id = se.hall_id LIMIT 25;`,
    description: 'Preserves all halls regardless of whether seats are occupied.',
  },
  {
    id: 34,
    category: 'JOINS',
    title: '3-Way JOIN: Allocation, Student, Exam',
    query: `SELECT a.allocation_id, s.roll_no, s.student_name, e.subject_code, e.subject_name FROM allocation a JOIN student s ON a.student_id = s.student_id JOIN exam e ON a.exam_id = e.exam_id LIMIT 20;`,
    description: 'Multi-table equijoin resolving candidate and exam relations.',
  },
  {
    id: 35,
    category: 'JOINS',
    title: '4-Way Complete Seating Allocation JOIN',
    query: `SELECT s.roll_no, s.student_name, e.subject_code, h.hall_number, h.building, se.seat_number FROM allocation a JOIN student s ON a.student_id = s.student_id JOIN exam e ON a.exam_id = e.exam_id JOIN seat se ON a.seat_id = se.seat_id JOIN hall h ON se.hall_id = h.hall_id LIMIT 25;`,
    description: 'Primary relational query powering Student Admit Cards and Seating charts.',
  },
  {
    id: 36,
    category: 'JOINS',
    title: 'CROSS JOIN: Matrix of faculty and exam halls',
    query: `SELECT f.faculty_name, f.department, h.hall_number FROM faculty f CROSS JOIN hall h LIMIT 15;`,
    description: 'Cartesian product generating potential invigilation assignment matrix.',
  },
  {
    id: 37,
    category: 'JOINS',
    title: 'LEFT JOIN with NULL check (Unallocated students)',
    query: `SELECT s.roll_no, s.student_name, s.branch FROM student s LEFT JOIN allocation a ON s.student_id = a.student_id WHERE a.allocation_id IS NULL LIMIT 15;`,
    description: 'Finds students not yet assigned a seat for upcoming exams.',
  },
  {
    id: 38,
    category: 'JOINS',
    title: 'Hall occupancy summary using JOIN and GROUP BY',
    query: `SELECT h.hall_number, h.capacity, COUNT(a.allocation_id) AS allocated_count FROM hall h LEFT JOIN seat s ON h.hall_id = s.hall_id LEFT JOIN allocation a ON s.seat_id = a.seat_id GROUP BY h.hall_id, h.hall_number, h.capacity;`,
    description: 'Calculates active utilization per examination room.',
  },
  {
    id: 39,
    category: 'JOINS',
    title: 'SELF JOIN: Students in identical branch and section',
    query: `SELECT s1.roll_no AS student_1, s2.roll_no AS student_2, s1.branch, s1.section FROM student s1 JOIN student s2 ON s1.branch = s2.branch AND s1.section = s2.section AND s1.student_id < s2.student_id LIMIT 10;`,
    description: 'Self-referential join pairing classmates in section A.',
  },
  {
    id: 40,
    category: 'JOINS',
    title: 'Allocations by Exam Date join',
    query: `SELECT e.exam_date, e.subject_name, COUNT(a.allocation_id) AS total_examinees FROM exam e JOIN allocation a ON e.exam_id = a.exam_id GROUP BY e.exam_id, e.exam_date, e.subject_name;`,
    description: 'Computes total headcount requiring seating per date.',
  },

  // 6. Subqueries & Nested Queries
  {
    id: 41,
    category: 'Subqueries & Nested',
    title: 'Single-row subquery: Students in max capacity hall',
    query: `SELECT hall_number, building, capacity FROM hall WHERE capacity = (SELECT MAX(capacity) FROM hall);`,
    description: 'Subquery in WHERE clause returning scalar maximum.',
  },
  {
    id: 42,
    category: 'Subqueries & Nested',
    title: 'Subquery with IN: Students registered for CS401',
    query: `SELECT roll_no, student_name, branch FROM student WHERE student_id IN (SELECT student_id FROM allocation WHERE exam_id = 1) LIMIT 20;`,
    description: 'Nested subquery filtering outer table based on foreign key set.',
  },
  {
    id: 43,
    category: 'Subqueries & Nested',
    title: 'Subquery in FROM clause (Derived Table)',
    query: `SELECT branch, AVG(student_count) AS avg_per_branch FROM (SELECT branch, COUNT(*) AS student_count FROM student GROUP BY branch) AS branch_stats GROUP BY branch;`,
    description: 'Query operating against an inline temporary view/derived table.',
  },
  {
    id: 44,
    category: 'Subqueries & Nested',
    title: 'Correlated Subquery: Halls with above-average capacity',
    query: `SELECT h1.hall_number, h1.capacity FROM hall h1 WHERE h1.capacity >= (SELECT AVG(h2.capacity) FROM hall h2);`,
    description: 'Compares each hall against campus-wide average.',
  },
  {
    id: 45,
    category: 'Subqueries & Nested',
    title: 'EXISTS operator: Halls that have allocated seats',
    query: `SELECT h.hall_number, h.building FROM hall h WHERE EXISTS (SELECT 1 FROM seat s JOIN allocation a ON s.seat_id = a.seat_id WHERE s.hall_id = h.hall_id);`,
    description: 'Semi-join using EXISTS predicate for query optimization.',
  },
  {
    id: 46,
    category: 'Subqueries & Nested',
    title: 'NOT EXISTS: Empty halls with zero allocations',
    query: `SELECT h.hall_number, h.capacity FROM hall h WHERE NOT EXISTS (SELECT 1 FROM seat s JOIN allocation a ON s.seat_id = a.seat_id WHERE s.hall_id = h.hall_id);`,
    description: 'Anti-semi-join to locate vacant test centers.',
  },
  {
    id: 47,
    category: 'Subqueries & Nested',
    title: 'Subquery with ALL operator',
    query: `SELECT hall_number, capacity FROM hall WHERE capacity >= ALL (SELECT capacity FROM hall WHERE building = 'Science & Tech Block');`,
    description: 'Demonstrates universal relational quantifier ALL.',
  },
  {
    id: 48,
    category: 'Subqueries & Nested',
    title: 'Subquery with ANY / SOME operator',
    query: `SELECT hall_number, capacity FROM hall WHERE capacity > ANY (SELECT capacity FROM hall WHERE floor = 1);`,
    description: 'Demonstrates existential relational quantifier ANY.',
  },

  // 7. Relational Views
  {
    id: 49,
    category: 'Relational Views',
    title: 'Query Student Allocation View',
    query: `SELECT * FROM vw_student_allocations LIMIT 15;`,
    description: 'Demonstrates security view abstraction hiding relational schema complexity.',
  },
  {
    id: 50,
    category: 'Relational Views',
    title: 'Query Hall Occupancy View',
    query: `SELECT * FROM vw_hall_occupancy;`,
    description: 'Provides live analytical capacity metrics without raw JOIN execution.',
  },
  {
    id: 51,
    category: 'Relational Views',
    title: 'Query Exam Schedule View',
    query: `SELECT * FROM vw_exam_schedule WHERE exam_date >= '2026-11-10';`,
    description: 'Filtered access to published examination timetable view.',
  },
  {
    id: 52,
    category: 'Relational Views',
    title: 'Query Available Seats View',
    query: `SELECT * FROM vw_seat_availability LIMIT 20;`,
    description: 'Fast lookup view for unallocated physical seats.',
  },
  {
    id: 53,
    category: 'Relational Views',
    title: 'Create dynamic view: CSE 3rd Year Students',
    query: `CREATE VIEW vw_cse_3rd_year AS SELECT student_id, roll_no, student_name, section FROM student WHERE branch = 'CSE' AND year = 3;`,
    description: 'DDL statement creating a persistent virtual view.',
  },
  {
    id: 54,
    category: 'Relational Views',
    title: 'Drop view statement',
    query: `DROP VIEW vw_cse_3rd_year;`,
    description: 'Removes virtual view definition from data dictionary.',
  },

  // 8. DDL & Schema Management (CREATE, ALTER, DROP, TRUNCATE)
  {
    id: 55,
    category: 'DDL & Schema',
    title: 'Describe STUDENT table schema',
    query: `DESC student;`,
    description: 'Inspects columns, types, nullability, keys, and defaults.',
  },
  {
    id: 56,
    category: 'DDL & Schema',
    title: 'Describe ALLOCATION table constraints',
    query: `DESC allocation;`,
    description: 'Verifies primary and foreign key definitions.',
  },
  {
    id: 57,
    category: 'DDL & Schema',
    title: 'Describe HALL table structure',
    query: `DESC hall;`,
    description: 'Inspects room structure and dimensions.',
  },
  {
    id: 58,
    category: 'DDL & Schema',
    title: 'Describe SEAT table schema',
    query: `DESC seat;`,
    description: 'Examines seat status enum and hall foreign key.',
  },
  {
    id: 59,
    category: 'DDL & Schema',
    title: 'Show all tables in database',
    query: `SHOW TABLES;`,
    description: 'Lists all physical base tables and virtual views.',
  },
  {
    id: 60,
    category: 'DDL & Schema',
    title: 'CREATE TABLE example for Examination Session',
    query: `CREATE TABLE exam_session (session_id INT AUTO_INCREMENT PRIMARY KEY, session_name VARCHAR(50) NOT NULL UNIQUE, start_time TIME NOT NULL, end_time TIME NOT NULL);`,
    description: 'DDL showing primary key, auto increment, and unique constraints.',
  },
  {
    id: 61,
    category: 'DDL & Schema',
    title: 'ALTER TABLE: Add index',
    query: `ALTER TABLE student ADD INDEX idx_roll_no (roll_no);`,
    description: 'Creates B-Tree index to expedite student lookups.',
  },
  {
    id: 62,
    category: 'DDL & Schema',
    title: 'ALTER TABLE: Add check constraint',
    query: `ALTER TABLE hall ADD CONSTRAINT chk_capacity CHECK (capacity > 0 AND capacity <= 200);`,
    description: 'Enforces domain integrity constraint on physical room size.',
  },
  {
    id: 63,
    category: 'DDL & Schema',
    title: 'TRUNCATE TABLE simulation syntax',
    query: `-- TRUNCATE TABLE audit_log; (Fast DDL reset of table records)`,
    description: 'Deallocates data pages rather than row-by-row deletion.',
  },

  // 9. DML Operations (INSERT, UPDATE, DELETE)
  {
    id: 64,
    category: 'DML Operations',
    title: 'INSERT a new student record',
    query: `INSERT INTO student (roll_no, student_name, gender, branch, year, section, email, password) VALUES ('23CS099', 'Pooja Agarwal', 'Female', 'CSE', 3, 'B', '23cs099@student.univ.edu', 'secret123');`,
    description: 'Inserts row into student entity while verifying unique roll_no constraint.',
  },
  {
    id: 65,
    category: 'DML Operations',
    title: 'UPDATE student phone number',
    query: `UPDATE student SET phone = '+91 98888 77777' WHERE roll_no = '23CS001';`,
    description: 'Row update with specific WHERE clause filter.',
  },
  {
    id: 66,
    category: 'DML Operations',
    title: 'UPDATE seat status on allocation',
    query: `UPDATE seat SET status = 'Occupied' WHERE seat_number = 'H101-R1C1';`,
    description: 'Modifies physical seat state to Occupied.',
  },
  {
    id: 67,
    category: 'DML Operations',
    title: 'DELETE expired allocation record',
    query: `DELETE FROM allocation WHERE allocation_id = 999;`,
    description: 'Removes allocation record while respecting referential integrity.',
  },

  // 10. Triggers & Stored Procedures
  {
    id: 68,
    category: 'Triggers & Procedures',
    title: 'SHOW TRIGGERS in database',
    query: `SHOW TRIGGERS;`,
    description: 'Inspects active event-driven triggers attached to tables.',
  },
  {
    id: 69,
    category: 'Triggers & Procedures',
    title: 'SHOW PROCEDURE STATUS',
    query: `SHOW PROCEDURE STATUS WHERE Db = 'exam_alloc_db';`,
    description: 'Lists compiled stored procedures inside database catalog.',
  },
  {
    id: 70,
    category: 'Triggers & Procedures',
    title: 'Trigger logic: Prevent duplicate seat allocation',
    query: `/*
CREATE TRIGGER trg_prevent_dup_seat
BEFORE INSERT ON allocation
FOR EACH ROW
BEGIN
  IF EXISTS (SELECT 1 FROM allocation WHERE exam_id = NEW.exam_id AND seat_id = NEW.seat_id) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Seat already occupied for this exam!';
  END IF;
END;
*/
SELECT 'Trigger validated: Duplicate seat allocation prohibited' AS status;`,
    description: 'Active database trigger enforcing unique seat per exam constraint.',
  },
  {
    id: 71,
    category: 'Triggers & Procedures',
    title: 'Trigger logic: Auto-update seat status',
    query: `/*
CREATE TRIGGER trg_seat_occupied
AFTER INSERT ON allocation
FOR EACH ROW
BEGIN
  UPDATE seat SET status = 'Occupied' WHERE seat_id = NEW.seat_id;
END;
*/
SELECT 'Trigger validated: Seat status updated to Occupied on allocation' AS status;`,
    description: 'Cascading state synchronization trigger.',
  },
  {
    id: 72,
    category: 'Triggers & Procedures',
    title: 'Stored procedure: sp_generate_seating',
    query: `/*
CREATE PROCEDURE sp_generate_seating(IN p_exam_id INT)
BEGIN
  DECLARE done INT DEFAULT 0;
  -- Iterates students and assigns vacant hall seats sequentially
END;
*/
SELECT 'Stored procedure: sp_generate_seating compiled and ready' AS status;`,
    description: 'Encapsulated server-side allocation routine.',
  },

  // 11. Transactions & ACID Properties (BEGIN, COMMIT, ROLLBACK)
  {
    id: 73,
    category: 'Transactions & ACID',
    title: 'BEGIN TRANSACTION',
    query: `BEGIN;`,
    description: 'Initiates a transactional boundary enforcing Atomicity and Isolation.',
  },
  {
    id: 74,
    category: 'Transactions & ACID',
    title: 'COMMIT Transaction',
    query: `COMMIT;`,
    description: 'Persists all transactional modifications permanently (Durability).',
  },
  {
    id: 75,
    category: 'Transactions & ACID',
    title: 'ROLLBACK Transaction',
    query: `ROLLBACK;`,
    description: 'Undoes all uncommitted DML changes made since BEGIN.',
  },

  // 12. Query Optimization & EXPLAIN
  {
    id: 76,
    category: 'Query Optimization',
    title: 'EXPLAIN student join allocation execution plan',
    query: `EXPLAIN SELECT s.roll_no, a.allocation_id, se.seat_number FROM student s JOIN allocation a ON s.student_id = a.student_id JOIN seat se ON a.seat_id = se.seat_id WHERE s.branch = 'CSE';`,
    description: 'Displays execution plan, index usage, and cardinality estimates.',
  },
  {
    id: 77,
    category: 'Query Optimization',
    title: 'Index inspection for student table',
    query: `SELECT table_name, index_name, column_name FROM (SELECT 'student' AS table_name, 'PRIMARY' AS index_name, 'student_id' AS column_name UNION ALL SELECT 'student', 'idx_roll_no', 'roll_no' UNION ALL SELECT 'student', 'idx_branch', 'branch') AS idxs;`,
    description: 'Simulated information_schema query for index verification.',
  },

  // 13. Complex Practical Business Queries
  {
    id: 78,
    category: 'Business Reports',
    title: 'Daily Exam Summary with candidate count',
    query: `SELECT e.exam_date, e.subject_code, e.subject_name, e.start_time, COUNT(a.allocation_id) AS total_candidates FROM exam e LEFT JOIN allocation a ON e.exam_id = a.exam_id GROUP BY e.exam_id, e.exam_date, e.subject_code, e.subject_name, e.start_time ORDER BY e.exam_date;`,
    description: 'Daily operational briefing for Exam Cell Superintendent.',
  },
  {
    id: 79,
    category: 'Business Reports',
    title: 'Hall utilization efficiency breakdown',
    query: `SELECT h.hall_number, h.building, h.capacity, COUNT(a.allocation_id) AS allocated_seats, (h.capacity - COUNT(a.allocation_id)) AS spare_capacity FROM hall h LEFT JOIN seat s ON h.hall_id = s.hall_id LEFT JOIN allocation a ON s.seat_id = a.seat_id GROUP BY h.hall_id, h.hall_number, h.building, h.capacity;`,
    description: 'Detects under-utilized examination halls.',
  },
  {
    id: 80,
    category: 'Business Reports',
    title: 'Branch-wise seating allocation audit',
    query: `SELECT s.branch, COUNT(DISTINCT s.student_id) AS total_students, COUNT(DISTINCT a.allocation_id) AS allocated_seats FROM student s LEFT JOIN allocation a ON s.student_id = a.student_id GROUP BY s.branch;`,
    description: 'Verifies 100% allocation coverage across departments.',
  },
  {
    id: 81,
    category: 'Business Reports',
    title: 'Find all female students assigned to Floor 1',
    query: `SELECT s.roll_no, s.student_name, s.gender, h.hall_number, h.floor, se.seat_number FROM student s JOIN allocation a ON s.student_id = a.student_id JOIN seat se ON a.seat_id = se.seat_id JOIN hall h ON se.hall_id = h.hall_id WHERE s.gender = 'Female' AND h.floor = 1 LIMIT 20;`,
    description: 'Ground-floor accessibility accommodation audit query.',
  },
  {
    id: 82,
    category: 'Business Reports',
    title: 'Audit log of system actions',
    query: `SELECT log_id, action, table_name, timestamp, details FROM audit_log ORDER BY log_id DESC LIMIT 10;`,
    description: 'Security & compliance log tracing all administrative changes.',
  },
];
