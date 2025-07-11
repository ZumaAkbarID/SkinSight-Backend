import { errorResponse, successResponse, validationErrorResponse } from '#helpers/response'
import { changePasswordValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

export default class ChangePasswordsController {
  async handle({ auth, request, response }: HttpContext) {
    const user = auth.user!

    const { currentPassword, newPassword } = await request.validateUsing(changePasswordValidator)

    if (user.hasPassword && !currentPassword) {
      return response
        .status(400)
        .json(
          validationErrorResponse(
            { currentPassword: 'Current password is required' },
            'Current password is required',
            400
          )
        )
    }

    try {
      if (
        user.password &&
        currentPassword &&
        !(await hash.verify(user.password, currentPassword))
      ) {
        return response.status(400).json(
          validationErrorResponse(
            {
              currentPassword: 'Current password is incorrect',
            },
            'Invalid current password',
            400
          )
        )
      }

      user.password = await hash.make(newPassword)
      await user.save()

      return response.status(200).json(successResponse(null, 'Password changed successfully', 200))
    } catch (error) {
      console.error('Error changing password:', error)
      return response.status(500).json(errorResponse('Internal server error', 500))
    }
  }
}
