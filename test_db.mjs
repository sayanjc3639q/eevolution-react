import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tkgkyugqmusumwsznoeq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZ2t5dWdxbXVzdW13c3pub2VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NTg5OTMsImV4cCI6MjA4ODQzNDk5M30.Tzw40D14SPu0ahEiVzpVA8R7kvXnZd1hdeA_acNPRoE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
    const { data, error } = await supabase.from('students').select('*').limit(1);
    if (error) {
        console.error(error);
    } else {
        console.log(Object.keys(data[0] || {}));
    }
}
check();
