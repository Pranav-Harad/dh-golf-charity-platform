import { supabaseAdmin } from '@/lib/supabase/admin'
import UserList from './UserList'

export const revalidate = 0

export default async function AdminUsersPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: users } = await supabaseAdmin
    .from('users')
    .select('*, charities(name)')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .order('created_at', { ascending: false }) as any

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
        <p className="text-zinc-400">View and manage all registered users and their subscriptions.</p>
      </div>

      <UserList initialUsers={users || []} />
    </div>
  )
}
