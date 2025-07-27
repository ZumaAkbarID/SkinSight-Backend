import { getNews } from '#helpers/get_news'
import { errorResponse, successResponse } from '#helpers/response'
import type { HttpContext } from '@adonisjs/core/http'
import redis from '@adonisjs/redis/services/main'

export default class NewsController {
  async handle({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const redisKey = `news:page:${page}`

    try {
      const cachedData = await redis.get(redisKey)
      if (cachedData) {
        return response
          .status(200)
          .json(successResponse(JSON.parse(cachedData), 'News fetched from cache', 200))
      }

      const { status, message, api } = await getNews(page)

      if (!status) {
        return response.status(500).json(errorResponse(message, 500))
      }

      await redis.setex(redisKey, 60 * 60, JSON.stringify(api)) // Cache for 1 hour

      return response.status(200).json(successResponse(api, 'News fetched successfully', 200))
    } catch (error) {
      console.error('Error fetching News:', error)
      return response.status(500).json(errorResponse('Failed to fetch News', 500))
    }
  }
}
