import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { validationFields, validationMessages } from './CustomSimpleMessagesProvider.js'

export const getProductOfCategoryBrand = vine.compile(
  vine.object({
    brand: vine.string(),
  })
)

getProductOfCategoryBrand.messagesProvider = new SimpleMessagesProvider(
  validationMessages,
  validationFields
)
