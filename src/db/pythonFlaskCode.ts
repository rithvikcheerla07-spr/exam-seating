export const pythonFlaskCode = {
  requirementsTxt: `Flask==3.0.0
PyMySQL==1.1.0
cryptography==42.0.2
Werkzeug==3.0.1
python-dotenv==1.0.1
reportlab==4.1.0
openpyxl==3.1.2`,

  configPy: `import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'exam-hall-alloc-secret-key-2026')
    MYSQL_HOST = os.getenv('MYSQL_HOST', 'localhost')
    MYSQL_USER = os.getenv('MYSQL_USER', 'root')
    MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', 'password')
    MYSQL_DB = os.getenv('MYSQL_DB', 'exam_alloc_db')
    MYSQL_PORT = int(os.getenv('MYSQL_PORT', 3306))
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SECURE = False  # Set to True in HTTPS production
    PERMANENT_SESSION_LIFETIME = 3600  # 1 hour timeout
`,

  databasePy: `import pymysql
from pymysql.cursors import DictCursor
from config import Config

def get_db_connection():
    """Returns a thread-safe connection to MySQL database with Dictionary cursor."""
    return pymysql.connect(
        host=Config.MYSQL_HOST,
        user=Config.MYSQL_USER,
        password=Config.MYSQL_PASSWORD,
        database=Config.MYSQL_DB,
        port=Config.MYSQL_PORT,
        cursorclass=DictCursor,
        autocommit=False
    )
`,

  appPy: `"""
Exam Hall and Seating Allocation System
Final Year Capstone Project (CBP)
Python Flask Backend + MySQL 8.0
"""

import functools
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from database import get_db_connection
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

# =========================================================================
# AUTHENTICATION & ACCESS CONTROL MIDDLEWARE
# =========================================================================

def login_required(role=None):
    def decorator(view):
        @functools.wraps(view)
        def wrapped_view(**kwargs):
            if 'user_id' not in session:
                return jsonify({'error': 'Unauthorized: Please log in'}), 401
            if role and session.get('role') != role:
                return jsonify({'error': 'Forbidden: Insufficient privileges'}), 403
            return view(**kwargs)
        return wrapped_view
    return decorator

# =========================================================================
# AUTHENTICATION ROUTES
# =========================================================================

@app.route('/api/auth/admin-login', methods=['POST'])
def admin_login():
    data = request.json or {}
    username = data.get('username')
    password = data.get('password')

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT admin_id, username, password, name FROM admin WHERE username = %s", (username,))
            admin = cursor.fetchone()
            if admin and (admin['password'] == password or check_password_hash(admin['password'], password)):
                session['user_id'] = admin['admin_id']
                session['role'] = 'admin'
                session['name'] = admin['name']
                return jsonify({'success': True, 'message': 'Welcome Admin', 'user': {'name': admin['name'], 'role': 'admin'}})
            return jsonify({'success': False, 'message': 'Invalid username or password'}), 401
    finally:
        conn.close()

@app.route('/api/auth/student-faculty-login', methods=['POST'])
def student_faculty_login():
    data = request.json or {}
    identifier = data.get('identifier', '').strip()
    password = data.get('password', '').strip()

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            # 1. Check Student by roll_no
            cursor.execute("SELECT student_id, roll_no, student_name, branch, year, section, password FROM student WHERE roll_no = %s", (identifier,))
            student = cursor.fetchone()
            if student:
                if student['password'] == password or check_password_hash(student['password'], password):
                    session['user_id'] = student['student_id']
                    session['role'] = 'student'
                    session['roll_no'] = student['roll_no']
                    session['name'] = student['student_name']
                    return jsonify({'success': True, 'role': 'student', 'user': student})

            # 2. Check Faculty by faculty_id
            cursor.execute("SELECT faculty_id, faculty_name, department, email, password FROM faculty WHERE faculty_id = %s", (identifier,))
            faculty = cursor.fetchone()
            if faculty:
                if faculty['password'] == password or check_password_hash(faculty['password'], password):
                    session['user_id'] = faculty['faculty_id']
                    session['role'] = 'faculty'
                    session['name'] = faculty['faculty_name']
                    return jsonify({'success': True, 'role': 'faculty', 'user': faculty})

            return jsonify({'success': False, 'message': 'Invalid credentials. Record not found.'}), 401
    finally:
        conn.close()

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'success': True, 'message': 'Logged out successfully'})

# =========================================================================
# STUDENT & FACULTY PORTAL ROUTES (STRICT SELECT ONLY)
# =========================================================================

@app.route('/api/portal/student-schedule/<roll_no>', methods=['GET'])
def get_student_schedule(roll_no):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    s.student_name, s.roll_no, s.branch, s.year, s.section,
                    e.subject_code, e.subject_name, e.exam_date, e.start_time, e.end_time,
                    h.hall_number, h.building, h.floor,
                    se.seat_number, se.row_number, se.column_number
                FROM allocation a
                JOIN student s ON a.student_id = s.student_id
                JOIN exam e ON a.exam_id = e.exam_id
                JOIN seat se ON a.seat_id = se.seat_id
                JOIN hall h ON se.hall_id = h.hall_id
                WHERE s.roll_no = %s
                ORDER BY e.exam_date ASC
            """, (roll_no,))
            records = cursor.fetchall()
            return jsonify({'success': True, 'data': records})
    finally:
        conn.close()

@app.route('/api/portal/hall-seating/<hall_number>', methods=['GET'])
def get_hall_seating(hall_number):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    h.hall_number, h.building, h.floor, h.capacity,
                    se.seat_id, se.seat_number, se.row_number, se.column_number, se.status,
                    s.roll_no, s.student_name, s.branch,
                    e.subject_code, e.subject_name
                FROM seat se
                JOIN hall h ON se.hall_id = h.hall_id
                LEFT JOIN allocation a ON se.seat_id = a.seat_id
                LEFT JOIN student s ON a.student_id = s.student_id
                LEFT JOIN exam e ON a.exam_id = e.exam_id
                WHERE h.hall_number = %s
                ORDER BY se.row_number ASC, se.column_number ASC
            """, (hall_number,))
            seats = cursor.fetchall()
            return jsonify({'success': True, 'data': seats})
    finally:
        conn.close()

# =========================================================================
# ADMIN CRUD APIS & SEATING ALLOCATION ALGORITHM
# =========================================================================

@app.route('/api/admin/allocate', methods=['POST'])
@login_required('admin')
def execute_seating_allocation():
    data = request.json or {}
    exam_id = data.get('exam_id')
    hall_ids = data.get('hall_ids', [])

    if not exam_id or not hall_ids:
        return jsonify({'success': False, 'message': 'Exam and at least one Hall are required.'}), 400

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            # 1. Fetch Exam metadata
            cursor.execute("SELECT branch, year FROM exam WHERE exam_id = %s", (exam_id,))
            exam = cursor.fetchone()
            if not exam:
                return jsonify({'success': False, 'message': 'Exam does not exist.'}), 404

            # 2. Fetch eligible students sorted by Roll Number
            cursor.execute("""
                SELECT student_id, roll_no FROM student 
                WHERE branch = %s AND year = %s 
                AND student_id NOT IN (SELECT student_id FROM allocation WHERE exam_id = %s)
                ORDER BY roll_no ASC
            """, (exam['branch'], exam['year'], exam_id))
            students = cursor.fetchall()

            # 3. Fetch available seats in selected halls in row-major sequence
            format_strings = ','.join(['%s'] * len(hall_ids))
            cursor.execute(f"""
                SELECT seat_id, hall_id, seat_number FROM seat 
                WHERE hall_id IN ({format_strings}) AND status = 'Available'
                ORDER BY hall_id ASC, row_number ASC, column_number ASC
            """, tuple(hall_ids))
            seats = cursor.fetchall()

            if len(seats) < len(students):
                return jsonify({
                    'success': False,
                    'message': f"Capacity Deficit: Selected halls have {len(seats)} vacant desks, but {len(students)} students need allocation."
                }), 400

            # 4. Perform atomic transactional allocation
            for i, student in enumerate(students):
                assigned_seat = seats[i]
                cursor.execute("""
                    INSERT INTO allocation (student_id, exam_id, seat_id)
                    VALUES (%s, %s, %s)
                """, (student['student_id'], exam_id, assigned_seat['seat_id']))
                
                cursor.execute("UPDATE seat SET status = 'Occupied' WHERE seat_id = %s", (assigned_seat['seat_id'],))

            # 5. Record Audit Log
            cursor.execute("""
                INSERT INTO audit_log (action, table_name, record_id, details)
                VALUES (%s, %s, %s, %s)
            """, ('AUTO_ALLOCATE', 'ALLOCATION', str(len(students)), f"Allocated {len(students)} students into halls."))

            conn.commit()
            return jsonify({'success': True, 'allocated_count': len(students), 'message': f"Successfully assigned {len(students)} students!"})
    except Exception as e:
        conn.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        conn.close()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
`,
};
