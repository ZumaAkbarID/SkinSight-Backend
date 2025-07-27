import { loginUserValidator } from '#validators/auth'
import { errorResponse, successResponse, validationErrorResponse } from '#helpers/response'
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import limiter from '@adonisjs/limiter/services/main'

export default class LoginController {
  async handle({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(loginUserValidator)
      const { email, password } = payload

      /**
       * Create a limiter
       */
      const loginLimiter = limiter.use({
        requests: 5,
        duration: '1 min',
        blockDuration: '20 mins',
      })

      /**
       * Use IP address + email combination. This ensures if an
       * attacker is misusing emails; we do not block actual
       * users from logging in and only penalize the attacker
       * IP address.
       */
      const key = `login_${request.ip()}_${email}`

      /**
       * Wrap User.verifyCredentials inside the "penalize" method, so
       * that we consume one request for every invalid credentials
       * error
       */
      const [error, result] = await loginLimiter.penalize(key, async () => {
        const user = await User.query().where('email', email).preload('userDetail').first()
        if (!user) {
          throw new Error('Invalid credentials')
        }

        if (!user.password) {
          throw new Error('Login with google')
        }

        const isPasswordValid = hash.verify(user.password, password)
        if (!isPasswordValid) {
          throw new Error('Invalid credentials')
        }

        const token = await User.accessTokens.create(user)

        return {
          user,
          token,
        }
      })

      if (error) {
        return response
          .status(429)
          .json(errorResponse('Too many login attempts. Please try again later', 429))
      }

      // await db.from('auth_access_tokens').where('tokenable_id', user.id).delete()

      return response.status(200).json(
        successResponse(
          {
            user: result.user,
            token: {
              type: 'Bearer',
              token: result.token.value!.release(),
              expiresAt: result.token.expiresAt,
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

      if (error.message === 'Invalid credentials') {
        return response.status(401).json(errorResponse('Invalid email or password', 401))
      } else if (error.message === 'Login with google') {
        return response
          .status(400)
          .json(
            errorResponse(
              'This account is registered with Google. Please login with Google. Then set a password.',
              400
            )
          )
      }

      console.error('Login error:', error)

      return response.status(500).json(errorResponse('Internal server error'))
    }
  }
}
