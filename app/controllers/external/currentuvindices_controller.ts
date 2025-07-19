import { getCurrentUVIndex } from '#helpers/current_uv_index'
import { errorResponse, successResponse, validationErrorResponse } from '#helpers/response'
import type { HttpContext } from '@adonisjs/core/http'

export default class CurrentuvindicesController {
  async handle({ request, response }: HttpContext) {
    const long = request.input('longitude')
    const lat = request.input('latitude')

    if (!long || !lat) {
      let errors: {
        longitude: string | null
        latitude: string | null
      } = {
        longitude: null,
        latitude: null,
      }

      if (!long) {
        errors.longitude = 'Longitude is required'
      }
      if (!lat) {
        errors.latitude = 'Latitude is required'
      }

      return response.status(400).json(validationErrorResponse(errors))
    }

    try {
      const { status, message, api } = await getCurrentUVIndex(long, lat)

      if (!status) {
        return response.status(500).json(errorResponse(message, 500))
      }

      return response.status(200).json(successResponse(api, 'UV Index fetched successfully', 200))
    } catch (error) {
      console.error('Error fetching UV Index:', error)
      return response.status(500).json(errorResponse('Failed to fetch UV Index', 500))
    }
  }
}
