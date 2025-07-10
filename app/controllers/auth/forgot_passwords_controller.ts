import { sendOtp } from '#helpers/generateOtp'
import { errorResponse, successResponse, validationErrorResponse } from '#helpers/response'
import Otp from '#models/otp'
import User from '#models/user'
import env from '#start/env'
import {
  forgotPassowrdValidator,
  otpForgotPasswordValidator,
  resetForgotPasswordValidator,
} from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import limiter from '@adonisjs/limiter/services/main'
import { DateTime } from 'luxon'

export default class ForgotPasswordsController {
  async generateOtp({ request, response }: HttpContext) {
    const { email } = await request.validateUsing(forgotPassowrdValidator)

    if (env.get('BYPASS_OTP_VERIFICATION')) {
      return response.status(400).json(errorResponse('OTP verification is bypassed', 400))
    }

    try {
      const user = await User.findBy('email', email)
      if (!user) {
        return response
          .status(404)
          .json(errorResponse(`Account with email ${email} not found!`, 404))
      }

      if (!user.isVerified) {
        return response.status(400).json(errorResponse('Please verify email first!', 400))
      }

      /**
       * Create a limiter
       */
      const newOtp = limiter.use({
        requests: 3,
        duration: '1 min',
        blockDuration: '20 mins',
      })

      const key = `otpForgot_${request.ip()}_${user.email}`

      await newOtp.penalize(key, async () => {
        await sendOtp(
          {
            fullName: user.fullName,
            email: user.email,
          },
          'forgot-password'
        )
      })

      return response.status(200).json(successResponse(null, 'OTP sent successfully', 200))
    } catch (error) {
      console.error('Error sending OTP:', error)
      return response.status(500).json(errorResponse('Failed to send OTP', 500))
    }
  }

  async verifyOtp({ request, response }: HttpContext) {
    const { email, otp } = await request.validateUsing(otpForgotPasswordValidator)

    if (env.get('BYPASS_OTP_VERIFICATION')) {
      return response.status(400).json(errorResponse('OTP verification is bypassed', 400))
    }

    try {
      const isValidOtp = await Otp.query()
        .where('email', email)
        .where('otp', otp)
        .where('is_used', false)
        .first()

      if (!isValidOtp) {
        return response.status(400).json(
          successResponse(
            {
              isValid: false,
              statusOtp: 'invalid',
              token: null,
            },
            'Invalid OTP',
            400
          )
        )
      }

      if (isValidOtp.expiresAt < DateTime.now()) {
        await isValidOtp.delete()

        return response.status(400).json(
          successResponse(
            {
              isValid: false,
              statusOtp: 'expired',
              token: null,
            },
            'Invalid OTP',
            400
          )
        )
      }

      return response.status(200).json(
        successResponse(
          {
            isValid: true,
            statusOtp: 'valid',
            token: isValidOtp.id,
          },
          'OTP verified successfully',
          200
        )
      )
    } catch (error) {
      console.error('Error verifying OTP:', error)
      return response.status(500).json(errorResponse('Failed to verify OTP', 500))
    }
  }

  /**
   *
   *
   * @param param { request, auth, response }: HttpContext
   * @param request - The HTTP request object containing the new password.
   * @param auth - The authentication context containing the authenticated user.
   * @param response - The HTTP response object to send the result.
   * @returns json
   */
  async resetPassword({ request, response }: HttpContext) {
    const { token, newPassword } = await request.validateUsing(resetForgotPasswordValidator)

    try {
      const validOtp = await Otp.find(token)
      if (!validOtp) {
        return response.status(400).json(
          validationErrorResponse(
            {
              token: 'Invalid OTP token',
            },
            'Invalid OTP token',
            400
          )
        )
      }

      const user = await User.findBy('email', validOtp.email)
      if (!user) {
        return response.status(404).json(errorResponse(`Account not found!`, 404))
      }

      user.password = await hash.make(newPassword)
      await user.save()
      await validOtp.delete()

      return response.status(200).json(successResponse(null, 'Password reset successfully', 200))
    } catch (error) {
      console.error('Error resetting password:', error)
      return response.status(500).json(errorResponse('Failed to reset password', 500))
    }
  }
}
