import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { validationFields, validationMessages } from './CustomSimpleMessagesProvider.js'

export const updateProfileValidator = vine.compile(
  vine.object({
    fullName: vine.string().minLength(3).maxLength(100).optional(),
    profilePicture: vine
      .file({
        size: '5mb',
        extnames: ['jpg', 'jpeg', 'png', 'gif'],
      })
      .optional(),
  })
)

updateProfileValidator.messagesProvider = new SimpleMessagesProvider(
  validationMessages,
  validationFields
)

export const changePasswordValidator = vine.compile(
  vine.object({
    currentPassword: vine.string().minLength(8).optional(),
    newPassword: vine.string().minLength(8),
    confirmPassword: vine.string().minLength(8).sameAs('newPassword'),
  })
)

changePasswordValidator.messagesProvider = new SimpleMessagesProvider(
  validationMessages,
  validationFields
)
