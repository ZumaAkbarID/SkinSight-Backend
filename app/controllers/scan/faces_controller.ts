import { processFaceScan } from '#helpers/face_scan'
import { errorResponse, successResponse } from '#helpers/response'
import FaceScan from '#models/face_scan'
import UserDetail from '#models/user_detail'
import { scanFaceValidator } from '#validators/scan'
import type { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'

export default class FacesController {
  async handle({ auth, request, response }: HttpContext) {
    const user = auth.user!

    const payload = await request.validateUsing(scanFaceValidator)

    try {
      const { status, message, ml, fileName } = await processFaceScan(payload.scanImage)

      if (!status) {
        return response.status(400).json(errorResponse(message, 400, ml))
      }

      await FaceScan.create({
        userId: user.id,
        scanImage: router.builder().params([fileName]).make('scanFaces'),
        dry: ml.dry,
        oily: ml.oily,
        normal: ml.normal,
        predictedLabel: ml.predicted_label,
      })

      await UserDetail.query().where('userId', user.id).update({
        skinType: ml.predicted_label,
      })

      return response.status(200).json(successResponse(ml, 'Face scan processed successfully', 200))
    } catch (error) {
      console.error('Face scan processing error:', error)
      return response.status(500).json(errorResponse('Internal server error'))
    }
  }
}
