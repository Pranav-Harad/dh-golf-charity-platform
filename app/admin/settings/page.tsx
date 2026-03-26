import { Settings, Shield, DollarSign, Heart } from 'lucide-react'

export default function AdminSettingsPage() {
  const settings = [
    {
      group: 'Platform Economics',
      items: [
        {
          name: 'Minimum Donation Percentage',
          value: '10%',
          description: 'The fixed portion of winnings automatically designated for charity.',
          icon: <Heart className="w-5 h-5 text-red-400" />
        },
        {
          name: 'Monthly Subscription Price',
          value: '$10.00',
          description: 'Standard monthly entry fee.',
          icon: <DollarSign className="w-5 h-5 text-emerald-400" />
        },
        {
          name: 'Yearly Subscription Price',
          value: '$100.00',
          description: 'Discounted yearly entry fee.',
          icon: <DollarSign className="w-5 h-5 text-emerald-400" />
        }
      ]
    },
    {
      group: 'Security & Access',
      items: [
        {
          name: 'Admin Whitelist',
          value: process.env.ADMIN_EMAILS ? 'Configured' : 'Default Only',
          description: 'Emails authorized to access this portal.',
          icon: <Shield className="w-5 h-5 text-blue-400" />
        }
      ]
    }
  ]

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Platform Settings</h1>
        <p className="text-zinc-400">View and configure global platform parameters and rules.</p>
      </div>

      <div className="space-y-8">
        {settings.map((group) => (
          <div key={group.group} className="space-y-4">
            <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{group.group}</h2>
            <div className="grid gap-4">
              {group.items.map((item) => (
                <div key={item.name} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-zinc-800 rounded-xl">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{item.name}</h3>
                      <p className="text-zinc-500 text-sm mt-1">{item.description}</p>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-white bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-2xl">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <Settings className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Configuration Note</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Platform settings are currently defined through environment variables and code constants for maximum security. 
              Future updates will allow dynamic database-driven updates directly from this interface.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
