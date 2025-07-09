import { errorResponse, successResponse } from '#helpers/response'
import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'

export default class RecommendationsController {
  async recommendations({ auth, response }: HttpContext) {
    const user = auth.user!
    await user.load('userDetail')

    if (!user.userDetail || !user.userDetail.skinType) {
      return response
        .status(400)
        .json(errorResponse('Please complete your assessment before using this feature', 400))
    }

    try {
      const products = await Product.query().orderByRaw('RAND()').limit(5)

      return response
        .status(200)
        .json(successResponse(products, 'Recommendations fetched successfully', 200))
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      return response.status(500).json(errorResponse('Failed to fetch recommendations', 500))
    }
  }

  async all({ auth, request, response }: HttpContext) {
    const user = auth.user!
    await user.load('userDetail')

    if (!user.userDetail || !user.userDetail.skinType) {
      return response
        .status(400)
        .json(errorResponse('Please complete your assessment before using this feature', 400))
    }

    try {
      // Query params: sort (price|type|brand), type, brand
      const sort = request.input('sort', 'price') // default sort by price
      const type = request.input('type') // opsional
      const brand = request.input('brand') // opsional

      const page = request.input('page', 1)
      const limit = 10

      let query = Product.query()

      if (type) query = query.where('type', type)
      if (brand) query = query.where('brand', brand)
      if (['price', 'type', 'brand'].includes(sort)) {
        query = query.orderBy(sort, 'asc')
      }

      const products = (await query.paginate(page, limit)).toJSON()

      return response
        .status(200)
        .json(successResponse(products, 'Recommendations fetched successfully', 200))
    } catch (error) {
      console.error('Error fetching all products:', error)
      return response.status(500).json(errorResponse('Failed to fetch products', 500))
    }
  }
}
