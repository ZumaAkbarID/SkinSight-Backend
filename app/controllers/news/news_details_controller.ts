import { getNewsDetail } from '#helpers/get_news'
import { errorResponse, successResponse } from '#helpers/response'
import { getNewsDetailValidator } from '#validators/news'
import type { HttpContext } from '@adonisjs/core/http'

export default class NewsDetailsController {
  async handle({ request, response }: HttpContext) {
    const { articleLink } = await request.validateUsing(getNewsDetailValidator)

    try {
      const { status, message, api } = await getNewsDetail(articleLink)

      if (!status) {
        return response.status(500).json(errorResponse(message, 500))
      }

      return response
        .status(200)
        .json(successResponse(api, 'Detail News fetched successfully', 200))
    } catch (error) {
      console.error('Error fetching Detail News:', error)
      return response.status(500).json(errorResponse('Failed to fetch Detail News', 500))
    }
  }
}
