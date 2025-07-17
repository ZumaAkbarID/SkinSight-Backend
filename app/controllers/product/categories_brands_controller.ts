import type { HttpContext } from '@adonisjs/core/http'
import { errorResponse, successResponse } from '#helpers/response'
import Product from '#models/product'
import { getProductOfCategoryBrand } from '#validators/product'

export default class CategoriesBrandsController {
  async handle({ request, response }: HttpContext) {
    const payload = await request.validateUsing(getProductOfCategoryBrand)

    try {
      const categories = await Product.query().where('brand', payload.brand).groupBy('type')

      return response
        .status(200)
        .json(successResponse(categories, 'Categories fetched successfully', 200))
    } catch (error) {
      console.error('Error fetching categories for brand:', error)
      return response.status(500).json(errorResponse('Failed to fetch categories for brand', 500))
    }
  }
}
