'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Trophy, Heart, Zap, Infinity as InfinityIcon } from 'lucide-react'

const MotionLink = motion.create(Link)

export default function Home() {
  return (
    <div className="relative w-full overflow-hidden bg-black selection:bg-emerald-500/30">
      {/* Abstract Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-20 pointer-events-none blur-[120px] rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600"></div>
      
      {/* Hero Section */}
      <section className="relative px-6 pt-32 pb-20 md:pt-48 md:pb-32 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800 text-zinc-300 text-sm mb-8 backdrop-blur"
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Next major draw in 14 days
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-6 leading-[1.1]"
        >
          Play the game. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 animate-gradient-x">
            Change the world.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12 font-medium leading-relaxed"
        >
          A premium subscription platform bridging the gap between digital competition and real-world charitable impact. Enter your scores, win jackpots, and give back instantly.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <MotionLink 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/subscribe" 
            className="px-8 py-4 bg-emerald-500 text-white rounded-full font-bold text-lg flex items-center justify-center gap-2 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] transition-all"
          >
            Join the Movement <ArrowRight className="w-5 h-5" />
          </MotionLink>
          <MotionLink 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/charities" 
            className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-white rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all"
          >
            Explore Causes
          </MotionLink>
        </motion.div>
      </section>

      {/* Visual Separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>

      {/* How it Works / Mechanics */}
      <section id="how-it-works" className="py-32 px-6 relative max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">The Mechanics</h2>
          <p className="text-zinc-400 text-lg">Three simple steps to maximizing your impact and potential winnings.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Zap className="w-8 h-8 text-cyan-400" />,
              title: "1. Subscribe & Track",
              desc: "Join an elite community. Log up to 5 of your latest performance scores (1-45). The system automatically maintains your most relevant data."
            },
            {
              icon: <Heart className="w-8 h-8 text-emerald-400" />,
              title: "2. Choose Your Impact",
              desc: "Select a partnered charity and designate your contribution percentage. Every time you win, a portion flows directly to your cause."
            },
            {
              icon: <Trophy className="w-8 h-8 text-yellow-400" />,
              title: "3. Monthly Draws",
              desc: "Our algorithmic engine runs monthly. Match 3, 4, or 5 numbers to claim a share of the dynamically calculated prize pool."
            }
          ].map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl hover:bg-zinc-800/40 transition-colors group"
            >
              <div className="w-16 h-16 rounded-2xl bg-zinc-800/80 flex items-center justify-center mb-6 border border-zinc-700/50 group-hover:scale-110 transition-transform duration-500">
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Charity Impact Banner */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-zinc-900/50 border-y border-zinc-800"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12 lg:gap-24">
          <div className="w-full md:w-1/2">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="aspect-square md:aspect-[4/3] rounded-3xl bg-zinc-800 border border-zinc-700 overflow-hidden relative"
            >
              {/* Abstract representation instead of actual image since we don't have local assets prepared */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center">
                 <InfinityIcon className="w-32 h-32 text-emerald-500/20" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-sm font-bold mb-4 uppercase tracking-widest">
                  Featured Partner
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">Global Education Fund</h3>
                <p className="text-zinc-300 line-clamp-2">Providing digital resources to underprivileged communities worldwide.</p>
              </div>
            </motion.div>
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Real impact, engineered into the core.</h2>
            <p className="text-xl text-zinc-400 mb-8 leading-relaxed">
              We&apos;ve built charity directly into the economic model. By mandating a minimum 10% contribution from winnings, we ensure that every game played leaves the world slightly better than before.
            </p>
            <ul className="space-y-4 font-medium text-zinc-300 mb-10">
              <li className="flex items-center gap-3"><Heart className="w-6 h-6 text-emerald-400" /> Transparent Donation Ledgers</li>
              <li className="flex items-center gap-3"><Heart className="w-6 h-6 text-emerald-400" /> Voluntarily Increase Your Share</li>
              <li className="flex items-center gap-3"><Heart className="w-6 h-6 text-emerald-400" /> Vetted 501(c)(3) Organizations</li>
            </ul>
            <Link href="/charities" className="inline-flex items-center gap-2 text-emerald-400 font-bold hover:text-emerald-300 transition-colors uppercase tracking-widest text-sm">
              View All Partners <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-6 text-center">
        <motion.div 
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
           className="max-w-3xl mx-auto"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter">Ready to Play?</h2>
          <p className="text-xl text-zinc-400 mb-12">
            Create your account today, enter your first set of scores, and prepare for the next monthly draw.
          </p>
          <Link href="/signup" className="inline-flex px-10 py-5 bg-white text-black rounded-full font-bold text-xl hover:bg-zinc-200 transition-colors shadow-xl">
            Create Your Account
          </Link>
        </motion.div>
      </section>

    </div>
  )
}
