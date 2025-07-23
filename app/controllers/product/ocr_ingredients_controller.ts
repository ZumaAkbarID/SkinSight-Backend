import type { HttpContext } from '@adonisjs/core/http'
import ProductOcr from '#models/product_ocr'
import { errorResponse, successResponse } from '#helpers/response'
import { randomUUID } from 'node:crypto'
import { scanIngredientValidator } from '#validators/scan'
import { processIngredientsOcr } from '#helpers/product_ocr_ingredient'
import router from '@adonisjs/core/services/router'

export default class OcrIngredientsController {
  async handle({ auth, request, response }: HttpContext) {
    const user = auth.user!
    await user.load('userDetail')

    if (!user.userDetail || !user.userDetail.skinType) {
      return response
        .status(400)
        .json(errorResponse('Please complete your assessment before using this feature', 400))
    }

    const payload = await request.validateUsing(scanIngredientValidator)

    try {
      const { status, message, ml, fileName } = await processIngredientsOcr(
        payload.scanImage,
        user.userDetail!.skinType
      )

      if (!status) {
        return response.status(400).json(errorResponse(message, 400, ml))
      }

      if (ml.extractedIngredients == 'Ingredients Tidak Ditemukan.') {
        return response
          .status(400)
          .json(errorResponse('No ingredients found in the scan image', 400, ml))
      }

      const ocr = await ProductOcr.create({
        id: randomUUID(),
        userId: user.id,
        productName: payload.productName,
        scanImage: router.builder().params([fileName]).make('ingredientsScan'),
        extractedIngredients: ml.extractedIngredients ?? [],
        harmfulIngredientsFound: ml.harmfulIngredientsFound ?? [],
        isSafe: ml.isSafe,
        totalHarmfulIngredients: ml.totalHarmfulIngredients,
        skinType: user.userDetail!.skinType,
      })

      return response.status(200).json(
        successResponse(
          {
            ...ml,
            productName: ocr.productName,
            scanImage: ocr.scanImage,
            id: ocr.id,
          },
          message,
          200
        )
      )
    } catch (error) {
      console.error('OCR processing error:', error)
      return response.status(500).json(errorResponse('Internal server error'))
    }
  }
}
