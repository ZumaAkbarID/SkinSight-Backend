import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const fillAssessmentValidator = vine.compile(
  vine.object({
    gender: vine.string().toLowerCase().in(['male', 'female', 'other']),
    age: vine.number().min(0).max(120),
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
  age: 'Age',
  scanImage: 'Scan Image',
  skinType: 'Skin Type',
}

const messages = {
  in: 'The {{ field }} is not valid.',
  size: 'The {{ field }} must be less than {{ size }}.',
  extnames: 'The {{ field }} must be a valid image file (jpg, jpeg, png).',
  min: 'The {{ field }} must be at least {{ min }}.',
  max: 'The {{ field }} must not exceed {{ max }}.',
  required: 'The {{ field }} is required.',
  optional: 'The {{ field }} is optional.',
}

fillAssessmentValidator.messagesProvider = new SimpleMessagesProvider(messages, fields)
