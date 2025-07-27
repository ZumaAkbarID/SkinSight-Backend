import { errorResponse, successResponse, validationErrorResponse } from '#helpers/response'
import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'
import redis from '@adonisjs/redis/services/main'

export default class ProductCategoriesController {
  async handle({ request, response }: HttpContext) {
    const { brand, type } = request.params()

    if (!brand || !type) {
      const errors: Record<string, string> = {}
      if (!brand) errors.brand = 'Brand is required'
      if (!type) errors.type = 'Type is required'

      return response.status(400).json(validationErrorResponse(errors, 'Validation failed', 422))
    }

    const normalizedBrand = brand.replace(/-/g, ' ').toLowerCase()
    const normalizedType = type.replace(/-/g, ' ').toLowerCase()
    const cacheKey = `products:${normalizedBrand}:${normalizedType}`

    try {
      const cached = await redis.get(cacheKey)
      if (cached) {
        const parsed = JSON.parse(cached)
        return response
          .status(200)
          .json(successResponse(parsed, 'Products fetched from cache', 200))
      }

      const result = await Product.query()
        .where('brand', normalizedBrand)
        .where('type', normalizedType)

      const serialized = result.map((item) => item.serialize())

      await redis.setex(cacheKey, 60 * 60, JSON.stringify(serialized))

      return response
        .status(200)
        .json(successResponse(result, 'Products fetched successfully', 200))
    } catch (error) {
      console.error('Error fetching products for brand:', error)
      return response.status(500).json(errorResponse('Failed to fetch products for brand', 500))
    }
  }
}
