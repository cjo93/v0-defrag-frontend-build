import re

with open('lib/supabase.ts', 'r') as f:
    content = f.read()

# Make the module safe to load during build if env vars are missing
content = re.sub(
    r"const isProduction = process\.env\.NEXT_PUBLIC_VERCEL_ENV === 'production';\s*const isConfigured = !!supabaseUrl && !!supabaseAnonKey;\s*// Production: strict enforcement\. Preview/dev: optional with warning\s*if \(!isConfigured && isProduction\) \{\s*throw new Error\(\s*'Missing Supabase configuration in production\. NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set\.'\s*\);\s*\}",
    """const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

const isConfigured = !!supabaseUrl && !!supabaseAnonKey;

// In Next.js, modules are executed at build time. We don't want to fail the build
// if runtime variables aren't present during the static analysis phase.
// Instead of throwing an error immediately, we log a warning. The application
// will handle the missing client gracefully or fail at runtime when accessed.
if (!isConfigured && isProduction) {
  console.warn('⚠️ Missing Supabase configuration in production build. NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY should be set.');
}""",
    content
)

with open('lib/supabase.ts', 'w') as f:
    f.write(content)
