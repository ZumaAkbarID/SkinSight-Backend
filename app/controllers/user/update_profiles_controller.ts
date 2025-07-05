import type { HttpContext } from '@adonisjs/core/http'
import { updateProfileValidator } from '#validators/user'
import { errorResponse, successResponse, validationErrorResponse } from '#helpers/response'
import app from '@adonisjs/core/services/app'
import * as fs from 'node:fs'
import { cuid } from '@adonisjs/core/helpers'
import router from '@adonisjs/core/services/router'

export default class UpdateProfilesController {
  async handle({ auth, request, response }: HttpContext) {
    try {
      const user = auth.user!

      const payload = await request.validateUsing(updateProfileValidator)

      if (payload.fullName) {
        user.fullName = payload.fullName
      }

      if (payload.profilePicture) {
        const ext = payload.profilePicture.extname
        const newName = `${cuid()}.${ext}`

        await payload.profilePicture.move(app.makePath('uploads/profile_pictures'), {
          name: newName,
          overwrite: true,
        })

        if (
          user.profilePicture &&
          user.profilePicture !== '/profile_pictures/other.jpg' &&
          user.profilePicture !== '/profile_pictures/male.jpg' &&
          user.profilePicture !== '/profile_pictures/female.jpg'
        ) {
          fs.unlink(app.makePath('uploads/profile_pictures', user.profilePicture), () => {})
        }

        user.profilePicture = router.builder().params([newName]).make('profilePictures')
      }

      await user.save()

      return response.json(successResponse(user, 'Profile updated'))
    } catch (error) {
      if (error.messages) {
        return response
          .status(422)
          .json(validationErrorResponse(error.messages, 'Validation error'))
      }
      return response.status(500).json(errorResponse('Internal server error'))
    }
  }
}
