import re

with open('lib/me-status.ts', 'r') as f:
    content = f.read()

content = content.replace(
"""const ALLOWLIST_EMAILS = [
  'info@defrag.app',
  'chadowen93@gmail.com',
];""",
"""const ALLOWLIST_EMAILS = [
  'info@defrag.app',
  'chadowen93@gmail.com',
].map(e => e.toLowerCase());""")

content = content.replace(
"""    const userId = session.user.id;
    const userEmail = session.user.email || '';

    // Check allowlist for forced team unlock
    const isAllowlisted = ALLOWLIST_EMAILS.includes(userEmail.toLowerCase());""",
"""    const userId = session.user.id;
    const userEmail = (session.user.email || '').toLowerCase();

    // Check allowlist for forced team unlock
    const isAllowlisted = ALLOWLIST_EMAILS.includes(userEmail);""")

with open('lib/me-status.ts', 'w') as f:
    f.write(content)
