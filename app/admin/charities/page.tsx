import { supabaseAdmin } from '@/lib/supabase/admin'
import CharityManager from '@/app/admin/charities/CharityManager'

export const revalidate = 0

export default async function AdminCharitiesPage() {
  const { data: charities } = await supabaseAdmin
    .from('charities')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Charity Partners</h1>
      </div>
      <CharityManager initialCharities={charities || []} />
    </div>
  )
}
