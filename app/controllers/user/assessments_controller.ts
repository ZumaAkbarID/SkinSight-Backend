import type { HttpContext } from '@adonisjs/core/http'
import { fillAssessmentValidator } from '#validators/assessment'
import { errorResponse, successResponse, validationErrorResponse } from '#helpers/response'
import UserDetail from '#models/user_detail'
import axios from 'axios'
import router from '@adonisjs/core/services/router'
import FaceScan from '#models/face_scan'
import { processFaceScan } from '#helpers/face_scan'
import env from '#start/env'

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

      let status: boolean,
        message: string,
        mlResult,
        fileName: string | null = null

      if (payload.scanImage) {
        try {
          const processed = await processFaceScan(payload.scanImage)
          status = processed.status
          message = processed.message
          mlResult = processed.ml
          fileName = processed.fileName

          if (!status) {
            return response.status(400).json(errorResponse(message, 400, mlResult))
          }
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

        skinType = mlResult.predicted_label
      }

      let userDetail = await UserDetail.query().where('user_id', user.id).first()
      if (!userDetail) {
        userDetail = new UserDetail()
        userDetail.userId = user.id
      }

      userDetail.gender = payload.gender
      // userDetail.dateOfBirth = DateTime.fromJSDate(payload.dateOfBirth)
      userDetail.age = payload.age
      userDetail.skinType = skinType

      await userDetail.save()

      user.profilePicture = router
        .builder()
        .params([`${payload.gender}.jpg`])
        .make('profilePictures')

      await user.save()

      return response.json(
        successResponse(
          {
            assessmentData: userDetail,
            scanResult: payload.scanImage
              ? env.get('BYPASS_FACE_SCAN')
                ? {
                    dry: 0.2,
                    oily: 0.5,
                    normal: 0.3,
                    predicted_label: 'oily',
                  }
                : mlResult
              : null,
          },
          'Assessment submitted'
        )
      )
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
