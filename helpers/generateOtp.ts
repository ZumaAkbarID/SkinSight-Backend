import { DateTime } from 'luxon'

/**
 * Generate OTP dan waktu expired (10 menit dari sekarang)
 * @returns { otp: number, expiresAt: DateTime }
 */
export function generateOtp(length = 6) {
  const otp = Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1))

  const expiresAt = DateTime.now().plus({ minutes: 10 })

  return {
    otp,
    expiresAt,
  }
}
