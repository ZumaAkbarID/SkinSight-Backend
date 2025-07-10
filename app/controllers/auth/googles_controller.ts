import { OAuth2Client } from 'google-auth-library'
import { successResponse, errorResponse } from '#helpers/response'
import type { HttpContext } from '@adonisjs/core/http'
import { oauth2GoogleValidator } from '#validators/auth'
import User from '#models/user'
import { DateTime } from 'luxon'

const client = new OAuth2Client() // default, bisa isi clientId kalau mau ketat

export default class GooglesController {
  async handle({ request, response }: HttpContext) {
    const { idToken } = await request.validateUsing(oauth2GoogleValidator)

    if (!idToken) {
      return response.status(400).json(errorResponse('ID Token is required', 400))
    }

    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: '<GOOGLE_CLIENT_ID>', // opsional tapi disarankan
      })

      const payload = ticket.getPayload()
      if (!payload) {
        return response.status(400).json(errorResponse('Invalid Google token', 400))
      }

      const { email, name, picture } = payload

      if (!email) {
        return response.status(400).json(errorResponse('Email not found in token', 400))
      }

      // Cari atau buat user
      const user = await User.firstOrCreate(
        { email },
        {
          fullName: name,
          emailVerifiedAt: DateTime.now(),
          profilePicture: picture,
        }
      )

      // Buat access token
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
          'Login with Google successful'
        )
      )
    } catch (error) {
      console.error('Google OAuth error:', error)
      return response.status(401).json(errorResponse('Failed to verify Google token', 401))
    }
  }
}
