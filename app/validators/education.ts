import vine from '@vinejs/vine'

export const getEducationDetailValidator = vine.compile(
  vine.object({
    articleLink: vine.string().url(),
  })
)
