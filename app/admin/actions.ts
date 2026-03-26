'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { sendWinnerAlert } from '@/lib/email'

export async function verifyWinner(id: string, status: 'approved' | 'rejected') {
  const { error } = await supabaseAdmin
    .from('winners')
    .update({ verification_status: status })
    .eq('id', id)
  
  if (error) throw new Error(error.message)

  if (status === 'approved') {
    const { data: win } = await supabaseAdmin.from('winners').select('*, users(full_name, email), draws(month)').eq('id', id).single()
    if (win) {
      await sendWinnerAlert((win.users as any).email, (win.users as any).full_name, (win.draws as any).month, win.prize_amount, 'approved')
    }
  }

  revalidatePath('/admin/winners', 'page')
  revalidatePath('/admin', 'page')
}

export async function processPayout(id: string) {
  const { error } = await supabaseAdmin
    .from('winners')
    .update({ payout_status: 'paid' })
    .eq('id', id)

  if (error) throw new Error(error.message)

  const { data: win } = await supabaseAdmin.from('winners').select('*, users(full_name, email), draws(month)').eq('id', id).single()
  if (win) {
    await sendWinnerAlert((win.users as any).email, (win.users as any).full_name, (win.draws as any).month, win.prize_amount, 'paid')
  }

  revalidatePath('/admin/winners', 'page')
  revalidatePath('/admin', 'page')
}

export async function saveCharity(formData: FormData) {
  const id = formData.get('id') as string
  const data = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    category: formData.get('category') as string,
    image_url: formData.get('image_url') as string,
  }

  if (id) {
    await supabaseAdmin.from('charities').update(data).eq('id', id)
  } else {
    await supabaseAdmin.from('charities').insert(data)
  }
  revalidatePath('/admin/charities', 'page')
}

export async function deleteCharity(id: string) {
  await supabaseAdmin.from('charities').delete().eq('id', id)
  revalidatePath('/admin/charities', 'page')
}
