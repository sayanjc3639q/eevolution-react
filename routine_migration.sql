-- Step 1: Add batch column to routines table
ALTER TABLE routines ADD COLUMN IF NOT EXISTS batch TEXT DEFAULT 'Batch 2';

-- Step 2: Ensure existing routines are labeled as Batch 2
UPDATE routines SET batch = 'Batch 2' WHERE batch IS NULL;

-- Step 3: Insert Batch 1 routines
INSERT INTO routines (day, start_time, end_time, subject, prof, room, batch) 
VALUES ('Monday', '09:40', '10:30', 'BS-M 201', 'NF2(Math)', 'A204', 'Batch 1');
INSERT INTO routines (day, start_time, end_time, subject, prof, room, batch) 
VALUES ('Monday', '10:30', '11:20', 'BS-CH 201', 'DKD(CHEM)', 'A204', 'Batch 1');
INSERT INTO routines (day, start_time, end_time, subject, prof, room, batch) 
VALUES ('Monday', '11:20', '12:10', 'ES-CS 201', 'SD(DS)', 'A204', 'Batch 1');
INSERT INTO routines (day, start_time, end_time, subject, prof, room, batch) 
VALUES ('Monday', '12:10', '13:50', 'HM-HU 291', 'Gr.A: SB(SASH), Gr.B: BM(SASH)', 'Language Lab(SASH) / A204', 'Batch 1');
INSERT INTO routines (day, start_time, end_time, subject, prof, room, batch) 
VALUES ('Tuesday', '09:40', '12:10', 'ES-ME 292', 'AKS(ME) / RHD(ME)', 'New Graphics Lab-II(ME)', 'Batch 1');
INSERT INTO routines (day, start_time, end_time, subject, prof, room, batch) 
VALUES ('Tuesday', '13:50', '14:40', 'HM-HU 201', 'PN(ENG)', 'A204', 'Batch 1');
INSERT INTO routines (day, start_time, end_time, subject, prof, room, batch) 
VALUES ('Tuesday', '14:40', '15:30', 'BS-CH 201', 'DKD(CHEM)', 'A204', 'Batch 1');
INSERT INTO routines (day, start_time, end_time, subject, prof, room, batch) 
VALUES ('Tuesday', '15:30', '16:20', 'ES-CS 201', 'SD(DS)', 'A204', 'Batch 1');
INSERT INTO routines (day, start_time, end_time, subject, prof, room, batch) 
VALUES ('Tuesday', '16:20', '17:10', 'BS-M 201', 'BA(Math)', 'A204', 'Batch 1');
INSERT INTO routines (day, start_time, end_time, subject, prof, room, batch) 
VALUES ('Tuesday', '17:10', '18:00', 'MNT', 'BA(Math)/DH(Phy)/STM(Phy)', 'A204', 'Batch 1');
INSERT INTO routines (day, start_time, end_time, subject, prof, room, batch) 
VALUES ('Wednesday', '09:40', '12:10', 'BS-CH 291', 'DKD(CHEM) / GRM(SASH)', 'Chemistry-Lab1(SASH)', 'Batch 1');
INSERT INTO routines (day, start_time, end_time, subject, prof, room, batch) 
VALUES ('Wednesday', '14:40', '15:30', 'BS-CH 201', 'AC(CHEM)', 'A204', 'Batch 1');
INSERT INTO routines (day, start_time, end_time, subject, prof, room, batch) 
VALUES ('Wednesday', '15:30', '16:20', 'HM-HU 201', 'PN(ENG)', 'A204', 'Batch 1');
INSERT INTO routines (day, start_time, end_time, subject, prof, room, batch) 
VALUES ('Wednesday', '16:20', '17:10', 'HS-MC201', 'OS(ENG)', 'A204', 'Batch 1');
INSERT INTO routines (day, start_time, end_time, subject, prof, room, batch) 
VALUES ('Wednesday', '17:10', '18:00', 'PDCC', 'ABK(ENG)', 'A204', 'Batch 1');
INSERT INTO routines (day, start_time, end_time, subject, prof, room, batch) 
VALUES ('Thursday', '09:40', '10:30', 'ES-CS 201', 'SD(DS)', 'A204', 'Batch 1');
INSERT INTO routines (day, start_time, end_time, subject, prof, room, batch) 
VALUES ('Thursday', '10:30', '11:20', 'BS-M 201', 'BA(Math)', 'A204', 'Batch 1');
INSERT INTO routines (day, start_time, end_time, subject, prof, room, batch) 
VALUES ('Thursday', '11:20', '12:10', 'HS-MC201', 'OS(ENG)', 'A204', 'Batch 1');
INSERT INTO routines (day, start_time, end_time, subject, prof, room, batch) 
VALUES ('Thursday', '12:10', '13:00', 'AU-202', 'VR(EE)', 'A204', 'Batch 1');
INSERT INTO routines (day, start_time, end_time, subject, prof, room, batch) 
VALUES ('Thursday', '14:40', '17:10', 'ES-CS 291', 'PG(DS) / SD(DS)', 'Advanced Optimization Lab(SASH)', 'Batch 1');
INSERT INTO routines (day, start_time, end_time, subject, prof, room, batch) 
VALUES ('Friday', '09:40', '10:30', 'BS-CH 201', 'AC(CHEM)', 'A204', 'Batch 1');
INSERT INTO routines (day, start_time, end_time, subject, prof, room, batch) 
VALUES ('Friday', '10:30', '11:20', 'BS-M 201', 'NF2(Math)', 'A204', 'Batch 1');
INSERT INTO routines (day, start_time, end_time, subject, prof, room, batch) 
VALUES ('Friday', '11:20', '12:10', 'ES-CS 201', 'SD(DS)', 'A204', 'Batch 1');
INSERT INTO routines (day, start_time, end_time, subject, prof, room, batch) 
VALUES ('Friday', '12:10', '13:00', 'AU-202', 'VR(EE)', 'A204', 'Batch 1');
