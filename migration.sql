-- Migration to add Batch labels and import Batch 1 students

-- Add batch column if it doesn't exist
ALTER TABLE students ADD COLUMN IF NOT EXISTS batch TEXT;

-- Label existing students based on their roll numbers
UPDATE students SET batch = 'Batch 1' WHERE CAST(SPLIT_PART(class_roll_no, '/', 3) AS INTEGER) <= 68;
UPDATE students SET batch = 'Batch 2' WHERE CAST(SPLIT_PART(class_roll_no, '/', 3) AS INTEGER) >= 69;
UPDATE students SET batch = 'Batch 2' WHERE batch IS NULL; -- Fallback

-- Insert new students from JSON (Batch 1 focus)
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('ABHIGYAN SHEET', '10301625001', '016-25-0456', '25/EE/001', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('ABHIJIT DAS', '10301625002', '016-25-0943', '25/EE/002', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('ABHIRUP DEY', '10301625003', '016-25-0494', '25/EE/003', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('ADARSH SHAW', '10301625004', '016-25-1993', '25/EE/004', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('ADITYA RAJ', '10301625005', '016-25-1936', '25/EE/005', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('AKASH KUMAR YADAV', '10301625006', '016-25-1832', '25/EE/006', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('AKASH MANNA', '10301625007', '016-25-0445', '25/EE/007', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('ANANDI', '10301625008', '016-25-0531', '25/EE/008', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('ANANYA AGYA', '10301625009', '016-25-2020', '25/EE/009', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('ANINDYA KARAK', '10301625010', '016-25-0441', '25/EE/010', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('ANIRBAN HAZRA', '10301625011', '016-25-0482', '25/EE/011', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('ANIRUDDHA JANA', '10301625012', '016-25-0472', '25/EE/012', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('ANISH KUMAR PRADHAN', '10301625013', '016-25-0516', '25/EE/013', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('ANKIT DEY', '10301625014', '016-25-1006', '25/EE/014', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('ANKIT KUMAR', '10301625015', '016-25-0957', '25/EE/015', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('ANSHUMAN CHAULYA', '10301625016', '016-25-0500', '25/EE/016', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('ANUSHREE MISHRA', '10301625017', '016-25-0462', '25/EE/017', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('ANUSREE BERA', '10301625018', '016-25-0518', '25/EE/018', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('ARATRIK BERA', '10301625019', '016-25-0484', '25/EE/019', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('ARITRA SARDAR', '10301625020', '016-25-0470', '25/EE/020', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('ARKA BARMAN', '10301625021', '016-25-1752', '25/EE/021', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('ARNAB BARMAN', '10301625022', '016-25-0953', '25/EE/022', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('ARNAB SAMANTA', '10301625023', '016-25-0468', '25/EE/023', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('ATANU MIDYA', '10301625024', '016-25-1787', '25/EE/024', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('AVIGYAN BANERJEE', '10301625025', '016-25-0442', '25/EE/025', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('AVIJIT GHORAI', '10301625026', '016-25-0452', '25/EE/026', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('AVINANDAN KHATUA', '10301625027', '016-25-1844', '25/EE/027', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('AVINANDAN MANDAL', '10301625028', '016-25-0499', '25/EE/028', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('AYAN PRAMANIK', '10301625029', '016-25-0469', '25/EE/029', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('AYUSH KUMAR', '10301625030', '016-25-0465', '25/EE/030', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('AYUSHI SINGH', '10301625031', '016-25-0440', '25/EE/031', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('BILTU BARIK', '10301625032', '016-25-0510', '25/EE/032', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('BITAN MALIK', '10301625033', '016-25-0466', '25/EE/033', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('CHANDAN KUMAR', '10301625034', '016-25-0479', '25/EE/034', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('DEBAJYOTI MANDAL', '10301625035', '016-25-0485', '25/EE/035', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('DEBDUT BERA', '10301625036', '016-25-0467', '25/EE/036', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('DEBDUT MANDAL', '10301625037', '016-25-0460', '25/EE/037', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('DEBJIT BARIK', '10301625038', '016-25-0505', '25/EE/038', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('DEVANSHU THAKUR', '10301625039', '016-25-1154', '25/EE/039', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('DIPAK RANJAN KAR', '10301625040', '016-25-0911', '25/EE/040', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('DIPANJAN SAMANTA', '10301625041', '016-25-0509', '25/EE/041', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('DIPAYAN JANA', '10301625042', '016-25-0532', '25/EE/042', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('DWIP HALDER', '10301625043', '016-25-1974', '25/EE/043', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('HARSHIT RAJ', '10301625044', '016-25-0458', '25/EE/044', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('HIRANMOY PRAMANIK', '10301625045', '016-25-0444', '25/EE/045', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('KANCHAN BAIRAGI', '10301625046', '016-25-1043', '25/EE/046', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('KHOKAN PRAMANIK', '10301625047', '016-25-0450', '25/EE/047', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('KISHOR KUMAR ADAK', '10301625048', '016-25-1831', '25/EE/048', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('KOUSHIK KALA', '10301625049', '016-25-0483', '25/EE/049', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('KOUSHIK MAHATO', '10301625050', '016-25-1754', '25/EE/050', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('KOUSHIK PATRA', '10301625051', '016-25-0780', '25/EE/051', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('KRISHANU DAS', '10301625052', '016-25-1851', '25/EE/052', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('KUMAR VINAY', '10301625053', '016-25-1931', '25/EE/053', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('LOKESH KUMAR GUPTA', '10301625054', '016-25-1193', '25/EE/054', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('MANAB MONDAL', '10301625055', '016-25-2082', '25/EE/055', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('MD MUSTAKIM KHAN', '10301625056', '016-25-0514', '25/EE/056', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('MD SHIBLI RAZA', '10301625057', '016-25-0513', '25/EE/057', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('MERAZ SEIKH', '10301625058', '016-25-1933', '25/EE/058', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('MRITUNJAY KUMAR', '10301625059', '016-25-1940', '25/EE/059', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('NAVNEET KUMAR SINGH', '10301625060', '016-25-2006', '25/EE/060', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('NILESH KISHORE', '10301625061', '016-25-1848', '25/EE/061', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('PRINCE KUMAR YADAV', '10301625062', '016-25-2076', '25/EE/062', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('PRIYANSHU KUMAR', '10301625063', '016-25-0481', '25/EE/063', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('RADHIKA KUMARI', '10301625064', '016-25-2172', '25/EE/064', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('RAHUL KOLEY', '10301625065', '016-25-0504', '25/EE/065', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('RAJESH MANDAL', '10301625066', '016-25-0817', '25/EE/066', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('RAJIB MANNA', '10301625067', '016-25-0459', '25/EE/067', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('RAJIB SAHU', '10301625068', '016-25-0449', '25/EE/068', 'Batch 1', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('RAM VIKASH KUMAR', '10301625069', '016-25-0511', '25/EE/069', 'Batch 2', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('RANI ROY', '10301625070', '016-25-0913', '25/EE/070', 'Batch 2', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('RANIT KUMAR SAHOO', '10301625071', '016-25-0506', '25/EE/071', 'Batch 2', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
INSERT INTO students (name, university_roll_no, reg_no, class_roll_no, batch, is_approved)
VALUES ('RAUL GHOSH', '10301625072', '016-25-0454', '25/EE/072', 'Batch 2', false)
ON CONFLICT (class_roll_no) DO UPDATE SET 
    batch = EXCLUDED.batch,
    university_roll_no = EXCLUDED.university_roll_no,
    reg_no = EXCLUDED.reg_no;
