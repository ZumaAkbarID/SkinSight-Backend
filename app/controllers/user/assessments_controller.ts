import type { HttpContext } from '@adonisjs/core/http'
import { fillAssessmentValidator } from '#validators/assessment'
import { errorResponse, successResponse, validationErrorResponse } from '#helpers/response'
import UserDetail from '#models/user_detail'
import axios from 'axios'
import { DateTime } from 'luxon'
import router from '@adonisjs/core/services/router'
import FaceScan from '#models/face_scan'
import { processFaceScan } from '#helpers/face_scan'

export default class AssessmentController {
  async handle({ request, auth, response }: HttpContext) {
    try {
      const user = auth.user!

      const payload = await request.validateUsing(fillAssessmentValidator)

      let skinType = payload.skinType ?? null

      if (!skinType && !payload.scanImage) {
        return response.status(400).json(
          validationErrorResponse({
            skinType: 'Skin type is required if no scan image is provided.',
          })
        )
      }

      if (payload.scanImage) {
        let mlResult, fileName: string

        try {
          const processed = await processFaceScan(payload.scanImage)
          mlResult = processed.ml
          fileName = processed.fileName
        } catch (err) {
          return response.status(400).json(errorResponse(err.message, 400))
        }

        await FaceScan.create({
          userId: user.id,
          scanImage: router.builder().params([fileName]).make('scanFaces'),
          dry: mlResult.dry,
          oily: mlResult.oily,
          normal: mlResult.normal,
          predictedLabel: mlResult.predicted_label,
        })

        skinType = mlResult.skinType
      }

      let userDetail = await UserDetail.query().where('user_id', user.id).first()
      if (!userDetail) {
        userDetail = new UserDetail()
        userDetail.userId = user.id
      }

      userDetail.gender = payload.gender
      userDetail.dateOfBirth = DateTime.now().minus({ years: payload.age })
      userDetail.skinType = skinType

      await userDetail.save()

      user.profilePicture = router
        .builder()
        .params([`${payload.gender}.jpg`])
        .make('profilePictures')

      await user.save()

      return response.json(successResponse(userDetail, 'Assessment submitted'))
    } catch (error) {
      console.error('Assessment error:', error)
      if (error.messages) {
        return response
          .status(422)
          .json(validationErrorResponse(error.messages, 'Validation error'))
      }
      if (axios.isAxiosError(error)) {
        return response.status(400).json(errorResponse('ML service error'))
      }
      return response.status(500).json(errorResponse('Internal server error'))
    }
  }
}
