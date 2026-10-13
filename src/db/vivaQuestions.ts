export interface VivaItem {
  id: number;
  category: 'DBMS Core' | 'SQL Interview' | 'Project Viva';
  question: string;
  answer: string;
  keyConcepts: string[];
}

export const vivaQuestionsBank: VivaItem[] = [
  // ===================== DBMS CORE QUESTIONS (50) =====================
  {
    id: 1,
    category: 'DBMS Core',
    question: 'What is a Database Management System (DBMS) and how does it differ from a File System?',
    answer: 'A DBMS is software that manages data definition, creation, querying, and updating. Unlike traditional file systems which suffer from data redundancy, inconsistency, difficulty accessing data, data isolation, and lack of concurrent multi-user transactions, a DBMS guarantees ACID properties, centralized security, declarative SQL access, and automated crash recovery.',
    keyConcepts: ['Data Abstraction', 'Data Redundancy', 'ACID Properties', 'Concurrency Control']
  },
  {
    id: 2,
    category: 'DBMS Core',
    question: 'Explain the 3-Tier Architecture (Three-Schema Architecture) of DBMS.',
    answer: 'The ANSI/SPARC 3-tier architecture consists of: 1) Physical/Internal Level: Describes physical storage structures, B-tree indexes, page blocks. 2) Logical/Conceptual Level: Describes database schema, entities, relationships, constraints, and data types. 3) External/View Level: User-specific customized views (e.g., student view showing only their seat vs. admin dashboard). It provides Physical and Logical Data Independence.',
    keyConcepts: ['ANSI/SPARC', 'Internal Schema', 'Conceptual Schema', 'View Level', 'Data Independence']
  },
  {
    id: 3,
    category: 'DBMS Core',
    question: 'What are ACID properties in DBMS? How does this project satisfy each?',
    answer: '1) Atomicity: All or nothing execution (if allocating 60 seats fails mid-way, transaction ROLLBACK restores state). 2) Consistency: Data moves only between valid states conforming to integrity constraints (no seat assigned twice). 3) Isolation: Concurrent allocations do not interfere with each other (serializable isolation). 4) Durability: Once COMMIT executes, allocations survive system reboot.',
    keyConcepts: ['Atomicity', 'Consistency', 'Isolation', 'Durability', 'Transaction Management']
  },
  {
    id: 4,
    category: 'DBMS Core',
    question: 'What is Normalization? Why is it crucial in database design?',
    answer: 'Normalization is the systematic process of organizing database schemas into normal forms to eliminate data redundancy (duplicate storage) and prevent update, insertion, and deletion anomalies while maintaining lossless join and functional dependency preservation.',
    keyConcepts: ['Redundancy', 'Insertion Anomaly', 'Update Anomaly', 'Deletion Anomaly']
  },
  {
    id: 5,
    category: 'DBMS Core',
    question: 'Explain First Normal Form (1NF) with an example from this project.',
    answer: 'A relation is in 1NF if and only if all domain values are atomic (no repeating groups, multi-valued attributes, or composite attributes). In our STUDENT table, phone numbers and emails are single atomic columns, and each student has an individual scalar record rather than comma-separated lists of subjects or seats.',
    keyConcepts: ['Atomicity', 'Repeating Groups', 'Scalar Values']
  },
  {
    id: 6,
    category: 'DBMS Core',
    question: 'Explain Second Normal Form (2NF) with an example from this project.',
    answer: 'A relation is in 2NF if it is in 1NF and contains NO partial functional dependencies—every non-prime attribute must be fully functionally dependent on the entire primary key. In ALLOCATION(allocation_id, student_id, exam_id, seat_id), the non-prime attribute allocation_date depends on the surrogate primary key allocation_id, not a subset.',
    keyConcepts: ['Partial Dependency', 'Full Functional Dependency', 'Candidate Key']
  },
  {
    id: 7,
    category: 'DBMS Core',
    question: 'Explain Third Normal Form (3NF) and Transitive Dependency.',
    answer: 'A relation is in 3NF if it is in 2NF and has no transitive dependencies (where a non-key attribute determines another non-key attribute: X -> Y and Y -> Z). In our schema, we do not store hall_number, building, and capacity inside SEAT or ALLOCATION. Instead, SEAT references hall_id (FK), and HALL independently stores room metadata.',
    keyConcepts: ['Transitive Dependency', 'Non-prime Attributes', 'Boyce-Codd']
  },
  {
    id: 8,
    category: 'DBMS Core',
    question: 'What is Boyce-Codd Normal Form (BCNF)? When is 3NF not in BCNF?',
    answer: 'BCNF is a stricter version of 3NF where for every functional dependency X -> Y, X must be a super key. A relation in 3NF is not in BCNF when a non-trivial functional dependency exists where a candidate key attribute depends on a non-super key.',
    keyConcepts: ['Super Key', 'BCNF vs 3NF', 'Determinant']
  },
  {
    id: 9,
    category: 'DBMS Core',
    question: 'What is a Primary Key and how does it differ from a Unique Key?',
    answer: 'A Primary Key uniquely identifies each row in a table, strictly forbids NULL values, and automatically creates a clustered index in MySQL InnoDB. A Unique Key also enforces uniqueness but permits NULL values (one or more depending on DBMS) and creates a secondary non-clustered index. A table can have only one Primary Key, but multiple Unique Keys.',
    keyConcepts: ['Primary Key', 'Unique Constraint', 'Clustered Index', 'NULL handling']
  },
  {
    id: 10,
    category: 'DBMS Core',
    question: 'What is a Foreign Key and Referential Integrity?',
    answer: 'A Foreign Key is an attribute or set of attributes in a child table that references the Primary Key of a parent table. Referential Integrity ensures that a foreign key value must match an existing primary key in the referenced parent table or be NULL, preventing orphaned records.',
    keyConcepts: ['Parent Table', 'Child Table', 'Referential Action', 'Orphan Records']
  },
  {
    id: 11,
    category: 'DBMS Core',
    question: 'What are ON DELETE CASCADE and ON DELETE SET NULL actions?',
    answer: 'ON DELETE CASCADE automatically deletes corresponding child rows when a referenced parent row is deleted. ON DELETE SET NULL sets the child foreign key column to NULL when the parent record is deleted. ON DELETE RESTRICT (default) prevents parent deletion if child rows exist.',
    keyConcepts: ['Cascading Deletes', 'Referential Action', 'Data Consistency']
  },
  {
    id: 12,
    category: 'DBMS Core',
    question: 'What is an Entity-Relationship (ER) Diagram and what are its components?',
    answer: 'An ER Diagram is a high-level conceptual data model representing real-world entities and associations. Components: 1) Rectangles = Entity Sets (Student, Hall, Exam). 2) Ellipses = Attributes (roll_no, capacity). 3) Diamonds = Relationship Sets (Allocates, BelongsTo). 4) Lines = Connections showing cardinality and participation.',
    keyConcepts: ['Entities', 'Attributes', 'Relationships', 'Cardinality']
  },
  {
    id: 13,
    category: 'DBMS Core',
    question: 'Explain Cardinality Ratios (1:1, 1:N, M:N) in our Exam System.',
    answer: '1) One-to-Many (1:N): One Hall has Many Seats; One Student has Many Allocations (across different exams). 2) Many-to-One (N:1): Many Seats belong to One Hall. 3) Many-to-Many (M:N): Students and Exams have an M:N relationship, resolved via the associative entity ALLOCATION.',
    keyConcepts: ['One-to-Many', 'Many-to-Many', 'Associative Entity', 'Junction Table']
  },
  {
    id: 14,
    category: 'DBMS Core',
    question: 'What is Total vs. Partial Participation in ER modeling?',
    answer: 'Total Participation (double line in ER) means every entity instance in the set must participate in the relationship (e.g., every Seat MUST belong to a Hall). Partial Participation (single line) means some entities may not participate (e.g., a newly registered Student may not yet have an Allocation).',
    keyConcepts: ['Total Participation', 'Partial Participation', 'Existence Dependency']
  },
  {
    id: 15,
    category: 'DBMS Core',
    question: 'What is an Index in DBMS and how does a B+ Tree index work?',
    answer: 'An Index is an auxiliary data structure that enhances the speed of data retrieval operations at the cost of additional storage and slower writes. MySQL InnoDB uses B+ Trees where all data pointers reside in leaf nodes connected as a doubly linked list, providing O(log N) lookup and high sequential range query efficiency.',
    keyConcepts: ['B+ Tree', 'Leaf Nodes', 'Clustered Index', 'Secondary Index', 'O(log N)']
  },
  {
    id: 16,
    category: 'DBMS Core',
    question: 'What is the difference between Clustered and Non-Clustered Indexes?',
    answer: 'A Clustered Index alters the physical ordering of data pages on disk matching the index key (in MySQL InnoDB, the Primary Key is always the clustered index). A Non-Clustered (Secondary) Index maintains a separate structure storing index keys and pointers (row ID or PK value) pointing to the physical clustered records.',
    keyConcepts: ['Physical Ordering', 'InnoDB Primary Key', 'Secondary Index Lookup']
  },
  {
    id: 17,
    category: 'DBMS Core',
    question: 'What is a Database Transaction? What are its states?',
    answer: 'A Transaction is a logical unit of database processing that includes one or more database access operations. States: Active -> Partially Committed -> Committed (successful termination). If failure occurs: Active/Partially Committed -> Failed -> Aborted -> Rolled Back.',
    keyConcepts: ['Transaction States', 'Active', 'Committed', 'Aborted', 'Rollback']
  },
  {
    id: 18,
    category: 'DBMS Core',
    question: 'What is the Concurrency Control problem in DBMS? Name common concurrency anomalies.',
    answer: 'When multiple transactions execute concurrently, unmanaged interleaved operations cause anomalies: 1) Dirty Read (reading uncommitted data). 2) Non-Repeatable Read (rereading data modified by committed transaction). 3) Phantom Read (new rows inserted matching search condition). 4) Lost Update (overwriting concurrent updates).',
    keyConcepts: ['Dirty Read', 'Non-Repeatable Read', 'Phantom Read', 'Lost Update']
  },
  {
    id: 19,
    category: 'DBMS Core',
    question: 'What are the SQL Transaction Isolation Levels?',
    answer: '1) Read Uncommitted: Permits dirty reads, non-repeatable reads, phantoms. 2) Read Committed: Prevents dirty reads; allows non-repeatable reads. 3) Repeatable Read: (MySQL default) Prevents dirty and non-repeatable reads; uses MVCC. 4) Serializable: Highest level; prevents all anomalies using strict lock/snapshot isolation.',
    keyConcepts: ['Read Committed', 'Repeatable Read', 'Serializable', 'MVCC']
  },
  {
    id: 20,
    category: 'DBMS Core',
    question: 'What is Two-Phase Locking (2PL)?',
    answer: '2PL is a concurrency control protocol guaranteeing serializability. It has two phases: 1) Growing Phase: Transaction may acquire locks but cannot release any. 2) Shrinking Phase: Transaction may release locks but cannot acquire new ones. Strict 2PL holds all exclusive locks until transaction commit/abort.',
    keyConcepts: ['Growing Phase', 'Shrinking Phase', 'Serializability', 'Lock Acquisition']
  },
  {
    id: 21,
    category: 'DBMS Core',
    question: 'What is a Deadlock in DBMS and how is it resolved?',
    answer: 'A Deadlock is an impasse where two or more transactions hold locks needed by the other in a circular wait condition (T1 waits for T2, T2 waits for T1). Resolutions: 1) Deadlock Prevention (Wait-Die, Wound-Wait). 2) Deadlock Detection (Wait-For Graph cycle detection). 3) Deadlock Recovery (victim selection and rollback).',
    keyConcepts: ['Circular Wait', 'Wait-For Graph', 'Deadlock Recovery', 'Victim Selection']
  },
  {
    id: 22,
    category: 'DBMS Core',
    question: 'What is Write-Ahead Logging (WAL) in database crash recovery?',
    answer: 'WAL dictates that any modification to a database page must first be recorded in persistent log storage (redo/undo log) before the page is written to disk. This ensures Atomicity and Durability during system failure via ARIES recovery protocol (Analysis, Redo, Undo).',
    keyConcepts: ['WAL Protocol', 'Redo Log', 'Undo Log', 'ARIES Algorithm', 'Checkpoints']
  },
  {
    id: 23,
    category: 'DBMS Core',
    question: 'What is a Database View? What are the benefits of Views?',
    answer: 'A View is a virtual table defined by a saved SQL query. Benefits: 1) Security: Restricts access to sensitive columns (e.g. students cannot see other students passwords or admin tables). 2) Simplicity: Abstracts complex multi-table joins into a simple SELECT * FROM view. 3) Consistency: Provides uniform interface even if underlying schema changes.',
    keyConcepts: ['Virtual Table', 'Security Abstraction', 'Query Encapsulation']
  },
  {
    id: 24,
    category: 'DBMS Core',
    question: 'What is a Stored Procedure and how does it differ from a Function?',
    answer: 'A Stored Procedure is a compiled group of SQL statements stored in the database catalog that can execute DML, DDL, and transaction control commands, returning zero, one, or multiple result sets. A Function must return a single scalar value or table and cannot modify database state or use transaction statements.',
    keyConcepts: ['Precompiled Code', 'Procedural SQL', 'Network Traffic Reduction']
  },
  {
    id: 25,
    category: 'DBMS Core',
    question: 'What is a Database Trigger? What are its components?',
    answer: 'A Trigger is an event-driven stored procedure that executes automatically in response to database events (INSERT, UPDATE, DELETE). Components: 1) Event (INSERT on allocation). 2) Condition (IF seat already occupied). 3) Action (SIGNAL SQLSTATE 45000 or UPDATE seat status). Timing can be BEFORE, AFTER, or INSTEAD OF.',
    keyConcepts: ['Event-Condition-Action (ECA)', 'BEFORE Trigger', 'AFTER Trigger', 'NEW and OLD qualifiers']
  },
  {
    id: 26,
    category: 'DBMS Core',
    question: 'What are Domain Constraints and Referential Constraints?',
    answer: 'Domain Constraints define valid attribute values (data type, range, NOT NULL, CHECK gender IN ("Male", "Female")). Referential Constraints enforce relationships between foreign and primary keys to guarantee that referenced entities actually exist.',
    keyConcepts: ['Domain Integrity', 'CHECK Constraint', 'Referential Integrity']
  },
  {
    id: 27,
    category: 'DBMS Core',
    question: 'What is the role of an Execution Plan and Query Optimizer?',
    answer: 'The Query Optimizer parses declarative SQL statements, analyzes statistics (table row counts, index selectivity, page distribution), and evaluates cost-based execution trees to choose the most efficient plan (e.g. index seek vs full table scan, nested loop vs hash join).',
    keyConcepts: ['Cost-Based Optimizer', 'Execution Plan', 'Index Seek', 'Table Scan']
  },
  {
    id: 28,
    category: 'DBMS Core',
    question: 'What is a Clustered vs Secondary Index Scan?',
    answer: 'A Clustered Index scan reads the actual rows in primary key physical sequence. A Secondary Index scan reads index pages, and if non-indexed columns are requested, performs a bookmark lookup (key lookup) to the clustered index to fetch remaining fields.',
    keyConcepts: ['Key Lookup', 'Covering Index', 'Secondary Index Scan']
  },
  {
    id: 29,
    category: 'DBMS Core',
    question: 'What is a Covering Index?',
    answer: 'A Covering Index is a composite secondary index that contains all the columns requested in the query SELECT, WHERE, and ORDER BY clauses. Because all required data resides inside the index leaves, the database engine avoids expensive table bookmark lookups entirely.',
    keyConcepts: ['Covering Index', 'Index Optimization', 'Zero Table Access']
  },
  {
    id: 30,
    category: 'DBMS Core',
    question: 'What is Data Independence in DBMS?',
    answer: 'Data Independence is the capacity to change the schema at one level without requiring change at next higher level. 1) Physical Data Independence: Modifying internal storage, file allocation, or indexes without altering conceptual schema. 2) Logical Data Independence: Changing logical schema (adding table/column) without modifying external views.',
    keyConcepts: ['Physical Data Independence', 'Logical Data Independence', 'Schema Evolution']
  },
  {
    id: 31,
    category: 'DBMS Core',
    question: 'What is a Candidate Key, Super Key, and Surrogate Key?',
    answer: 'Super Key: Any set of attributes that uniquely identifies a row. Candidate Key: A minimal Super Key with no extraneous attributes. Surrogate Key: An artificial, system-generated identifier with no business meaning (e.g., student_id INT AUTO_INCREMENT), as opposed to a natural key like roll_no.',
    keyConcepts: ['Candidate Key', 'Minimal Super Key', 'Surrogate Key', 'Natural Key']
  },
  {
    id: 32,
    category: 'DBMS Core',
    question: 'What are Lossless Decomposition and Dependency Preservation?',
    answer: 'Lossless Decomposition guarantees that joining decomposed relations R1 and R2 via natural join reconstructs the original relation R exactly without spurious tuples. Dependency Preservation ensures all original functional dependencies can be enforced using decomposed relations without joins.',
    keyConcepts: ['Lossless Join', 'Spurious Tuples', 'Functional Dependency Preservation']
  },
  {
    id: 33,
    category: 'DBMS Core',
    question: 'What is Relational Algebra and name its basic operators?',
    answer: 'Relational algebra is a procedural query language. Fundamental operations: Selection (σ - filters rows), Projection (π - selects columns), Cartesian Product (×), Union (∪), Set Difference (-), and Rename (ρ). Derived operations include Natural Join (⨝) and Intersection (∩).',
    keyConcepts: ['Selection', 'Projection', 'Cartesian Product', 'Natural Join']
  },
  {
    id: 34,
    category: 'DBMS Core',
    question: 'What is a Weak Entity Set and how is it represented?',
    answer: 'A Weak Entity Set is an entity that does not have a primary key attribute of its own and depends on the existence of an identifying strong entity set. It is identified by combining the strong entity primary key with its own partial discriminator (dashed underline). In ER diagrams, weak entities are drawn with double rectangles.',
    keyConcepts: ['Weak Entity', 'Identifying Entity', 'Discriminator', 'Double Rectangle']
  },
  {
    id: 35,
    category: 'DBMS Core',
    question: 'Explain Multi-Valued Dependency (MVD) and 4NF.',
    answer: 'An MVD (X ->-> Y) occurs when the presence of two or more independent multi-valued facts about an entity are stored in the same relation. Fourth Normal Form (4NF) requires that a relation is in BCNF and contains no non-trivial multi-valued dependencies.',
    keyConcepts: ['4NF', 'Multi-Valued Dependency', 'Independent Facts']
  },
  {
    id: 36,
    category: 'DBMS Core',
    question: 'What is 5NF (Project-Join Normal Form)?',
    answer: 'Fifth Normal Form (5NF) deals with join dependencies. A relation is in 5NF if it cannot be decomposed into smaller relations without loss of data, unless every join dependency is implied by candidate keys of the original relation.',
    keyConcepts: ['5NF', 'Join Dependency', 'Lossless Projection']
  },
  {
    id: 37,
    category: 'DBMS Core',
    question: 'What is the role of the Database Catalog / Data Dictionary?',
    answer: 'The Data Dictionary (e.g. information_schema, sys tables) stores metadata: definitions of all tables, columns, constraints, indexes, views, triggers, privileges, and physical storage parameters used by the DBMS engine during compilation and execution.',
    keyConcepts: ['Metadata', 'information_schema', 'Data Dictionary', 'System Catalog']
  },
  {
    id: 38,
    category: 'DBMS Core',
    question: 'What is a Checkpoint in database recovery?',
    answer: 'A Checkpoint is a recovery mechanism that synchronizes dirty buffer pages in memory with disk storage and writes a checkpoint record into the log. During crash recovery, the recovery manager only needs to scan logs back to the most recent checkpoint, speeding up recovery.',
    keyConcepts: ['Checkpoint', 'Dirty Pages', 'Buffer Pool', 'Crash Recovery']
  },
  {
    id: 39,
    category: 'DBMS Core',
    question: 'What is Shadow Paging?',
    answer: 'Shadow Paging is a recovery technique where the database maintains two page tables: a current page table and a shadow page table. Modifications write to newly allocated pages. At commit, the pointer flips to the new table, making updates atomic without write-ahead logging.',
    keyConcepts: ['Shadow Page Table', 'Current Page Table', 'No-logging Recovery']
  },
  {
    id: 40,
    category: 'DBMS Core',
    question: 'What are Grant and Revoke in Data Control Language (DCL)?',
    answer: 'DCL commands manage user access privileges: GRANT authorizes specific permissions (SELECT, INSERT, UPDATE) on database objects to specific users or roles. REVOKE withdraws previously granted permissions.',
    keyConcepts: ['GRANT', 'REVOKE', 'Role-Based Access Control', 'Privileges']
  },
  {
    id: 41,
    category: 'DBMS Core',
    question: 'What is Database Sharding vs Partitioning?',
    answer: 'Partitioning divides a single table into multiple smaller logical sets on the same database server (range, list, hash partitioning). Sharding distributes partitions horizontally across multiple independent physical database servers to achieve horizontal scalability.',
    keyConcepts: ['Horizontal Partitioning', 'Sharding', 'Scalability', 'Distributed DBMS']
  },
  {
    id: 42,
    category: 'DBMS Core',
    question: 'What is SQL Injection and how is it prevented in this system?',
    answer: 'SQL Injection is an attack vector where malicious SQL code is inserted into user inputs and executed by the database. In our Python Flask and Node backend, it is completely eliminated using Prepared Statements / Parameterized Queries, input sanitization, and ORM abstractions.',
    keyConcepts: ['SQL Injection', 'Parameterized Queries', 'Prepared Statements', 'Input Validation']
  },
  {
    id: 43,
    category: 'DBMS Core',
    question: 'What is Connection Pooling?',
    answer: 'Connection Pooling maintains a cache of pre-established database physical connections that can be reused for incoming requests rather than opening and tearing down expensive TCP connections repeatedly.',
    keyConcepts: ['Connection Pool', 'Performance Optimization', 'Resource Management']
  },
  {
    id: 44,
    category: 'DBMS Core',
    question: 'What is Query Cost in SQL Optimization?',
    answer: 'Query cost is an abstract estimate calculated by the DBMS optimizer factoring I/O reads, CPU cycles, temporary table creation, sorting operations, and memory footprint required to execute an execution plan.',
    keyConcepts: ['Query Cost', 'Cost-Based Optimizer', 'I/O Operations']
  },
  {
    id: 45,
    category: 'DBMS Core',
    question: 'What is an Orphan Record and how does our schema prevent them?',
    answer: 'An orphan record is a child table row pointing to a non-existent parent primary key. In our schema, foreign key constraints (e.g. `allocation.student_id REFERENCES student(student_id)`) reject insertions of invalid IDs and prevent deletion of active students.',
    keyConcepts: ['Orphan Records', 'Foreign Key Enforcement', 'Integrity Violations']
  },
  {
    id: 46,
    category: 'DBMS Core',
    question: 'What is the purpose of AUTO_INCREMENT in MySQL?',
    answer: 'AUTO_INCREMENT automatically generates sequential integer values for primary key columns whenever a new row is inserted without specifying a value, guaranteeing unique surrogate identifiers across high-concurrency inserts.',
    keyConcepts: ['AUTO_INCREMENT', 'Surrogate Identifier', 'Sequence Generation']
  },
  {
    id: 47,
    category: 'DBMS Core',
    question: 'What is Star Schema vs Snowflake Schema?',
    answer: 'In data warehousing, a Star Schema has a central Fact table connected directly to de-normalized Dimension tables. A Snowflake Schema normalizes dimension tables into multiple related tables, reducing redundancy but increasing join complexity.',
    keyConcepts: ['Data Warehouse', 'Fact Table', 'Dimension Table', 'Dimensional Modeling']
  },
  {
    id: 48,
    category: 'DBMS Core',
    question: 'What is Denormalization and when is it acceptable?',
    answer: 'Denormalization is the intentional introduction of redundancy into a normalized schema to reduce complex joins and speed up read-heavy reporting queries. It is acceptable in read-dominant analytics dashboards and data marts with controlled batch updates.',
    keyConcepts: ['Denormalization', 'Read Performance', 'Trade-offs']
  },
  {
    id: 49,
    category: 'DBMS Core',
    question: 'What is the difference between TRUNCATE and DELETE?',
    answer: 'DELETE is a DML statement that removes rows one-by-one, fires DELETE triggers, records individual row undo logs, and can be rolled back. TRUNCATE is a DDL statement that deallocates entire data storage pages, does not fire row triggers, resets AUTO_INCREMENT counters, and executes much faster.',
    keyConcepts: ['DML vs DDL', 'Row-level Logging', 'Page Deallocation', 'Trigger Execution']
  },
  {
    id: 50,
    category: 'DBMS Core',
    question: 'What is the role of Database Normalization in this Exam Allocation Project?',
    answer: 'It guarantees that when hall capacities change, exams are rescheduled, or students update contact details, updates occur in exactly one canonical location without duplicating hall room geometry across thousands of seat allocations.',
    keyConcepts: ['Zero Redundancy', 'Canonical Storage', 'Integrity Maintenance']
  },

  // ===================== SQL INTERVIEW QUESTIONS (50) =====================
  {
    id: 51,
    category: 'SQL Interview',
    question: 'What is the difference between WHERE and HAVING clauses in SQL?',
    answer: 'The WHERE clause filters individual rows BEFORE aggregate grouping occurs and cannot reference aggregate functions. The HAVING clause filters grouped summary records AFTER GROUP BY has evaluated aggregate values (e.g. `HAVING COUNT(*) > 5`).',
    keyConcepts: ['Row Filter vs Group Filter', 'Aggregate Evaluation Order']
  },
  {
    id: 52,
    category: 'SQL Interview',
    question: 'What is the SQL logical query processing order?',
    answer: 'SQL queries execute in this logical order: 1) FROM, 2) ON (Join conditions), 3) JOIN, 4) WHERE, 5) GROUP BY, 6) WITH CUBE/ROLLUP, 7) HAVING, 8) SELECT, 9) DISTINCT, 10) ORDER BY, 11) LIMIT / OFFSET.',
    keyConcepts: ['Logical Execution Order', 'FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY']
  },
  {
    id: 53,
    category: 'SQL Interview',
    question: 'What is the difference between UNION and UNION ALL?',
    answer: 'UNION combines the result sets of two SELECT queries and removes duplicate records (requiring an internal sorting/hashing pass). UNION ALL combines all rows including duplicates without sorting, making it significantly faster.',
    keyConcepts: ['Set Operations', 'Duplicate Elimination', 'Performance']
  },
  {
    id: 54,
    category: 'SQL Interview',
    question: 'Explain the difference between INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN.',
    answer: '1) INNER JOIN: Returns only rows that have matching values in both tables. 2) LEFT JOIN: Returns all rows from left table and matched rows from right; unmatched right columns are NULL. 3) RIGHT JOIN: Returns all rows from right table. 4) FULL OUTER JOIN: Returns all rows when there is a match in either table.',
    keyConcepts: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN']
  },
  {
    id: 55,
    category: 'SQL Interview',
    question: 'What is a Correlated Subquery and how does it execute?',
    answer: 'A Correlated Subquery is a nested subquery that references columns from the outer query. Unlike independent subqueries which evaluate once, a correlated subquery executes repeatedly—once for every candidate row evaluated by the outer query.',
    keyConcepts: ['Correlated Subquery', 'Outer Query Reference', 'Row-by-Row Evaluation']
  },
  {
    id: 56,
    category: 'SQL Interview',
    question: 'How do you find the 2nd highest hall capacity without using LIMIT?',
    answer: '`SELECT MAX(capacity) FROM hall WHERE capacity < (SELECT MAX(capacity) FROM hall);` or using correlated subquery: `SELECT h1.capacity FROM hall h1 WHERE 2 = (SELECT COUNT(DISTINCT h2.capacity) FROM hall h2 WHERE h2.capacity >= h1.capacity);`',
    keyConcepts: ['Nth Highest Value', 'Correlated Ranking', 'Nested Aggregation']
  },
  {
    id: 57,
    category: 'SQL Interview',
    question: 'What is the difference between COUNT(*), COUNT(1), and COUNT(column_name)?',
    answer: 'COUNT(*) and COUNT(1) count all rows in the result set including rows with NULL values. COUNT(column_name) counts only rows where the specified column value is NOT NULL.',
    keyConcepts: ['COUNT(*)', 'COUNT(column)', 'NULL Handling']
  },
  {
    id: 58,
    category: 'SQL Interview',
    question: 'How do you eliminate duplicate rows from a table in SQL?',
    answer: 'Using a self join or ROW_NUMBER() window function: `DELETE s1 FROM student s1 INNER JOIN student s2 WHERE s1.student_id > s2.student_id AND s1.roll_no = s2.roll_no;`',
    keyConcepts: ['Deduplication', 'Self Join Delete', 'Unique Identification']
  },
  {
    id: 59,
    category: 'SQL Interview',
    question: 'What are Window Functions in SQL? Give examples.',
    answer: 'Window functions perform calculations across a set of table rows related to the current row without collapsing the rows into a single summary like GROUP BY. Examples: ROW_NUMBER(), RANK(), DENSE_RANK(), LEAD(), LAG() over `OVER (PARTITION BY branch ORDER BY roll_no)`.',
    keyConcepts: ['Window Functions', 'OVER Clause', 'PARTITION BY', 'RANK() vs DENSE_RANK()']
  },
  {
    id: 60,
    category: 'SQL Interview',
    question: 'Explain the difference between RANK() and DENSE_RANK().',
    answer: 'Both rank rows based on ORDER BY. For tied values, RANK() skips subsequent ranking numbers (e.g. 1, 2, 2, 4), leaving gaps. DENSE_RANK() assigns consecutive numbers without gaps (e.g. 1, 2, 2, 3).',
    keyConcepts: ['Ties Handling', 'Rank Gaps', 'Ranking Functions']
  },
  {
    id: 61,
    category: 'SQL Interview',
    question: 'What is a Cross Join and when is it useful?',
    answer: 'A CROSS JOIN produces the Cartesian product of two tables (M rows * N rows). It is useful for generating all combinations, such as matching all faculty with all examination halls or generating multi-dimensional date/time schedules.',
    keyConcepts: ['Cartesian Product', 'Combinations Matrix', 'Zero ON Condition']
  },
  {
    id: 62,
    category: 'SQL Interview',
    question: 'What is a Self Join? Give a scenario from this project.',
    answer: 'A Self Join is a regular join in which a table is joined with itself using table aliases. Example: Pairing two students in the same hall or comparing two exams scheduled at the same time to detect room booking conflicts.',
    keyConcepts: ['Self Join', 'Table Aliases', 'Conflict Detection']
  },
  {
    id: 63,
    category: 'SQL Interview',
    question: 'What is the COALESCE() function in SQL?',
    answer: 'COALESCE(val1, val2, ..., valN) evaluates arguments in order and returns the first non-NULL expression. It is commonly used to provide fallback default values for nullable columns (e.g. `COALESCE(phone, "N/A")`).',
    keyConcepts: ['COALESCE', 'NULL Replacement', 'Default Fallback']
  },
  {
    id: 64,
    category: 'SQL Interview',
    question: 'What is the difference between NVL, IFNULL, and COALESCE?',
    answer: 'NVL is specific to Oracle. IFNULL accepts exactly two arguments in MySQL. COALESCE is the ANSI SQL standard function supported by all RDBMS platforms and accepts any number of arguments.',
    keyConcepts: ['ANSI Standard', 'Portability', 'IFNULL vs COALESCE']
  },
  {
    id: 65,
    category: 'SQL Interview',
    question: 'How do you check if a column value is NULL?',
    answer: 'Use `IS NULL` or `IS NOT NULL`. Standard equality operators like `= NULL` or `!= NULL` always evaluate to UNKNOWN in three-valued SQL logic because NULL represents an unknown value, not zero or empty string.',
    keyConcepts: ['Three-Valued Logic', 'IS NULL', 'Unknown Truth Value']
  },
  {
    id: 66,
    category: 'SQL Interview',
    question: 'What is the difference between CHAR and VARCHAR data types?',
    answer: 'CHAR(n) is fixed-length; strings shorter than n are right-padded with spaces, consuming static storage. VARCHAR(n) is variable-length; it stores only actual characters plus 1-2 prefix length bytes, saving storage.',
    keyConcepts: ['Fixed Length', 'Variable Length', 'Storage Footprint']
  },
  {
    id: 67,
    category: 'SQL Interview',
    question: 'What are Common Table Expressions (CTEs) and recursive CTEs?',
    answer: 'A CTE (`WITH cte_name AS (...)`) defines a temporary named result set available within the execution scope of a SELECT, INSERT, UPDATE, or DELETE statement. Recursive CTEs self-reference to traverse hierarchical tree graphs (e.g. prerequisites, seat grids).',
    keyConcepts: ['CTE', 'WITH Clause', 'Recursive CTE', 'Readability']
  },
  {
    id: 68,
    category: 'SQL Interview',
    question: 'What is an UPSERT operation in MySQL?',
    answer: 'An UPSERT inserts a row if it does not exist, or updates it if a duplicate key violation occurs: `INSERT INTO seat (...) VALUES (...) ON DUPLICATE KEY UPDATE status = VALUES(status);`',
    keyConcepts: ['UPSERT', 'ON DUPLICATE KEY UPDATE', 'Idempotency']
  },
  {
    id: 69,
    category: 'SQL Interview',
    question: 'What is the difference between DROP, TRUNCATE, and DELETE?',
    answer: 'DROP removes the table definition, data, triggers, and constraints from data catalog. TRUNCATE empties all rows via data page deallocation without row logging. DELETE removes selected rows based on a WHERE filter with transaction rollback capability.',
    keyConcepts: ['DROP', 'TRUNCATE', 'DELETE', 'DDL vs DML']
  },
  {
    id: 70,
    category: 'SQL Interview',
    question: 'How does the SQL LIKE operator work with % and _ wildcards?',
    answer: 'The percent sign `%` matches zero, one, or multiple characters (e.g. `LIKE "CS%"` matches CS, CS401, CSE). The underscore `_` matches exactly one character (e.g. `LIKE "H_101"` matches H-101 or HA101).',
    keyConcepts: ['Wildcards', '% Pattern', '_ Single Character']
  },
  {
    id: 71,
    category: 'SQL Interview',
    question: 'What does the SQL CASE statement do? Give an example.',
    answer: 'CASE provides conditional branching within SQL queries: `SELECT seat_number, CASE WHEN status = "Occupied" THEN "Seat Taken" WHEN status = "Available" THEN "Seat Vacant" ELSE "Reserved" END AS seat_label FROM seat;`',
    keyConcepts: ['Conditional Logic', 'CASE WHEN THEN ELSE END']
  },
  {
    id: 72,
    category: 'SQL Interview',
    question: 'How can you find rows with the same student email across two tables?',
    answer: '`SELECT s.roll_no, s.email FROM student s INNER JOIN faculty f ON s.email = f.email;` detects shared email conflicts across student and faculty records.',
    keyConcepts: ['Inner Join', 'Collision Detection']
  },
  {
    id: 73,
    category: 'SQL Interview',
    question: 'What is the purpose of the EXPLAIN statement in MySQL?',
    answer: 'EXPLAIN displays the execution plan produced by the MySQL query optimizer, revealing which indexes are chosen, the join strategy, estimated scanned rows, and potential performance bottlenecks like temporary table filesorts.',
    keyConcepts: ['EXPLAIN', 'Query Optimization', 'Index Selectivity', 'Filesort']
  },
  {
    id: 74,
    category: 'SQL Interview',
    question: 'What is a Composite Primary Key?',
    answer: 'A Composite Primary Key is a primary key composed of two or more columns that together guarantee unique row identity (e.g. `PRIMARY KEY (exam_id, seat_id)` in an un-surrogated allocation relation).',
    keyConcepts: ['Composite Key', 'Multi-Column Uniqueness']
  },
  {
    id: 75,
    category: 'SQL Interview',
    question: 'What is a Foreign Key constraint syntax in MySQL?',
    answer: '`CONSTRAINT fk_seat_hall FOREIGN KEY (hall_id) REFERENCES hall(hall_id) ON DELETE CASCADE ON UPDATE CASCADE;`',
    keyConcepts: ['FOREIGN KEY', 'REFERENCES', 'Cascading Actions']
  },
  {
    id: 76,
    category: 'SQL Interview',
    question: 'What is SQL injection and how does parameterization prevent it?',
    answer: 'Parameterization separates SQL code from user data: parameters are treated strictly as literal values rather than executable syntax, rendering payload injections like `" OR "1"="1` completely harmless.',
    keyConcepts: ['Parameterization', 'Literal Interpretation', 'Injection Prevention']
  },
  {
    id: 77,
    category: 'SQL Interview',
    question: 'How does MySQL handle character collations (e.g. utf8mb4_unicode_ci)?',
    answer: 'A character set defines valid binary encodings of characters. A collation defines rules for comparing and sorting characters. `utf8mb4_unicode_ci` supports full Unicode (including emojis) and is case-insensitive (`ci`).',
    keyConcepts: ['Character Set', 'Collation', 'Case Sensitivity', 'utf8mb4']
  },
  {
    id: 78,
    category: 'SQL Interview',
    question: 'What is the difference between a natural join and an inner join?',
    answer: 'An INNER JOIN requires an explicit `ON table1.col = table2.col` join condition. A NATURAL JOIN automatically joins tables on all columns that share the exact same column names in both tables, which can be risky if schemas evolve.',
    keyConcepts: ['NATURAL JOIN', 'Implicit Matching', 'Join Robustness']
  },
  {
    id: 79,
    category: 'SQL Interview',
    question: 'What is an inline view vs a materialized view?',
    answer: 'An inline view is a subquery in the FROM clause that executes dynamically in memory for that query. A materialized view physically stores query results on disk and refreshes periodically, accelerating complex analytical reports.',
    keyConcepts: ['Inline View', 'Materialized View', 'Disk Persistence']
  },
  {
    id: 80,
    category: 'SQL Interview',
    question: 'What is a deadlock and how do you minimize it in SQL?',
    answer: 'Minimize deadlocks by: 1) Accessing tables in the same consistent order across all transactions. 2) Keeping transactions short. 3) Using appropriate index locks. 4) Using lower isolation levels where acceptable.',
    keyConcepts: ['Lock Ordering', 'Transaction Duration', 'Deadlock Mitigation']
  },
  {
    id: 81,
    category: 'SQL Interview',
    question: 'What does the SQL TRIM() function do?',
    answer: 'TRIM() strips leading and trailing whitespace characters (or specified characters) from a string, preventing accidental validation errors when storing student names or roll numbers.',
    keyConcepts: ['String Manipulation', 'Whitespace Sanitization']
  },
  {
    id: 82,
    category: 'SQL Interview',
    question: 'What is the difference between TIMESTAMP and DATETIME in MySQL?',
    answer: 'DATETIME stores absolute dates from 1000-9999 without timezone awareness (consumes 5 bytes). TIMESTAMP converts stored values from the current timezone to UTC for storage and back on retrieval (range 1970-2038, consumes 4 bytes).',
    keyConcepts: ['DATETIME', 'TIMESTAMP', 'Timezone Conversion', 'Range']
  },
  {
    id: 83,
    category: 'SQL Interview',
    question: 'How do you concatenate strings in MySQL?',
    answer: 'Using the `CONCAT()` function: `SELECT CONCAT(building, " - Floor ", floor) AS hall_location FROM hall;` or `CONCAT_WS()` with a separator.',
    keyConcepts: ['CONCAT()', 'CONCAT_WS()', 'String Formatting']
  },
  {
    id: 84,
    category: 'SQL Interview',
    question: 'What does the SQL EXISTS operator return?',
    answer: 'EXISTS returns a boolean TRUE or FALSE based on whether the subquery returns at least one row. It short-circuits evaluation upon finding the first match, making it faster than IN for large subquery sets.',
    keyConcepts: ['EXISTS', 'Short-circuit Evaluation', 'Boolean Predicate']
  },
  {
    id: 85,
    category: 'SQL Interview',
    question: 'What is a surrogate key and why is it preferred over natural keys for joins?',
    answer: 'Surrogate keys are compact, immutable integer numbers (`int auto_increment`). They produce smaller index trees, accelerate B-tree comparisons, and insulate foreign keys from business changes (e.g. student changing roll number).',
    keyConcepts: ['Surrogate Key', 'B-Tree Density', 'Immutability']
  },
  {
    id: 86,
    category: 'SQL Interview',
    question: 'What is database sharding?',
    answer: 'Sharding is horizontal partitioning that divides a database into smaller, faster pieces called shards across multiple physical database instances, each holding a subset of the rows.',
    keyConcepts: ['Horizontal Scalability', 'Shard Key', 'Distributed Data']
  },
  {
    id: 87,
    category: 'SQL Interview',
    question: 'How do you check for duplicate roll numbers before inserting?',
    answer: '`SELECT roll_no, COUNT(*) FROM student GROUP BY roll_no HAVING COUNT(*) > 1;` or by declaring `roll_no VARCHAR(20) UNIQUE NOT NULL` at table creation.',
    keyConcepts: ['Duplicate Check', 'HAVING Clause', 'UNIQUE Constraint']
  },
  {
    id: 88,
    category: 'SQL Interview',
    question: 'What is the purpose of the MySQL binary log (binlog)?',
    answer: 'The binary log records all statements that change database structure or content (DDL and DML). It is vital for master-slave replication and point-in-time disaster recovery.',
    keyConcepts: ['Binlog', 'Replication', 'Point-in-time Recovery']
  },
  {
    id: 89,
    category: 'SQL Interview',
    question: 'What is the SQL CAST() function?',
    answer: 'CAST converts an expression of one data type into another: `SELECT CAST(floor AS CHAR) AS floor_str FROM hall;` or `CAST(exam_date AS DATETIME)`.',
    keyConcepts: ['Type Casting', 'Explicit Conversion']
  },
  {
    id: 90,
    category: 'SQL Interview',
    question: 'How do you calculate running totals in SQL?',
    answer: 'Using the SUM window function: `SELECT roll_no, student_id, SUM(1) OVER (ORDER BY student_id) AS cumulative_students FROM student;`',
    keyConcepts: ['Running Total', 'Cumulative Sum', 'Window Function']
  },
  {
    id: 91,
    category: 'SQL Interview',
    question: 'What is optimistic concurrency control vs pessimistic locking?',
    answer: 'Pessimistic locking locks records on read (`SELECT ... FOR UPDATE`) preventing conflicts. Optimistic concurrency control checks a version/timestamp column at commit time; if modified, the transaction is rejected and retried.',
    keyConcepts: ['Pessimistic Locking', 'Optimistic Locking', 'Version Checking']
  },
  {
    id: 92,
    category: 'SQL Interview',
    question: 'What does SELECT ... FOR UPDATE do in MySQL?',
    answer: 'It acquires an exclusive lock (X lock) on the read rows within an active transaction, preventing other transactions from updating or locking those rows until the current transaction commits or rolls back.',
    keyConcepts: ['FOR UPDATE', 'Exclusive Lock', 'Row-level Locking']
  },
  {
    id: 93,
    category: 'SQL Interview',
    question: 'What is the purpose of indexes on foreign key columns?',
    answer: 'Indexing foreign keys prevents full table scans on child tables during parent deletes/updates and drastically accelerates relational joins.',
    keyConcepts: ['FK Indexing', 'Join Speed', 'Lock Reduction']
  },
  {
    id: 94,
    category: 'SQL Interview',
    question: 'How do you export SQL query results to CSV?',
    answer: '`SELECT * FROM allocation INTO OUTFILE "/tmp/allocations.csv" FIELDS TERMINATED BY "," ENCLOSED BY """ LINES TERMINATED BY "\\n";` or client-side export.',
    keyConcepts: ['INTO OUTFILE', 'CSV Export', 'Data Interchange']
  },
  {
    id: 95,
    category: 'SQL Interview',
    question: 'What is database collation and how does it affect string comparisons?',
    answer: 'Collation specifies alphabetical sorting and character equality rules (e.g., whether `a` equals `A` in `_ci` case-insensitive collation or differs in `_bin` binary collation).',
    keyConcepts: ['Collation', 'Sort Ordering', 'Case Insensitivity']
  },
  {
    id: 96,
    category: 'SQL Interview',
    question: 'What is a cursor in stored procedures and when should it be avoided?',
    answer: 'A cursor iterates through query result sets row-by-row. Cursors should be avoided when set-based SQL operations can achieve the same result because row-by-row processing incurs high memory and CPU overhead.',
    keyConcepts: ['Cursor', 'Set-based vs Procedural', 'Performance']
  },
  {
    id: 97,
    category: 'SQL Interview',
    question: 'What is the purpose of SQL savepoints?',
    answer: 'A SAVEPOINT marks an intermediate point within a transaction that can be rolled back to (`ROLLBACK TO SAVEPOINT sp1`) without rolling back the entire transaction.',
    keyConcepts: ['SAVEPOINT', 'Partial Rollback', 'Transactional Control']
  },
  {
    id: 98,
    category: 'SQL Interview',
    question: 'What is database connection leak and how is it resolved?',
    answer: 'A connection leak occurs when applications open database connections and fail to close them (e.g. unhandled exceptions), exhausting the connection pool. It is resolved using try-with-resources or connection context managers.',
    keyConcepts: ['Connection Leak', 'Resource Disposal', 'Pool Starvation']
  },
  {
    id: 99,
    category: 'SQL Interview',
    question: 'What is an index Cardinality in MySQL?',
    answer: 'Index cardinality is the estimated number of unique values in an indexed column. High cardinality (e.g. roll_no) means high selectivity, allowing the query optimizer to filter rows rapidly.',
    keyConcepts: ['Index Cardinality', 'Selectivity', 'B-Tree Efficiency']
  },
  {
    id: 100,
    category: 'SQL Interview',
    question: 'Explain why `SELECT *` is considered a bad practice in production systems.',
    answer: '`SELECT *` retrieves unnecessary columns consuming memory, network bandwidth, and I/O; prevents the use of covering indexes; and breaks client code if schema column order evolves.',
    keyConcepts: ['Covering Index', 'Network Bandwidth', 'Schema Evolution']
  },

  // ===================== PROJECT VIVA QUESTIONS (50) =====================
  {
    id: 101,
    category: 'Project Viva',
    question: 'What is the core objective of the Exam Hall and Seating Allocation System?',
    answer: 'To automate examination seating plans, eliminate manual paper-based room allocation, eradicate double-booking of seats, enforce physical hall capacity limits, provide instantaneous admit-card seat lookup for students, and generate printable door-attendance lists for invigilating faculty.',
    keyConcepts: ['Automation', 'Double-booking Elimination', 'Capacity Enforcement']
  },
  {
    id: 102,
    category: 'Project Viva',
    question: 'What are the distinct user roles in this application and their access privileges?',
    answer: '1) Admin: Full CRUD access across Students, Faculty, Exams, Halls, Seats, Allocations, and direct execution access to database management utilities and SQL execution. 2) Student & Faculty (Unified Portal): Strict read-only (SELECT) access. Students view their admit card and designated seat. Faculty view hall attendance sheets, room seating layouts, and subject allocations.',
    keyConcepts: ['Role-Based Access Control', 'Principle of Least Privilege', 'Read-Only Portal']
  },
  {
    id: 103,
    category: 'Project Viva',
    question: 'Explain the Automatic Seating Allocation Algorithm implemented in this project.',
    answer: '1) Retrieve eligible students for an exam sorted by roll number. 2) Retrieve available halls and their physical seat grid (row-major order). 3) Iterate students: verify seat status = Available, insert ALLOCATION record, and mark seat as Occupied. 4) If a hall reaches 100% capacity, systematically transition to the next hall. 5) Wrap entire routine in a database transaction to ensure atomicity.',
    keyConcepts: ['Row-Major Fill', 'Capacity Check', 'Overflow Transition', 'Transactional Safety']
  },
  {
    id: 104,
    category: 'Project Viva',
    question: 'How does the system prevent duplicate seat assignments during the same examination session?',
    answer: 'At the database level, a UNIQUE composite constraint `UNIQUE KEY uq_exam_seat (exam_id, seat_id)` and an event trigger `trg_prevent_duplicate_seat` prevent duplicate records. At the application level, the allocation algorithm checks availability before assignment.',
    keyConcepts: ['Composite Unique Key', 'Database Trigger', 'Double-booking Prevention']
  },
  {
    id: 105,
    category: 'Project Viva',
    question: 'How are database tables normalized in this project?',
    answer: 'The database is normalized to 3NF: Student attributes are isolated from Exam attributes; Halls are isolated from individual physical Seats; and Allocations associate Student, Exam, and Seat through surrogate foreign keys with zero attribute duplication.',
    keyConcepts: ['3NF Normalization', 'Surrogate Foreign Keys', 'Anomaly Prevention']
  },
  {
    id: 106,
    category: 'Project Viva',
    question: 'Explain the database schema relationships in this system.',
    answer: '1) Hall (1) to Seat (N): One hall contains many seats; each seat belongs to one hall. 2) Student (1) to Allocation (N): One student has many allocations across different exams. 3) Exam (1) to Allocation (N): One exam allocates many students. 4) Seat (1) to Allocation (N): One seat can be reused across different exam dates.',
    keyConcepts: ['1:N Relationships', 'M:N Resolution', 'Entity Relationships']
  },
  {
    id: 107,
    category: 'Project Viva',
    question: 'What happens if the total number of students exceeds the capacity of selected examination halls?',
    answer: 'The system triggers a validation exception: it calculates total available seats against registered candidate headcount. If capacity is insufficient, the transaction rolls back with a detailed warning informing the administrator of the deficit.',
    keyConcepts: ['Capacity Validation', 'Deficit Warning', 'Rollback']
  },
  {
    id: 108,
    category: 'Project Viva',
    question: 'What triggers are implemented in the database and why?',
    answer: '1) `trg_prevent_duplicate_seat`: BEFORE INSERT trigger verifying seat availability. 2) `trg_update_seat_status_occupied`: AFTER INSERT trigger updating seat status to Occupied. 3) `trg_update_seat_status_freed`: AFTER DELETE trigger returning seat status to Available. 4) `trg_audit_log`: Logs administrative modifications.',
    keyConcepts: ['BEFORE Trigger', 'AFTER Trigger', 'Audit Trail', 'Status Synchronization']
  },
  {
    id: 109,
    category: 'Project Viva',
    question: 'What views are created in this project and what purpose do they serve?',
    answer: '1) `vw_student_allocations`: Resolves 4-table joins into a flat student admit card view. 2) `vw_hall_occupancy`: Summarizes seat capacity, occupied seats, and utilization percentage. 3) `vw_exam_schedule`: Formatted timetable view. 4) `vw_seat_availability`: Fast lookup for unoccupied desks.',
    keyConcepts: ['Virtual Views', 'Query Abstraction', 'Report Simplification']
  },
  {
    id: 110,
    category: 'Project Viva',
    question: 'How does the system ensure fast retrieval of student seating information during peak exam hours?',
    answer: 'By indexing the natural key `roll_no` on the STUDENT table, indexing foreign keys on ALLOCATION (`student_id`, `exam_id`, `seat_id`), and exposing the pre-joined virtual view `vw_student_allocations`, lookups execute in O(log N) time.',
    keyConcepts: ['B+ Tree Indexes', 'Foreign Key Indexing', 'Peak Query Performance']
  },
  {
    id: 111,
    category: 'Project Viva',
    question: 'How is security implemented for user authentication?',
    answer: 'Passwords are protected using cryptographic hashing (bcrypt/PBKDF2 with salt) so plaintext credentials are never stored. Role-based session cookies authenticate requests, and student/faculty sessions cannot access administrative endpoints.',
    keyConcepts: ['Password Hashing', 'Salt', 'Role-Based Authentication', 'Session Security']
  },
  {
    id: 112,
    category: 'Project Viva',
    question: 'What reports can be generated and exported from this system?',
    answer: '1) Student-wise Admit Card / Hall Ticket. 2) Hall-wise Invigilation & Seating Chart. 3) Branch-wise Allocation Breakdown. 4) Subject-wise Allocation Report. 5) Daily Exam Schedule & Candidate Census. 6) Campus-wide Seat Occupancy Audit. All reports can be exported to PDF, Excel CSV, or printed directly.',
    keyConcepts: ['Report Generation', 'PDF Export', 'Excel CSV', 'Printable Door Charts']
  },
  {
    id: 113,
    category: 'Project Viva',
    question: 'What is the advantage of using Python Flask and MySQL for this project backend?',
    answer: 'Flask is a lightweight, scalable WSGI microframework offering clean route decorators and native integration with MySQL drivers (PyMySQL / mysql-connector). MySQL provides high-performance ACID compliance, mature index engines, and stored procedure support.',
    keyConcepts: ['Microframework', 'WSGI', 'ACID Compliance', 'MySQL Connector']
  },
  {
    id: 114,
    category: 'Project Viva',
    question: 'How does the student visual seat locator work in the UI?',
    answer: 'When a student logs in, the portal retrieves their allocation record and renders a dynamic SVG/CSS grid representing the physical hall. Their designated seat is highlighted in vibrant blue with an animated "YOU ARE HERE" badge, while surrounding seats show room context.',
    keyConcepts: ['Visual Grid', 'Seat Coordinates', 'User Experience']
  },
  {
    id: 115,
    category: 'Project Viva',
    question: 'How can faculty use this system on exam day?',
    answer: 'Faculty log in with their Faculty ID, select their assigned Hall or Subject, and view or print the Hall Seating Sheet containing student names, roll numbers, photos/placeholders, seat numbers, and physical signature check boxes for attendance verification.',
    keyConcepts: ['Invigilation Roster', 'Attendance Sheet', 'Signature Verification']
  },
  {
    id: 116,
    category: 'Project Viva',
    question: 'Explain how the SQL Execution Lab works in the AI Studio environment.',
    answer: 'The system embeds an interactive relational SQL query evaluator supporting DDL, DML, JOINS, Aggregates, Views, and Transactions against the active database state, enabling evaluators to run real SQL commands and inspect execution times and tabular results.',
    keyConcepts: ['In-browser SQL Engine', 'Interactive Evaluation', 'Query Parser']
  },
  {
    id: 117,
    category: 'Project Viva',
    question: 'What is the significance of the AUDIT_LOG table in this project?',
    answer: 'It maintains a non-repudiation audit trail recording every administrative event (student insertions, seat status modifications, automated allocation executions) with timestamps and actor metadata for regulatory compliance.',
    keyConcepts: ['Audit Trail', 'Non-repudiation', 'Compliance']
  },
  {
    id: 118,
    category: 'Project Viva',
    question: 'How is multi-subject seating (anti-cheating arrangement) accommodated?',
    answer: 'The allocation engine supports an alternating jumble strategy where students from different branches or subjects (e.g. CSE CS401 and ECE EC301) are assigned to alternating adjacent seats, preventing neighboring students from writing the same exam paper.',
    keyConcepts: ['Anti-cheating Strategy', 'Interleaved Allocation', 'Adjacent Subject Separation']
  },
  {
    id: 119,
    category: 'Project Viva',
    question: 'What are the main hardware and software requirements to deploy this project locally?',
    answer: 'Hardware: Any standard PC with 4GB RAM, dual-core CPU, 500MB disk space. Software: Python 3.9+, MySQL Server 8.0+, web browser (Chrome/Edge/Firefox), and Node.js (for React frontend compilation).',
    keyConcepts: ['Hardware Footprint', 'Deployment Prerequisites', 'MySQL 8.0']
  },
  {
    id: 120,
    category: 'Project Viva',
    question: 'What future enhancements can be added to this system?',
    answer: '1) Biometric / RFID barcode scanning at the examination hall door. 2) Automated SMS/Email notification dispatching seat numbers on exam morning. 3) Mobile native app for offline invigilator attendance marking. 4) AI-powered dynamic room temperature and ventilation optimization.',
    keyConcepts: ['Future Scope', 'RFID Integration', 'Automated Push Notifications']
  },
];
