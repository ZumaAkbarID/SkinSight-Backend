import { sendOtp } from '#helpers/generateOtp'
import { errorResponse, successResponse, validationErrorResponse } from '#helpers/response'
import User from '#models/user'
import env from '#start/env'
import { registerUserValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'

export default class RegistersController {
  async handle({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(registerUserValidator)

      let isValidated: boolean = false

      // If email verification is bypassed, we can skip the email verification step
      if (!env.get('BYPASS_OTP_VERIFICATION')) {
        await sendOtp({
          fullName: payload.fullName,
          email: payload.email,
        })
      } else {
        isValidated = true
      }

      const user = await User.create({
        fullName: payload.fullName,
        email: payload.email,
        password: await hash.make(payload.password),
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
