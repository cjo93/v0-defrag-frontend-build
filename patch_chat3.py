import re

with open('app/chat/page.tsx', 'r') as f:
    content = f.read()

# Add getSession import if missing
if 'getSession' not in content[:500]:
    content = content.replace("import { Suspense, useState, useRef, useEffect } from 'react';",
                              "import { Suspense, useState, useRef, useEffect } from 'react';\nimport { getSession } from '@/lib/supabase';")

# Fix getSensitivityLabel
content = content.replace(
    "const getSensitivityLabel = (sensitivity: 'low' | 'medium' | 'high') => {\n      switch(signal) {",
    "const getSensitivityLabel = (sensitivity: 'low' | 'medium' | 'high') => {\n      switch(sensitivity) {"
)

# Fix getSensitivityColor
content = content.replace(
    "const getSensitivityColor = (sensitivity: 'low' | 'medium' | 'high') => {\n      switch(signal) {",
    "const getSensitivityColor = (sensitivity: 'low' | 'medium' | 'high') => {\n      switch(sensitivity) {"
)

with open('app/chat/page.tsx', 'w') as f:
    f.write(content)
