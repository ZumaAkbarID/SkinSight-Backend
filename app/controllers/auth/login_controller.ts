import { loginUserValidator } from '#validators/auth'
import { errorResponse, successResponse, validationErrorResponse } from '#helpers/response'
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import env from '#start/env'
import hash from '@adonisjs/core/services/hash'
import db from '@adonisjs/lucid/services/db'

export default class LoginController {
  async handle({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(loginUserValidator)
      const { email, password } = payload

      const user = await User.query().where('email', email).preload('userDetail').first()
      if (!user) {
        return response.status(404).json(errorResponse('Email or password not found'))
      }

      const isPasswordValid = await hash.verify(user.password, password)
      if (!isPasswordValid) {
        return response.status(401).json(errorResponse('Email or password not found'))
      }

      await db.from('auth_access_tokens').where('tokenable_id', user.id).delete()

      const token = await User.accessTokens.create(user)

      return response.status(200).json(
        successResponse(
          {
            user,
            token: {
              type: 'Bearer',
              token: token.value!.release(),
              expiresAt: token.expiresAt,
            },
          },
          'Login successful'
        )
      )
    } catch (error) {
      if (error.messages) {
        return response
          .status(422)
          .json(validationErrorResponse(error.messages, 'Validation error', 422))
      }

      if (env.get('NODE_ENV') === 'development') {
        console.error('Login error:', error)
      }

      return response.status(500).json(errorResponse('Internal server error'))
    }
  }
}
