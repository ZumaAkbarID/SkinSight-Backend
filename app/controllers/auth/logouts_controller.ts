import type { HttpContext } from '@adonisjs/core/http'
import { errorResponse, successResponse } from '#helpers/response'

export default class LogoutsController {
  async handle({ auth, response }: HttpContext) {
    try {
      await auth.use('api').invalidateToken()

      return response.json(successResponse(null, 'Logout successful'))
    } catch (error) {
      return response.status(500).json(errorResponse('Failed to logout'))
    }
  }
}
