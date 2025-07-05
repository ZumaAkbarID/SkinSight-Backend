import { generateOtp } from '#helpers/generateOtp'
import { errorResponse, successResponse, validationErrorResponse } from '#helpers/response'
import Otp from '#models/otp'
import User from '#models/user'
import env from '#start/env'
import { registerUserValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import mail from '@adonisjs/mail/services/main'
import { DateTime } from 'luxon'

export default class RegistersController {
  async handle({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(registerUserValidator)

      let isValidated: boolean = false

      // If email verification is bypassed, we can skip the email verification step
      if (!env.get('BYPASS_OTP_VERIFICATION')) {
        const { otp, expiresAt } = generateOtp()

        await Otp.create({
          email: payload.email,
          otp: otp.toString(),
          expiresAt: expiresAt,
          isUsed: false,
        })

        await mail.use('brevo').send((message) => {
          message.to(payload.email).from(env.get('MAIL_FROM_EMAIL')).subject('OTP Verification')
            .html(`
            <h1>Hi ${payload.fullName},</h1>
            <p>Thank you for registering with SkinSight. Please use the following OTP to verify your email:</p>
            <p><strong>${otp}</strong></p>
            <p>This OTP is valid until ${expiresAt.toFormat('dd LLL yyyy HH:mm:ss')}.</p>
            <p>If you did not request this, please ignore this email.</p>
            <p>Best regards,</p>
            <p>SkinSight Team</p>
            `)
        })
      } else {
        isValidated = true
      }

      const newPassword = await hash.make(payload.password)
      if (env.get('NODE_ENV') === 'development') {
        console.log('New password hash:', newPassword)
      }

      const user = await User.create({
        fullName: payload.fullName,
        email: payload.email,
        password: newPassword,
        emailVerifiedAt: isValidated ? DateTime.now() : null,
      })

      const token = await User.accessTokens.create(user)

      return response.status(201).json(
        successResponse(
          {
            user,
            token: {
              type: 'Bearer',
              token: token.value!.release(),
              expiresAt: token.expiresAt,
            },
          },
          'User registered successfully',
          201
        )
      )
    } catch (error) {
      if (error.messages) {
        return response
          .status(422)
          .json(validationErrorResponse(error.messages, 'Validation error', 422))
      }

      if (env.get('NODE_ENV') === 'development') {
        console.error('Registration error:', error)
      }

      return response.status(500).json(errorResponse('Internal server error'))
    }
  }
}
