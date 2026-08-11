import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pndkqnnsxjpjvxufrdav.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuZGtxbm5zeGpwanZ4dWZyZGF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzNjM3MDQsImV4cCI6MjEwMTkzOTcwNH0.jg8WjUv2q6rw3icJH4vTlz4tMLc7simaaVbW6_WWDHo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuth() {
  const email = `test${Date.now()}@test.com`;
  const { data, error } = await supabase.auth.signUp({
    email,
    password: 'password123',
    options: { data: { full_name: 'Test Admin' } }
  });
  console.log('SignUp:', data.user?.id, error);
  
  if (data.session) {
    const { data: profile, error: profErr } = await supabase.from('profiles').select('*');
    console.log('Profiles with auth:', profile, profErr);
  } else {
    // If auto-confirm is off, login might fail without confirmation.
    // Let's try signing in with froastergym@gmail.com which probably exists.
    const { data: loginData, error: loginErr } = await supabase.auth.signInWithPassword({
      email: 'froastergym@gmail.com',
      password: 'froaster@2244'
    });
    console.log('Login:', loginData.user?.id, loginErr);
    
    if (loginData.session) {
      const { data: profile, error: profErr } = await supabase.from('profiles').select('*');
      console.log('Profiles with login:', profile, profErr);
    }
  }
}

testAuth();
