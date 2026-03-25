const fs = require('fs');
// Make sure to load environment variables or paste your key here temporarily to run this script safely in the future
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function setup() {
  try {
    const product = await stripe.products.create({
      name: 'GolfVault Premium Membership',
      description: 'Monthly entries into the charity draw and score tracking.',
    });

    const monthlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 1000,
      currency: 'usd',
      recurring: { interval: 'month' },
    });

    const yearlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 10000,
      currency: 'usd',
      recurring: { interval: 'year' },
    });

    const envPath = '.env.local';
    let env = fs.readFileSync(envPath, 'utf8');
    // Remove old ones if they exist
    env = env.replace(/NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=.*\n?/g, '');
    env = env.replace(/NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID=.*\n?/g, '');
    
    env += `\nNEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=${monthlyPrice.id}`;
    env += `\nNEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID=${yearlyPrice.id}\n`;
    fs.writeFileSync(envPath, env);
    
    console.log('SUCCESS: Wrote new Price IDs to .env.local');
    console.log(`Monthly: ${monthlyPrice.id}`);
    console.log(`Yearly: ${yearlyPrice.id}`);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

setup();
