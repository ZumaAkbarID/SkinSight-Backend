import vine from '@vinejs/vine'

export const scanFaceValidator = vine.compile(
  vine.object({
    scanImage: vine.file({
      size: '15mb',
      extnames: ['jpg', 'jpeg', 'png'],
    }),
  })
)

export const scanIngredientValidator = vine.compile(
  vine.object({
    scanImage: vine.file({
      size: '15mb',
      extnames: ['jpg', 'jpeg', 'png'],
    }),
  })
)
