import type { HttpContext } from '@adonisjs/core/http'
import { errorResponse, successResponse, validationErrorResponse } from '#helpers/response'
import db from '@adonisjs/lucid/services/db'

export default class CategoriesBrandsController {
  async handle({ request, response }: HttpContext) {
    const brand = request.input('brand')

    if (!brand) {
      return response
        .status(400)
        .json(validationErrorResponse({ brand: 'Brand is required' }, 'Validation failed', 422))
    }

    try {
      const result = await db
        .from('products')
        .where('brand', brand)
        .groupBy('type')
        .select('type')
        .count('* as productCount')

      return response
        .status(200)
        .json(successResponse(result, 'Categories fetched successfully', 200))
    } catch (error) {
      console.error('Error fetching categories for brand:', error)
      return response.status(500).json(errorResponse('Failed to fetch categories for brand', 500))
    }
  }
}
