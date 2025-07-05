import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const updateProfileValidator = vine.compile(
  vine.object({
    full_name: vine.string().minLength(3).maxLength(100).optional(),
    profile_picture: vine
      .file({
        size: '5mb',
        extnames: ['jpg', 'jpeg', 'png', 'gif'],
      })
      .optional(),
  })
)

const fields = {
  full_name: 'Full Name',
  profile_picture: 'Profile Picture',
}

const messages = {
  minLength: '{field} must be at least {options.minLength} characters long',
  maxLength: '{field} must not exceed {options.maxLength} characters',
  file: '{field} must be a valid file',
  extnames: '{field} must be one of the following formats: {options.extnames}',
  size: '{field} must not exceed {options.size}',
  required: '{field} is required',
  optional: '{field} is optional',
}

updateProfileValidator.messagesProvider = new SimpleMessagesProvider(messages, fields)
