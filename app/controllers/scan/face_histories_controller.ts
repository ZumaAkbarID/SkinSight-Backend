import type { HttpContext } from '@adonisjs/core/http'

export default class FaceHistoriesController {
  async handle({ auth, response }: HttpContext) {
    const user = auth.user!

    try {
      const faceHistories = await user.related('faceScans').query().orderBy('createdAt', 'desc')

      return response.status(200).json({
        status: 'success',
        data: faceHistories,
        message: 'Face histories retrieved successfully',
      })
    } catch (error) {
      console.error('Error retrieving face histories:', error)
      return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
      })
    }
  }
}
