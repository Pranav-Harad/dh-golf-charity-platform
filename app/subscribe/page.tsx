'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

const plans = [
  {
    name: 'Monthly Plan',
    price: 10,
    interval: 'month',
    priceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID,
    features: ['1 entry into monthly draw', 'Select your charity', 'Score tracker access'],
  },
  {
    name: 'Yearly Plan',
    price: 100,
    interval: 'year',
    priceId: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID,
    features: ['1 entry into every monthly draw', 'Select your charity', 'Score tracker access', 'Save $20 annually'],
    popular: true,
  },
]

export default function SubscribePage() {
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null)
  const router = useRouter()

  const onSubscribe = async (priceId: string | undefined) => {
    if (!priceId) {
      alert('Missing price ID. Ensure environment variables are set.')
      return
    }
    try {
      setLoadingPriceId(priceId)
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Subscription error', error)
      alert('An error occurred. Please try again.')
    } finally {
      setLoadingPriceId(null)
    }
  }

  return (
    <div className="min-h-screen bg-black/95 text-zinc-100 py-20 px-4 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Join the Club. Make an Impact.
        </h1>
        <p className="text-zinc-400 text-lg">
          Subscribe to participate in our monthly draws and support your favorite charities.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative p-8 rounded-3xl backdrop-blur-xl border ${
              plan.popular
                ? 'bg-zinc-900 border-emerald-500/50 shadow-2xl shadow-emerald-500/10'
                : 'bg-zinc-900/50 border-zinc-800'
            } flex flex-col`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full uppercase tracking-wide">
                Best Value
              </div>
            )}
            
            <h3 className="text-xl font-semibold mb-2 text-white">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-white">${plan.price}</span>
              <span className="text-zinc-400">/{plan.interval}</span>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-zinc-300">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => onSubscribe(plan.priceId)}
              disabled={loadingPriceId === plan.priceId}
              className={`w-full py-4 px-6 rounded-xl font-medium flex items-center justify-center transition-all ${
                plan.popular
                  ? 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-white'
              }`}
            >
              {loadingPriceId === plan.priceId ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Subscribe Now'
              )}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
