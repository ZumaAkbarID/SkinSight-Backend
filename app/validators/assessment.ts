import vine, { SimpleMessagesProvider } from '@vinejs/vine'

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

const fields = {
  gender: 'Gender',
  dateOfBirth: 'Date of Birth',
  scanImage: 'Scan Image',
  skinType: 'Skin Type',
  age: 'Age',
}

const messages = {
  in: 'The {{ field }} is not valid.',
  size: 'The {{ field }} must be less than {{ size }}.',
  extnames: 'The {{ field }} must be a valid image file (jpg, jpeg, png).',
  date: 'The {{ field }} must be a valid date.',
  required: 'The {{ field }} is required.',
  optional: 'The {{ field }} is optional.',
}

fillAssessmentValidator.messagesProvider = new SimpleMessagesProvider(messages, fields)
