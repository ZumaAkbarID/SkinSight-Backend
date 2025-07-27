import { getEducations } from '#helpers/get_education'
import { errorResponse, successResponse } from '#helpers/response'
import { getEducationValidator } from '#validators/education'
import type { HttpContext } from '@adonisjs/core/http'
import redis from '@adonisjs/redis/services/main'

export default class EducationsController {
  async handle({ request, response }: HttpContext) {
    const payload = await request.validateUsing(getEducationValidator)
    const cacheKey = `educations:page=${payload.page || 1}:prev=${payload.prevLink || 'null'}:next=${payload.nextLink || 'null'}`

    try {
      const cached = await redis.get(cacheKey)
      if (cached) {
        const parsed = JSON.parse(cached)
        return response
          .status(200)
          .json(successResponse(parsed, 'Educations fetched from cache', 200))
      }

      const { status, message, api } = await getEducations(
        payload.page,
        payload.prevLink,
        payload.nextLink
      )

      if (!status) {
        return response.status(500).json(errorResponse(message, 500))
      }

      await redis.setex(cacheKey, 60 * 60, JSON.stringify(api)) // Cache for 1 hour

      return response.status(200).json(successResponse(api, 'Educations fetched successfully', 200))
    } catch (error) {
      console.error('Error fetching Educations:', error)
      return response.status(500).json(errorResponse('Failed to fetch Educations', 500))
    }
  }
}
