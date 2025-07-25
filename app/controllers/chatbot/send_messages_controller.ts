import { N8NDto, sendMessage } from '#helpers/n8n'
import { errorResponse, successResponse } from '#helpers/response'
import { sendChatMessageValidator } from '#validators/chatbot'
import type { HttpContext } from '@adonisjs/core/http'

export default class SendMessagesController {
  async handle({ auth, request, response }: HttpContext) {
    const user = auth.user!
    await user.load('userDetail')

    if (!user.userDetail) {
      return response
        .status(400)
        .json(errorResponse('Please complete your assessment before using this feature', 400))
    }

    const payload = await request.validateUsing(sendChatMessageValidator)

    try {
      const data: N8NDto = {
        userId: user.id,
        fullName: user.fullName,
        skinType: user.userDetail.skinType!,
        age: user.userDetail.age!,
        message: payload.message,
      }

      const { status, message, api } = await sendMessage(data)

      if (!status) {
        return response.status(400).json(errorResponse(message, 400, api))
      }

      return response.status(200).json(successResponse(api, message, 200))
    } catch (error) {
      console.error('Error sending message:', error)

      return response.status(500).json(errorResponse('Failed to send message', 500))
    }
  }
}
