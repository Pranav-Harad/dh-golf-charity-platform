import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiVersion: '2023-10-16' as any,
  appInfo: {
    name: 'GolfVault Charity',
    version: '0.1.0',
  },
})
