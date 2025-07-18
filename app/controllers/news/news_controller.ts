import { getNews } from '#helpers/get_news'
import { errorResponse, successResponse } from '#helpers/response'
import type { HttpContext } from '@adonisjs/core/http'

export default class NewsController {
  async handle({ request, response }: HttpContext) {
    const page = request.input('page', 1)

    try {
      const { status, message, api } = await getNews(page)

      if (!status) {
        return response.status(500).json(errorResponse(message, 500))
      }

      return response.status(200).json(successResponse(api, 'News fetched successfully', 200))
    } catch (error) {
      console.error('Error fetching News:', error)
      return response.status(500).json(errorResponse('Failed to fetch News', 500))
    }
  }
}
