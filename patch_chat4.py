with open('app/chat/page.tsx', 'r') as f:
    content = f.read()

if 'import { getSession }' not in content:
    content = content.replace("import { useState, useEffect, useRef, Suspense } from 'react';", "import { useState, useEffect, useRef, Suspense } from 'react';\nimport { getSession } from '@/lib/supabase';")

with open('app/chat/page.tsx', 'w') as f:
    f.write(content)
