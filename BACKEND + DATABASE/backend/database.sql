-- ============================================================
--  FILE: backend/database.sql
--  STEP 1: Open phpMyAdmin → SQL tab → paste this → click Go
-- ============================================================

CREATE DATABASE IF NOT EXISTS edumark_db;
USE edumark_db;

CREATE TABLE IF NOT EXISTS users (
  user_id    INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  role       ENUM('teacher','student') NOT NULL DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
  student_id INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  grade      VARCHAR(10)  NOT NULL DEFAULT '10th',
  roll_no    VARCHAR(10)  NOT NULL,
  contact    VARCHAR(15),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendance (
  att_id     INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT  NOT NULL,
  date       DATE NOT NULL,
  status     ENUM('P','A') NOT NULL DEFAULT 'A',
  marked_by  INT,
  UNIQUE KEY unique_att (student_id, date),
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS courses (
  course_id   INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(150) NOT NULL,
  description TEXT,
  instructor  VARCHAR(100),
  category    ENUM('language','technical','soft-skills','competition','other') DEFAULT 'other',
  status      ENUM('active','upcoming','completed') DEFAULT 'active',
  start_date  DATE,
  end_date    DATE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS course_enrollments (
  enroll_id  INT AUTO_INCREMENT PRIMARY KEY,
  course_id  INT NOT NULL,
  student_id INT NOT NULL,
  joined_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_enroll (course_id, student_id),
  FOREIGN KEY (course_id)  REFERENCES courses(course_id)   ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS competitions (
  comp_id    INT AUTO_INCREMENT PRIMARY KEY,
  title      VARCHAR(150) NOT NULL,
  description TEXT,
  category   ENUM('technical','language','sports','cultural','other') DEFAULT 'other',
  comp_date  DATE,
  last_date  DATE,
  venue      VARCHAR(150),
  prize      VARCHAR(100),
  status     ENUM('open','closed','upcoming','completed') DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS competition_registrations (
  reg_id        INT AUTO_INCREMENT PRIMARY KEY,
  comp_id       INT NOT NULL,
  student_id    INT NOT NULL,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_reg (comp_id, student_id),
  FOREIGN KEY (comp_id)    REFERENCES competitions(comp_id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(student_id)  ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notices (
  notice_id  INT AUTO_INCREMENT PRIMARY KEY,
  title      VARCHAR(150) NOT NULL,
  message    TEXT,
  type       ENUM('info','warning','success','important') DEFAULT 'info',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Demo teacher  (password = "password")
INSERT IGNORE INTO users (name, email, password, role) VALUES
('Demo Teacher','teacher@gmail.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWq','teacher');

-- Demo students
INSERT IGNORE INTO students (name, grade, roll_no, contact) VALUES
('Rahul Sharma','10th','A01','9876543210'),
('Priya Mehta','10th','A02','9123456780'),
('Arjun Patel','10th','A03','9988776655'),
('Nidha Ansari','10th','A04','9112233445'),
('James Wilson','10th','A05','9334455667'),
('Sara Thomas','10th','A06','9445566778'),
('Amit Kumar','10th','A07','9556677889'),
('Riya Verma','10th','A08','9667788990');

-- Demo courses
INSERT IGNORE INTO courses (title,description,instructor,category,status,start_date,end_date) VALUES
('English Communication','Improve spoken and written English.','Prof. Sharma','language','active','2024-06-01','2024-07-31'),
('Public Speaking','Build confidence speaking in front of others.','Prof. Mehta','soft-skills','active','2024-06-10','2024-07-15'),
('Web Development Basics','HTML, CSS, JavaScript and React.','Prof. Kumar','technical','active','2024-06-15','2024-08-15'),
('Personality Development','Communication and leadership skills.','Prof. Singh','soft-skills','upcoming','2024-07-01','2024-08-30');

-- Demo competitions
INSERT IGNORE INTO competitions (title,description,category,comp_date,last_date,venue,prize,status) VALUES
('English Debate Championship','Inter-college English debate.','language','2024-07-20','2024-07-10','Main Auditorium','₹5,000','open'),
('Tech Quiz 2024','Test your tech knowledge.','technical','2024-07-25','2024-07-18','Lab Block A','₹3,000','open'),
('BCA Project Competition','Present your BCA final year project.','technical','2024-08-20','2024-08-10','Seminar Hall','₹10,000','open'),
('Cultural Fest — Dance','Solo and group dance.','cultural','2024-08-05','2024-07-30','Open Stage','₹7,000','upcoming');

-- Demo notices
INSERT IGNORE INTO notices (title,message,type) VALUES
('Welcome to EduMark!','The attendance and activity system is now live.','success'),
('Mid-term Exams Schedule','Exams start from 15 July. Check your timetable.','important'),
('English Batch Full','Morning batch full. Evening batch seats available.','warning'),
('Holiday on 26 January','College closed on Republic Day.','info');
