import os

with open('.env.local', 'w') as f:
    f.write('NEXT_PUBLIC_SUPABASE_URL=https://dummy.supabase.co\n')
    f.write('NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy\n')
    f.write('SUPABASE_SERVICE_ROLE_KEY=dummy\n')
