import { SimpleMessagesProvider } from '@vinejs/vine'
import vine from '@vinejs/vine'
import { validationFields, validationMessages } from './CustomSimpleMessagesProvider.js'

export const registerUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().minLength(3).maxLength(100),
    email: vine.string().email().unique({
      table: 'users',
      column: 'email',
    }),
    password: vine.string().minLength(8),
    confirmPassword: vine.string().minLength(8).sameAs('password'),
  })
)

registerUserValidator.messagesProvider = new SimpleMessagesProvider(
  validationMessages,
  validationFields
)

export const loginUserValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8),
  })
)

loginUserValidator.messagesProvider = new SimpleMessagesProvider(
  validationMessages,
  validationFields
)

export const verifyOtpValidator = vine.compile(
  vine.object({
    otp: vine.string().minLength(5).maxLength(5),
  })
)

verifyOtpValidator.messagesProvider = new SimpleMessagesProvider(
  validationMessages,
  validationFields
)

export const oauth2GoogleValidator = vine.compile(
  vine.object({
    idToken: vine.string(),
  })
)

export const forgotPassowrdValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
  })
)

forgotPassowrdValidator.messagesProvider = new SimpleMessagesProvider(
  validationMessages,
  validationFields
)

export const otpForgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    otp: vine.string().minLength(4).maxLength(4),
  })
)

otpForgotPasswordValidator.messagesProvider = new SimpleMessagesProvider(
  validationMessages,
  validationFields
)

export const resetForgotPasswordValidator = vine.compile(
  vine.object({
    token: vine.string().uuid(),
    newPassword: vine.string().minLength(8),
    confirmPassword: vine.string().minLength(8).sameAs('newPassword'),
  })
)

resetForgotPasswordValidator.messagesProvider = new SimpleMessagesProvider(
  validationMessages,
  validationFields
)
