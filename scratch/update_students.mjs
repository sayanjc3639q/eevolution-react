import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function updateStudents() {
    try {
        const jsonData = JSON.parse(fs.readFileSync('d:/DDownload/batch1data.json', 'utf8'));
        console.log(`Loaded ${jsonData.length} students from JSON.`);

        for (const item of jsonData) {
            const universityRollNo = String(item.university_roll);
            // Extract roll number from the end of university roll (e.g. 10301625001 -> 1)
            const rollNumber = parseInt(universityRollNo.slice(-3));
            const batch = rollNumber <= 68 ? 'Batch 1' : 'Batch 2';
            
            const studentUpdate = {
                name: item.name,
                reg_no: item.registration_no,
                student_id: String(item.roll_no),
                university_roll_no: universityRollNo,
                batch: batch,
                class_roll_no: String(rollNumber)
            };

            // We upsert based on university_roll_no
            const { error } = await supabase
                .from('students')
                .upsert(studentUpdate, { onConflict: 'university_roll_no' });

            if (error) {
                console.error(`Error upserting ${universityRollNo}:`, error.message);
            } else {
                console.log(`Updated ${universityRollNo} (${item.name}) -> ${batch}`);
            }
        }
        console.log('Update complete.');
    } catch (err) {
        console.error('Script Failed:', err);
    }
}

updateStudents();
