import re

with open('lib/auth-server.ts', 'r') as f:
    content = f.read()

# Make the module safe to load during build if env vars are missing
content = re.sub(
    r"const supabaseUrl = process\.env\.NEXT_PUBLIC_SUPABASE_URL!;\s*const supabaseServiceKey = process\.env\.SUPABASE_SERVICE_ROLE_KEY!;",
    """const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';""",
    content
)

with open('lib/auth-server.ts', 'w') as f:
    f.write(content)
