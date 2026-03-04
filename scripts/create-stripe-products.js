const Stripe = require('stripe');
const fs = require('fs');
const path = require('path');

// Read .env.local for the secret key
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const secretKey = envContent.match(/STRIPE_SECRET_KEY=(.+)/)?.[1]?.trim();

if (!secretKey) {
  console.error('STRIPE_SECRET_KEY not found in .env.local');
  process.exit(1);
}

const stripe = new Stripe(secretKey);

(async () => {
  try {
    // Create DEFRAG Solo product + price ($19/mo)
    const soloProduct = await stripe.products.create({
      name: 'DEFRAG Solo',
      description: 'Your personal user manual. Unlimited chat, daily audio briefs, and deep self-insight.',
    });
    const soloPrice = await stripe.prices.create({
      product: soloProduct.id,
      unit_amount: 1900,
      currency: 'usd',
      recurring: { interval: 'month' },
    });
    console.log('Solo Product:', soloProduct.id);
    console.log('Solo Price:', soloPrice.id);

    // Create DEFRAG Plus product + price ($33/mo)
    const plusProduct = await stripe.products.create({
      name: 'DEFRAG Plus',
      description: 'Everything in Solo plus unlimited relationship analyses, family dynamics, and multi-person insights.',
    });
    const plusPrice = await stripe.prices.create({
      product: plusProduct.id,
      unit_amount: 3300,
      currency: 'usd',
      recurring: { interval: 'month' },
    });
    console.log('Plus Product:', plusProduct.id);
    console.log('Plus Price:', plusPrice.id);

    // Output env vars to set
    console.log('\n--- Add to .env.local ---');
    console.log('STRIPE_SOLO_PRICE_ID=' + soloPrice.id);
    console.log('STRIPE_PLUS_PRICE_ID=' + plusPrice.id);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
