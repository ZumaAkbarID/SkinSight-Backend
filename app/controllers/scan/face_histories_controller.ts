import { errorResponse, successResponse } from '#helpers/response'
import type { HttpContext } from '@adonisjs/core/http'
import redis from '@adonisjs/redis/services/main'

export default class FaceHistoriesController {
  async handle({ auth, response }: HttpContext) {
    const user = auth.user!
    const cacheKey = `user:face_history:${user.id}`

    try {
      const cachedData = await redis.get(cacheKey)
      if (cachedData) {
        const parsed = JSON.parse(cachedData)
        return response
          .status(200)
          .json(successResponse(parsed, 'Face histories retrieved from cache', 200))
      }

      const faceHistories = await user.related('faceScans').query().orderBy('createdAt', 'desc')

      const serialized = faceHistories.map((item) => item.serialize())

      await redis.setex(cacheKey, 60 * 60, JSON.stringify(serialized))

      return response
        .status(200)
        .json(successResponse(serialized, 'Face histories retrieved successfully', 200))
    } catch (error) {
      console.error('Error retrieving face histories:', error)
      return response.status(500).json(errorResponse('Internal server error', 500))
    }
  }
}
