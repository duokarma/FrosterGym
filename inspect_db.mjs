import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pndkqnnsxjpjvxufrdav.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuZGtxbm5zeGpwanZ4dWZyZGF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzNjM3MDQsImV4cCI6MjEwMTkzOTcwNH0.jg8WjUv2q6rw3icJH4vTlz4tMLc7simaaVbW6_WWDHo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  const { data: gyms, error: gymErr } = await supabase.from('gyms').select('*');
  console.log('Gyms:', gyms, gymErr);
  
  const { data: profiles, error: profErr } = await supabase.from('profiles').select('*');
  console.log('Profiles:', profiles, profErr);
  
  const { data: plans, error: planErr } = await supabase.from('membership_plans').select('*');
  console.log('Plans:', plans, planErr);
}

checkData();
