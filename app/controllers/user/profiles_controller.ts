import type { HttpContext } from '@adonisjs/core/http'
import { errorResponse, successResponse } from '#helpers/response'

export default class ProfilesController {
  async handle({ auth, response }: HttpContext) {
    try {
      const user = auth.user!

      await user.load('userDetail')

      return response.json(
        successResponse(
          {
            id: user.id,
            full_name: user.fullName,
            email: user.email,
            profile_picture: user.profilePicture,
            email_verified_at: user.emailVerifiedAt,
            is_verified: user.isVerified,
            is_assessment_completed: user.isAssessmentCompleted,
            created_at: user.createdAt,
            detail: user.userDetail,
          },
          'Profile data fetched'
        )
      )
    } catch (error) {
      return response.status(500).json(errorResponse('Internal server error'))
    }
  }
}
