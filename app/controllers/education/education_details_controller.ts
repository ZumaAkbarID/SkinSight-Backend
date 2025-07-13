import { errorResponse, successResponse } from '#helpers/response'
import Education from '#models/education'
import type { HttpContext } from '@adonisjs/core/http'

export default class EducationDetailsController {
  async handle({ request, response }: HttpContext) {
    const educationId = request.param('id')

    if (!educationId) {
      return response.status(400).send(errorResponse('Education ID is required', 400))
    }

    try {
      const educationDetail = await Education.query()
        .where('id', educationId)
        .preload('detail')
        .first()

      if (!educationDetail || !educationDetail.detail) {
        return response.status(404).send(errorResponse('Education detail not found', 404))
      }

      return response
        .status(200)
        .send(successResponse(educationDetail, 'Education detail fetched successfully', 200))
    } catch (error) {
      console.error('Error fetching education detail:', error)
      return response.status(500).send(errorResponse('Failed to fetch education detail', 500))
    }
  }
}
