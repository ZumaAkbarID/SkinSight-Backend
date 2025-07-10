import Otp from '#models/otp'
import env from '#start/env'
import { DateTime } from 'luxon'
import { TransactionalEmailsApi, SendSmtpEmail } from '@getbrevo/brevo'

/**
 * Generate OTP dan waktu expired (10 menit dari sekarang)
 * @returns { otp: number, expiresAt: DateTime }
 */
export function generateOtp(length = 5) {
  const otp = Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1))

  const expiresAt = DateTime.now().plus({ minutes: 10 })

  return {
    otp,
    expiresAt,
  }
}

export async function sendOtp(
  payload: { email: string; fullName: string },
  purpose: 'register' | 'forgot-password' = 'register'
) {
  const { otp, expiresAt } = generateOtp()

  await Otp.query().where('email', payload.email).delete()

  await Otp.create({
    email: payload.email,
    otp: otp.toString(),
    expiresAt: expiresAt,
    isUsed: false,
  })

  let emailAPI = new TransactionalEmailsApi()
  ;(emailAPI as any).authentications.apiKey.apiKey = env.get('BREVO_API_KEY')

  let message = new SendSmtpEmail()
  message.subject = `OTP Verification - SkinSight (${purpose === 'register' ? 'Registration' : 'Forgot Password'})`
  message.htmlContent = `
            <h1>Hi ${payload.fullName},</h1>
            <p>Thank you for ${purpose === 'register' ? 'registering with' : 'requesting a password reset for'} SkinSight. Please use the following OTP to ${purpose === 'register' ? 'verify your email' : 'reset your password'}:</p>
            <p><strong>${otp}</strong></p>
            <p>This OTP is valid until ${expiresAt.toFormat('dd LLL yyyy HH:mm:ss')}.</p>
            <p>If you did not request this, please ignore this email.</p>
            </br>
            <p>Best regards,</p>
            <p>SkinSight Team</p>
            `
  message.sender = { name: env.get('MAIL_FROM_NAME'), email: env.get('MAIL_FROM_EMAIL') }
  message.to = [{ email: payload.email, name: payload.fullName }]

  await emailAPI
    .sendTransacEmail(message)
    .then((res) => {
      if (env.get('NODE_ENV') === 'development') console.log(JSON.stringify(res.body))
    })
    .catch((err) => {
      console.error('Error sending email:', err.body)
      throw new Error('Failed to send OTP email')
    })

  // await mail.use('smtp').send((message) => {
  //   message
  //     .subject('OTP Verification - SkinSight')
  //     .to(payload.email, payload.fullName)
  //     .html(
  //       `
  //           <h1>Hi ${payload.fullName},</h1>
  //           <p>Thank you for registering with SkinSight. Please use the following OTP to verify your email:</p>
  //           <p><strong>${otp}</strong></p>
  //           <p>This OTP is valid until ${expiresAt.toFormat('dd LLL yyyy HH:mm:ss')}.</p>
  //           <p>If you did not request this, please ignore this email.</p>
  //           <p>Best regards,</p>
  //           <p>SkinSight Team</p>
  //           `
  //     )
  //     .from(env.get('MAIL_FROM_EMAIL'), env.get('MAIL_FROM_NAME'))
  // })
}
