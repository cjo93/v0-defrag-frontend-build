const fs = require('fs');

const path = 'app/api/webhooks/stripe/route.ts';
let content = fs.readFileSync(path, 'utf8');

// Ensure all required events exist and update logging
const newBlock = `  console.log(\`[DEFRAG_API] stripe webhook received: \${event.type}\`);

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const sessionId = session.metadata?.supabase_session_id;

      console.log('[DEFRAG_API] checkout completed', { sessionId });

      if (sessionId) {
        // Update status to unlocked
        const { error } = await supabase
          .from('staged_sessions')
          .update({ status: 'unlocked' })
          .eq('session_id', sessionId);

        if (error) {
          console.error('[DEFRAG_API] Failed to unlock session:', error);
        } else {
          console.log(\`[DEFRAG_API] Session \${sessionId} unlocked via Stripe webhook.\`);
        }
      }
      break;
    }
    case 'invoice.payment_succeeded': {
      console.log('[DEFRAG_API] invoice payment succeeded');
      // Sync subscription state logic
      break;
    }
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      console.log(\`[DEFRAG_API] subscription event: \${event.type}\`);
      // Sync subscription state logic
      break;
    }
    default:
      console.log(\`[DEFRAG_API] Unhandled event type \${event.type}\`);
  }`;

content = content.replace(/if \(event\.type === 'checkout\.session\.completed'\) \{[\s\S]*\}\n\n  return NextResponse\.json/m, newBlock + '\n\n  return NextResponse.json');

content = content.replace(/console\.warn\(\`Webhook Error: \$\{err\.message\}\`\)/, "console.error(`[DEFRAG_API] Webhook signature verification failed: ${err.message}`)");

fs.writeFileSync(path, content);
