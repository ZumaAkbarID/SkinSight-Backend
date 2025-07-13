import { errorResponse, successResponse } from '#helpers/response'
import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProductsController {
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
      const search = request.input('search') // opsional

      const page = request.input('page', 1)
      const limit = 10

      let query = Product.query()

      if (search) {
        query = query.where((builder) => {
          builder
            .where('title', 'like', `%${search}%`)
            .orWhere('description', 'like', `%${search}%`)
            .orWhere('brand', 'like', `%${search}%`)
        })
      }

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

  async getTypesAndBrands({ response }: HttpContext) {
    try {
      const types = await Product.query().distinct('type').orderBy('type', 'asc')
      const brands = await Product.query().distinct('brand').orderBy('brand', 'asc')

      const merged = {
        types: [...types.map((item) => item.type)],
        brands: [...brands.map((item) => item.brand)],
      }

      return response
        .status(200)
        .json(successResponse(merged, 'Types and brands fetched successfully', 200))
    } catch (error) {
      console.error('Error fetching types and brands:', error)
      return response.status(500).json(errorResponse('Failed to fetch products', 500))
    }
  }
}
