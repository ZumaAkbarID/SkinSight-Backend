import { errorResponse, successResponse } from '#helpers/response'
import Education from '#models/education'
import type { HttpContext } from '@adonisjs/core/http'

export default class EducationsController {
  async handle({ request, response }: HttpContext) {
    try {
      const search = request.input('search') // opsional

      const page = request.input('page', 1)
      const limit = request.input('limit', 4)

      let query = Education.query()

      if (search) {
        query = query.where((builder) => {
          builder.where('title', 'like', `%${search}%`).orWhere('category', 'like', `%${search}%`)
        })
      }

      const educations = (await query.paginate(page, limit)).toJSON()

      return response
        .status(200)
        .json(successResponse(educations, 'Educations fetched successfully', 200))
    } catch (error) {
      console.error('Error fetching all educations:', error)
      return response.status(500).json(errorResponse('Failed to fetch educations', 500))
    }
  }
}
