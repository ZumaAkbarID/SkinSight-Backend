import type { HttpContext } from '@adonisjs/core/http'
import { errorResponse, successResponse } from '#helpers/response'
import redis from '@adonisjs/redis/services/main'

export default class ProfilesController {
  async handle({ auth, response }: HttpContext) {
    try {
      const user = auth.user!
      const cacheKey = `user:profile:${user.id}`

      const cachedUser = await redis.get(cacheKey)
      if (cachedUser) {
        const parsed = JSON.parse(cachedUser)
        return response.json(successResponse(parsed, 'Profile data fetched (cached)'))
      }

      await user.load('userDetail')
      const userData = user.serialize()

      await redis.setex(cacheKey, 60 * 60, JSON.stringify(userData))

      return response.json(successResponse(userData, 'Profile data fetched'))
    } catch (error) {
      console.error(error)
      return response.status(500).json(errorResponse('Internal server error'))
    }
  }
}
