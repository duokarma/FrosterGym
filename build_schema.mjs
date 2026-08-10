import fs from 'fs';

const files = [
    'supabase/migrations/001_foundation.sql',
    'supabase/migrations/002_schema_extensions.sql',
    'supabase/migrations/003_complete_schema.sql',
    'src/lib/schema.sql'
];

let masterSql = '-- FROASTER GYM COMPLETE MASTER SCHEMA --\n\n';

for (const file of files) {
    if (fs.existsSync(file)) {
        masterSql += `-- ====== FILE: ${file} ======\n`;
        masterSql += fs.readFileSync(file, 'utf8') + '\n\n';
    }
}

// Fix the auth.gym_id() issue
masterSql = masterSql.replace(/auth\.gym_id\(\)/g, 'public.get_gym_id()');

// Fix the duplicated staff_permissions table. 
// We will replace the SECOND occurrence (which has 'module_name TEXT NOT NULL') with a DROP statement
masterSql = masterSql.replace(
    /CREATE TABLE IF NOT EXISTS public\.staff_permissions \(\s*id UUID PRIMARY KEY DEFAULT gen_random_uuid\(\),\s*gym_id UUID NOT NULL REFERENCES public\.gyms\(id\) ON DELETE CASCADE,\s*user_id UUID NOT NULL REFERENCES auth\.users\(id\) ON DELETE CASCADE,\s*module_name TEXT NOT NULL,/g,
    'DROP TABLE IF EXISTS public.staff_permissions CASCADE;\n\nCREATE TABLE public.staff_permissions (\n    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n    gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,\n    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,\n    module_name TEXT NOT NULL,'
);

fs.writeFileSync('master_schema.sql', masterSql);
console.log('Rebuilt master_schema.sql successfully.');
