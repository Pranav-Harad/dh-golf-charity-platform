import { Resend } from 'resend'

// Initialize Resend with API Key (use mock if not provided for local dev)
export const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key')

export async function sendWinnerAlert(email: string, name: string, month: string, amount: number, type: 'approved' | 'paid') {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[Mock Email] Sent to ${email} - Type: ${type} - Amount: $${amount}`)
    return { success: true }
  }

  const subject = type === 'approved' 
    ? 'Congratulations! Your GolfVault winnings are approved!' 
    : 'Your GolfVault Winnings have been Sent!'

  const html = type === 'approved'
    ? `<p>Hi ${name},</p><p>Great news! Your proof for the <strong>${month}</strong> draw has been verified by our admins. Your prize of <strong>$${amount}</strong> is now cleared for payout.</p><p>You will receive another email once the funds have been dispatched.</p><br/>- The GolfVault Team`
    : `<p>Hi ${name},</p><p>Your prize of <strong>$${amount}</strong> from the <strong>${month}</strong> draw has officially been paid out! Please check your accounts.</p><p>Thank you for playing and supporting our charity partners.</p><br/>- The GolfVault Team`

  try {
    await resend.emails.send({
      from: 'GolfVault Winners <winners@golfvault.com>',
      to: email,
      subject,
      html
    })
    return { success: true }
  } catch (error) {
    console.error('Email failed to send:', error)
    return { error }
  }
}
