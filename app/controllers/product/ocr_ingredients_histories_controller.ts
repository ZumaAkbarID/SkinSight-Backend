import type { HttpContext } from '@adonisjs/core/http'

export default class OcrIngredientsHistoriesController {
  async handle({ auth, response }: HttpContext) {
    const user = auth.user!

    try {
      const ocrHistories = await user
        .related('productOcr')
        .query()
        .select(
          'id',
          'product_name',
          'scan_image',
          'is_safe',
          'total_harmful_ingredients',
          'created_at'
        )
        .orderBy('createdAt', 'desc')

      return response.status(200).json({
        status: 'success',
        data: ocrHistories,
        message: 'OCR ingredient histories retrieved successfully',
      })
    } catch (error) {
      console.error('Error retrieving OCR ingredient histories:', error)
      return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
      })
    }
  }
}
