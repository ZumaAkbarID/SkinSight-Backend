import { sendOtp } from '#helpers/generateOtp'
import { errorResponse, successResponse } from '#helpers/response'
import Otp from '#models/otp'
import env from '#start/env'
import { verifyOtpValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import limiter from '@adonisjs/limiter/services/main'
import { DateTime } from 'luxon'

export default class VerifiesController {
  async newOtp({ auth, request, response }: HttpContext) {
    const user = auth.user!

    if (env.get('BYPASS_OTP_VERIFICATION')) {
      return response.status(400).json(errorResponse('OTP verification is bypassed', 400))
    }

    try {
      /**
       * Create a limiter
       */
      const newOtp = limiter.use({
        requests: 3,
        duration: '1 min',
        blockDuration: '20 mins',
      })

      const key = `newOtp_${request.ip()}_${user.email}`

      if (user.emailVerifiedAt) {
        return response.status(400).json(errorResponse('Email already verified', 400))
      }

      await newOtp.penalize(key, async () => {
        await sendOtp({
          fullName: user.fullName,
          email: user.email,
        })
      })

      return response.status(200).json(successResponse(null, 'OTP sent successfully', 200))
    } catch (error) {
      console.error('Error sending OTP:', error)
      return response.status(500).json(errorResponse('Failed to send OTP', 500))
    }
  }

  async verifyOtp({ request, auth, response }: HttpContext) {
    const user = auth.user!
    const { otp } = await request.validateUsing(verifyOtpValidator)

    if (env.get('BYPASS_OTP_VERIFICATION')) {
      return response.status(400).json(errorResponse('OTP verification is bypassed', 400))
    }

    try {
      if (user.emailVerifiedAt) {
        return response.status(400).json(errorResponse('Email already verified', 400))
      }

      const isValidOtp = await Otp.query()
        .where('email', user.email)
        .where('otp', otp)
        .where('is_used', false)
        .first()

      if (!isValidOtp) {
        return response.status(400).json(errorResponse('Invalid OTP', 400))
      }

      if (isValidOtp.expiresAt < DateTime.now()) {
        return response.status(400).json(errorResponse('OTP expired', 400))
      }

      user.emailVerifiedAt = DateTime.now()

      await user.save()
      await isValidOtp.delete()

      return response.status(200).json(successResponse(null, 'Email verified successfully', 200))
    } catch (error) {
      console.error('Error verifying OTP:', error)
      return response.status(500).json(errorResponse('Failed to verify OTP', 500))
    }
  }
}
