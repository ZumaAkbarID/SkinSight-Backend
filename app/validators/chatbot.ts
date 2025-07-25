import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { validationFields, validationMessages } from './CustomSimpleMessagesProvider.js'

export const sendChatMessageValidator = vine.compile(
  vine.object({
    message: vine.string(),
  })
)

sendChatMessageValidator.messagesProvider = new SimpleMessagesProvider(
  validationMessages,
  validationFields
)
