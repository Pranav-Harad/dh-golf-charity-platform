import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { headers } from 'next/headers'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('Stripe-Signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Webhook Error:', error.message)
    return new Response(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const subscription = event.data.object as Stripe.Subscription
  const invoice = event.data.object as Stripe.Invoice

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        console.log('[WEBHOOK] checkout.session.completed received!');
        console.log('[WEBHOOK] Session metadata:', session?.metadata);
        
        if (session?.metadata?.user_id) {
          console.log('[WEBHOOK] Processing subscription for user:', session.metadata.user_id);
          const sub = await stripe.subscriptions.retrieve(session.subscription as string)
          
          const plan = session.amount_total === 5000 ? 'monthly' : 'yearly';
          console.log('[WEBHOOK] Calculated plan:', plan, 'Amount:', session.amount_total);
          
          const { error } = await supabaseAdmin
            .from('users')
            .update({
              subscription_status: 'active',
              subscription_plan: plan,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              subscription_renewal_date: new Date((sub as any).current_period_end * 1000).toISOString(),
            })
            .eq('id', session.metadata.user_id)
            
          if (error) {
            console.error('[WEBHOOK] Supabase Update Error:', error);
          } else {
            console.log('[WEBHOOK] Database successfully updated to active!');
          }
        } else {
          console.log('[WEBHOOK] No user_id found in metadata');
        }
        break
      case 'invoice.payment_succeeded':
        // Handle renewal
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((invoice as any).subscription) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const sub = await stripe.subscriptions.retrieve((invoice as any).subscription as string)
          const userId = sub.metadata.user_id
          if (userId) {
            await supabaseAdmin
              .from('users')
              .update({
                subscription_status: 'active',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                subscription_renewal_date: new Date((sub as any).current_period_end * 1000).toISOString(),
              })
              .eq('id', userId)
          }
        }
        break
      case 'invoice.payment_failed':
      case 'customer.subscription.deleted':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subId = event.type === 'invoice.payment_failed' ? (invoice as any).subscription : subscription.id
        if (subId) {
          const sub = await stripe.subscriptions.retrieve(subId as string)
          const userId = sub.metadata.user_id
          if (userId) {
            await supabaseAdmin
              .from('users')
              .update({
                subscription_status: event.type === 'customer.subscription.deleted' ? 'inactive' : 'lapsed',
              })
              .eq('id', userId)
          }
        }
        break
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('DB Update Error:', err)
    return new Response('Webhook handle error', { status: 500 })
  }

  return new Response(null, { status: 200 })
}
