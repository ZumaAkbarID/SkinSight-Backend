import { getEducationDetail } from '#helpers/get_education'
import { errorResponse, successResponse } from '#helpers/response'
import { getEducationDetailValidator } from '#validators/education'
import type { HttpContext } from '@adonisjs/core/http'
import redis from '@adonisjs/redis/services/main'
import crypto from 'node:crypto'

export default class EducationDetailsController {
  async handle({ request, response }: HttpContext) {
    const { articleLink } = await request.validateUsing(getEducationDetailValidator)
    const redisKey = `educations:detail:${crypto.createHash('md5').update(articleLink).digest('hex')}`

    try {
      const cachedData = await redis.get(redisKey)
      if (cachedData) {
        return response
          .status(200)
          .json(
            successResponse(JSON.parse(cachedData), 'Detail Educations fetched from cache', 200)
          )
      }

      const { status, message, api } = await getEducationDetail(articleLink)

      if (!status) {
        return response.status(500).json(errorResponse(message, 500))
      }

      await redis.setex(redisKey, 60 * 60, JSON.stringify(api)) // Cache for 1 hour

      return response
        .status(200)
        .json(successResponse(api, 'Detail Educations fetched successfully', 200))
    } catch (error) {
      console.error('Error fetching Detail Educations:', error)
      return response.status(500).json(errorResponse('Failed to fetch Detail Educations', 500))
    }
  }
}
