import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

// Simple rate limit tracking
const rateLimit = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 3; // 3 requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimit.get(ip);

  if (!record) {
    rateLimit.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimit.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (record.count >= MAX_REQUESTS) {
    return true;
  }

  record.count += 1;
  return false;
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const { name, email, message, _honeypot } = await req.json();

    if (_honeypot) {
       // Basic bot protection: Return success for honeypot
       return NextResponse.json({ success: true });
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Basic bot protection: Check if message contains common spam keywords or links
    const spamKeywords = ['viagra', 'seo', 'crypto', 'bitcoin'];
    if (spamKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
        // Return 200 to trick the bot
        return NextResponse.json({ success: true });
    }

    const html = `
      <h2>New message from defrag.app</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      <p><strong>IP:</strong> ${ip}</p>
      <br/>
      <h3>Message:</h3>
      <p style="white-space: pre-wrap;">${message}</p>
    `;

    const text = `
Name: ${name}
Email: ${email}
Timestamp: ${new Date().toISOString()}
IP: ${ip}

Message:
${message}
    `;

    const result = await sendEmail({
      to: 'chadowen93@gmail.com',
      replyTo: email,
      subject: `New message from defrag.app: ${name}`,
      html,
      text,
    });

    if (result?.error) {
      console.error('Email error:', result.error);
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
