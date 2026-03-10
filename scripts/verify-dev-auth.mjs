#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

const required = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
const missing = required.filter((name) => !process.env[name]);

if (missing.length > 0) {
  console.log(`[verify-dev-auth] skipped (missing env: ${missing.join(', ')})`);
  process.exit(0);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const users = [
  { email: 'dev1@defrag.app', password: 'DefragDev#2026' },
  { email: 'dev2@defrag.app', password: 'DefragDev#2026' },
  { email: 'dev3@defrag.app', password: 'DefragDev#2026' },
  { email: 'dev4@defrag.app', password: 'DefragDev#2026' },
];

for (const user of users) {
  const { data, error } = await supabase.auth.admin.createUser({
    email: user.email,
    password: user.password,
    email_confirm: true,
  });

  if (error && !error.message.toLowerCase().includes('already')) {
    console.error(`[verify-dev-auth] failed for ${user.email}:`, error.message);
    process.exit(1);
  }

  console.log(`[verify-dev-auth] ok: ${user.email} (${data?.user?.id || 'existing'})`);
}

console.log('[verify-dev-auth] completed');
