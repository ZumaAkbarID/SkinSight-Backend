import { getProductRecommendations } from '#helpers/get_recommendations'
import { errorResponse, successResponse } from '#helpers/response'
import type { HttpContext } from '@adonisjs/core/http'
import redis from '@adonisjs/redis/services/main'

export default class RecommendationsController {
  async handle({ auth, response }: HttpContext) {
    const user = auth.user!
    await user.load('userDetail')

    if (!user.userDetail || !user.userDetail.skinType) {
      return response
        .status(400)
        .json(errorResponse('Please complete your assessment before using this feature', 400))
    }

    const cacheKey = `recommendations:${user.userDetail.skinType}`

    try {
      const cached = await redis.get(cacheKey)

      if (cached) {
        const parsed = JSON.parse(cached)
        return response
          .status(200)
          .json(successResponse(parsed, 'Recommendations fetched from cache', 200))
      }

      const { status, message, ml } = await getProductRecommendations(user.userDetail.skinType)

      if (!status) {
        return response.status(500).json(errorResponse(message, 500))
      }

      await redis.setex(cacheKey, 60 * 60, JSON.stringify(ml))

      return response
        .status(200)
        .json(successResponse(ml, 'Recommendations fetched successfully', 200))
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      return response.status(500).json(errorResponse('Failed to fetch recommendations', 500))
    }
  }
}
