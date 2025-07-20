import vine from '@vinejs/vine'

export const getEducationValidator = vine.compile(
  vine.object({
    page: vine.number().min(1),
    prevLink: vine.string().optional(),
    nextLink: vine.string().optional(),
  })
)

export const getEducationDetailValidator = vine.compile(
  vine.object({
    articleLink: vine.string().url(),
  })
)
