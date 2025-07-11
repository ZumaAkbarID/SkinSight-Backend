import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { validationFields, validationMessages } from './CustomSimpleMessagesProvider.js'

export const scanFaceValidator = vine.compile(
  vine.object({
    scanImage: vine.file({
      size: '15mb',
      extnames: ['jpg', 'jpeg', 'png'],
    }),
  })
)

scanFaceValidator.messagesProvider = new SimpleMessagesProvider(
  validationMessages,
  validationFields
)

export const scanIngredientValidator = vine.compile(
  vine.object({
    productName: vine.string().maxLength(100),
    scanImage: vine.file({
      size: '15mb',
      extnames: ['jpg', 'jpeg', 'png'],
    }),
  })
)

scanIngredientValidator.messagesProvider = new SimpleMessagesProvider(
  validationMessages,
  validationFields
)
