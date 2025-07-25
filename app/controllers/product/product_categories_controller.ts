import { errorResponse, successResponse, validationErrorResponse } from '#helpers/response'
import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProductCategoriesController {
  async handle({ request, response }: HttpContext) {
    const { brand, type } = request.params()

    if (!brand || !type) {
      const errors: Record<string, string> = {}
      if (!brand) {
        errors.brand = 'Brand is required'
      }
      if (!type) {
        errors.type = 'Type is required'
      }

      return response.status(400).json(validationErrorResponse(errors, 'Validation failed', 422))
    }

    try {
      const result = await Product.query()
        .where('brand', brand.replace(/-/g, ' '))
        .where('type', type.replace(/-/g, ' '))

      return response
        .status(200)
        .json(successResponse(result, 'Products fetched successfully', 200))
    } catch (error) {
      console.error('Error fetching products for brand:', error)
      return response.status(500).json(errorResponse('Failed to fetch products for brand', 500))
    }
  }
}
