import fs from 'fs';

const routineData = JSON.parse(fs.readFileSync('./tempdata/batch1routine.json', 'utf8'));
const schedule = routineData.schedule;

let sql = `-- Step 1: Add batch column to routines table\n`;
sql += `ALTER TABLE routines ADD COLUMN IF NOT EXISTS batch TEXT DEFAULT 'Batch 2';\n\n`;

sql += `-- Step 2: Ensure existing routines are labeled as Batch 2\n`;
sql += `UPDATE routines SET batch = 'Batch 2' WHERE batch IS NULL;\n\n`;

sql += `-- Step 3: Insert Batch 1 routines\n`;

const days = Object.keys(schedule);
days.forEach(day => {
    schedule[day].forEach(item => {
        const timeSplit = item.time.split('-');
        const startTime = timeSplit[0].trim().padStart(5, '0');
        let endTime = timeSplit[1].trim().padStart(5, '0');
        
        // Handle cases where time might be like "13:50" or "9:40"
        // Ensure format is HH:MM
        const fixTime = (t) => {
            let [h, m] = t.split(':');
            if (h.length === 1) h = '0' + h;
            return `${h}:${m}`;
        };

        const start = fixTime(startTime);
        const end = fixTime(endTime);
        const subject = item.subject.replace(/'/g, "''");
        const prof = (item.faculty || item.details || '').replace(/'/g, "''");
        const room = item.room.replace(/'/g, "''");

        sql += `INSERT INTO routines (day, start_time, end_time, subject, prof, room, batch) \n`;
        sql += `VALUES ('${day}', '${start}', '${end}', '${subject}', '${prof}', '${room}', 'Batch 1');\n`;
    });
});

fs.writeFileSync('routine_migration.sql', sql);
console.log('routine_migration.sql generated successfully.');
