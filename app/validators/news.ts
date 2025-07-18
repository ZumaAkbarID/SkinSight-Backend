import vine from '@vinejs/vine'

export const getNewsDetailValidator = vine.compile(
  vine.object({
    articleLink: vine.string().url(),
  })
)
