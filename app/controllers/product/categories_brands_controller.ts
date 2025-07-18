import type { HttpContext } from '@adonisjs/core/http'
import { errorResponse, successResponse, validationErrorResponse } from '#helpers/response'
import Product from '#models/product'

export default class CategoriesBrandsController {
  async handle({ request, response }: HttpContext) {
    const brand = request.input('brand')

    if (!brand) {
      return response
        .status(400)
        .json(validationErrorResponse({ brand: 'Brand is required' }, 'Validation failed', 422))
    }

    try {
      const products = await Product.query().where('brand', brand)

      const categorized = products.reduce<Record<string, any[]>>((acc, product) => {
        const type = product.type ?? 'unknown'
        if (!acc[type]) acc[type] = []
        acc[type].push(product)
        return acc
      }, {})

      return response
        .status(200)
        .json(successResponse(categorized, 'Categories fetched successfully', 200))
    } catch (error) {
      console.error('Error fetching categories for brand:', error)
      return response.status(500).json(errorResponse('Failed to fetch categories for brand', 500))
    }
  }
}
