'use client'

import { useState } from 'react'
import { signup } from '@/app/login/actions'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(formData: FormData) {
    setPending(true)
    setError(null)
    setSuccess(null)
    const result = await signup(formData)
    if (result?.error) {
      setError(result.error)
      setPending(false)
    } else if (result?.success) {
      setSuccess(result.message)
      setPending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/95 text-zinc-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-zinc-400 mt-2">Join the GolfVault Charity</p>
        </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-red-400 text-sm bg-red-400/10 p-4 rounded-lg border border-red-400/20"
            >
              {error}
            </motion.div>
          )}

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-emerald-400 text-center bg-emerald-400/10 p-6 rounded-xl border border-emerald-400/20"
            >
              <h3 className="font-bold text-lg mb-2">Check Your Email</h3>
              <p className="text-zinc-300 text-sm leading-relaxed">{success}</p>
              <Link 
                href="/login" 
                className="inline-block mt-4 text-emerald-400 text-xs hover:underline font-medium"
              >
                Return to Login
              </Link>
            </motion.div>
          ) : (
            <>
              <form action={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    required
                    className="w-full px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-white placeholder-zinc-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-white placeholder-zinc-500"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    className="w-full px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-white placeholder-zinc-500"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={pending}
                  className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                >
                  {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                </button>
              </form>

              <p className="mt-6 text-center text-zinc-400 text-sm">
                Already have an account?{' '}
                <Link href="/login" className="text-emerald-400 hover:text-emerald-300 hover:underline transition-colors">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </motion.div>
    </div>
  )
}
