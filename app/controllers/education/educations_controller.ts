import { getEducations } from '#helpers/get_education'
import { errorResponse, successResponse } from '#helpers/response'
import { getEducationValidator } from '#validators/education'
import type { HttpContext } from '@adonisjs/core/http'

export default class EducationsController {
  async handle({ request, response }: HttpContext) {
    const payload = await request.validateUsing(getEducationValidator)

    try {
      const { status, message, api } = await getEducations(
        payload.page,
        payload.prevLink,
        payload.nextLink
      )

      if (!status) {
        return response.status(500).json(errorResponse(message, 500))
      }

      return response.status(200).json(successResponse(api, 'Educations fetched successfully', 200))
    } catch (error) {
      console.error('Error fetching Educations:', error)
      return response.status(500).json(errorResponse('Failed to fetch Educations', 500))
    }
  }
}
