import { errorResponse, successResponse } from '#helpers/response'
import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'

export default class RecommendationsController {
  async handle({ auth, response }: HttpContext) {
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
}
