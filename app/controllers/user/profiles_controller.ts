import type { HttpContext } from '@adonisjs/core/http'
import { errorResponse, successResponse } from '#helpers/response'

export default class ProfilesController {
  async handle({ auth, response }: HttpContext) {
    try {
      const user = auth.user!

      await user.load('userDetail')

      return response.json(successResponse(user, 'Profile data fetched'))
    } catch (error) {
      return response.status(500).json(errorResponse('Internal server error'))
    }
  }
}
