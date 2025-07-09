import { errorResponse, successResponse } from '#helpers/response'
import ProductOcr from '#models/product_ocr'
import type { HttpContext } from '@adonisjs/core/http'

export default class OcrIngredientsHistoryDetailsController {
  async handle({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const ocrId = params.id

    if (!ocrId) {
      return response.status(400).json(errorResponse('OCR ID is required', 400))
    }

    try {
      const ocrDetails = await ProductOcr.query()
        .where('id', ocrId)
        .where('user_id', user.id)
        .firstOrFail()

      return response
        .status(200)
        .json(
          successResponse(ocrDetails, 'OCR ingredient history details retrieved successfully', 200)
        )
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.status(404).json(errorResponse('OCR ingredient history not found', 404))
      }

      console.error('Error retrieving OCR ingredient history details:', error)

      return response.status(500).json(errorResponse('Internal server error', 500))
    }
  }
}
