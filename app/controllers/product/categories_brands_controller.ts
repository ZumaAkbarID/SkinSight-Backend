import type { HttpContext } from '@adonisjs/core/http'
import { errorResponse, successResponse, validationErrorResponse } from '#helpers/response'
import db from '@adonisjs/lucid/services/db'
import redis from '@adonisjs/redis/services/main'

export default class CategoriesBrandsController {
  async handle({ request, response }: HttpContext) {
    const brand = request.param('brand')

    if (!brand) {
      return response
        .status(400)
        .json(validationErrorResponse({ brand: 'Brand is required' }, 'Validation failed', 422))
    }

    const normalizedBrand = brand.replace(/-/g, ' ')
    const cacheKey = `brand:categories:${normalizedBrand.toLowerCase()}`

    try {
      const cached = await redis.get(cacheKey)
      if (cached) {
        const parsed = JSON.parse(cached)
        return response
          .status(200)
          .json(successResponse(parsed, 'Categories fetched from cache', 200))
      }

      const result = await db
        .from('products')
        .where('brand', normalizedBrand)
        .groupBy('type')
        .select('type')
        .count('* as productCount')

      await redis.setex(cacheKey, 60 * 60, JSON.stringify(result))

      return response
        .status(200)
        .json(successResponse(result, 'Categories fetched successfully', 200))
    } catch (error) {
      console.error('Error fetching categories for brand:', error)
      return response.status(500).json(errorResponse('Failed to fetch categories for brand', 500))
    }
  }
}
