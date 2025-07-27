import { getCurrentUVIndex } from '#helpers/current_uv_index'
import { errorResponse, successResponse, validationErrorResponse } from '#helpers/response'
import type { HttpContext } from '@adonisjs/core/http'
import redis from '@adonisjs/redis/services/main'

export default class CurrentuvindicesController {
  async handle({ request, response }: HttpContext) {
    const long = request.input('longitude')
    const lat = request.input('latitude')

    if (!long || !lat) {
      const errors = {
        longitude: long ? null : 'Longitude is required',
        latitude: lat ? null : 'Latitude is required',
      }

      return response.status(400).json(validationErrorResponse(errors))
    }

    const cacheKey = `uv-index:${lat}:${long}`

    try {
      const cachedData = await redis.get(cacheKey)

      if (cachedData) {
        const parsedData = JSON.parse(cachedData)
        return response.status(200).json(successResponse(parsedData, 'UV Index (cached)', 200))
      }

      const { status, message, api } = await getCurrentUVIndex(long, lat)

      if (!status) {
        return response.status(500).json(errorResponse(message, 500))
      }

      await redis.setex(cacheKey, 60 * 60, JSON.stringify(api))

      return response.status(200).json(successResponse(api, 'UV Index fetched successfully', 200))
    } catch (error) {
      console.error('Error fetching UV Index:', error)
      return response.status(500).json(errorResponse('Failed to fetch UV Index', 500))
    }
  }
}
