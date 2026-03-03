const fs = require('fs');

const path = 'app/api/ai/chat/route.ts';
let content = fs.readFileSync(path, 'utf8');

const oldLimitError = `    // 2. Rate limit
    if (!checkRateLimit(user.id)) {
      logSecurityEvent({
        user_id: user.id,
        endpoint: '/api/ai/chat',
        event_type: 'RATE_LIMIT_EXCEEDED',
        reason: \`Exceeded \${RATE_LIMIT} requests per minute\`,
      });
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again in a minute.' },
        { status: 429 }
      );
    }`;

const newLimitError = `    // 2. Rate limit
    if (!checkRateLimit(user.id)) {
      console.warn(\`[DEFRAG_API] rate limit exceeded for user \${user.id}\`);
      logSecurityEvent({
        user_id: user.id,
        endpoint: '/api/ai/chat',
        event_type: 'RATE_LIMIT_EXCEEDED',
        reason: \`Exceeded \${RATE_LIMIT} requests per minute\`,
      });
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again in a minute.' },
        { status: 429 }
      );
    }`;

content = content.replace(oldLimitError, newLimitError);
fs.writeFileSync(path, content);
