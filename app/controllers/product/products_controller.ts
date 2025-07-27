import { errorResponse, successResponse } from '#helpers/response'
import Product from '#models/product'
import stringHelpers from '@adonisjs/core/helpers/string'
import type { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'
import redis from '@adonisjs/redis/services/main'

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

      const cacheKey = `products:all:u${user.id}:s=${sort}&t=${type}&b=${brand}&q=${search}&p=${page}`

      const cached = await redis.get(cacheKey)
      if (cached) {
        return response
          .status(200)
          .json(successResponse(JSON.parse(cached), 'Recommendations (cached)', 200))
      }

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

      await redis.setex(cacheKey, 60 * 60, JSON.stringify(products))

      return response
        .status(200)
        .json(successResponse(products, 'Recommendations fetched successfully', 200))
    } catch (error) {
      console.error('Error fetching all products:', error)
      return response.status(500).json(errorResponse('Failed to fetch products', 500))
    }
  }

  async getTypesAndBrands({ response }: HttpContext) {
    const cacheKey = 'products:types-brands'
    const cached = await redis.get(cacheKey)

    if (cached) {
      return response
        .status(200)
        .json(successResponse(JSON.parse(cached), 'Types and brands from cache', 200))
    }

    try {
      const types = await Product.query().distinct('type').orderBy('type', 'asc')
      const brands = await Product.query()
        .select('brand')
        .count('id as total')
        .groupBy('brand')
        .orderBy('brand', 'asc')

      const merged = {
        types: types.map((item) => item.type),
        brands: brands.map((item) => {
          return {
            name: item.brand,
            image: router
              .builder()
              .params([`${stringHelpers.slug(item.brand.toLowerCase())}.jpg`])
              .make('brands'),
            total: item.$extras.total,
          }
        }),
      }

      await redis.setex(cacheKey, 60 * 60 * 6, JSON.stringify(merged)) // 6 jam

      return response
        .status(200)
        .json(successResponse(merged, 'Types and brands fetched successfully', 200))
    } catch (error) {
      console.error('Error fetching types and brands:', error)
      return response.status(500).json(errorResponse('Failed to fetch products', 500))
    }
  }
}
