import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkData() {
    const { data, error } = await supabase.from('students').select('university_roll_no, name, batch').limit(10);
    if (error) console.error(error);
    else console.log(data);
}

checkData();
