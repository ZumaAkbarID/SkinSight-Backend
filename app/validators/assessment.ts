import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { validationFields, validationMessages } from './CustomSimpleMessagesProvider.js'

export const fillAssessmentValidator = vine.compile(
  vine.object({
    gender: vine.string().toLowerCase().in(['male', 'female', 'other']),
    // dateOfBirth: vine.date(),
    age: vine.number().min(1).max(120),
    scanImage: vine
      .file({
        size: '15mb',
        extnames: ['jpg', 'jpeg', 'png'],
      })
      .optional(),
    skinType: vine
      .string()
      .toLowerCase()
      .in(['dry', 'oily', 'normal', 'acne', 'sensitive'])
      .optional(),
  })
)

fillAssessmentValidator.messagesProvider = new SimpleMessagesProvider(
  validationMessages,
  validationFields
)
