import { Resend } from 'resend';

// Only init if key exists to prevent build failures
// resend key might not be available during standard build
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = 'info@defrag.app';

export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}) {
  if (!resend) {
    console.error('RESEND_API_KEY is missing. Email not sent.');
    return { error: 'RESEND_API_KEY missing' };
  }

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>?/gm, ''), // Basic HTML to text fallback
      replyTo,
    });

    if (data.error) {
      console.error('Failed to send email:', data.error);
      return { error: data.error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email error:', error);
    return { error: 'Unknown email error' };
  }
}
