import { SimpleMessagesProvider } from '@vinejs/vine'
import vine from '@vinejs/vine'

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

const messages = {
  required: 'The {{ field }} field is required.',
  minLength: 'The {{ field }} field must be at least {{ argument }} characters long.',
  maxLength: 'The {{ field }} field must not exceed {{ argument }} characters.',
  email: 'The {{ field }} field must be a valid email address.',
  unique: 'The {{ field }} field must be unique.',
  sameAs: 'The {{ field }} field must match the Password field.',
}

const fields = {
  fullName: 'Full Name',
  email: 'Email',
  password: 'Password',
  confirmPassword: 'Confirm Password',
}

registerUserValidator.messagesProvider = new SimpleMessagesProvider(messages, fields)

export const loginUserValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8),
  })
)

loginUserValidator.messagesProvider = new SimpleMessagesProvider(messages, fields)

export const verifyOtpValidator = vine.compile(
  vine.object({
    otp: vine.string().minLength(5).maxLength(5),
  })
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

export const otpForgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    otp: vine.string().minLength(4).maxLength(4),
  })
)

export const resetForgotPasswordValidator = vine.compile(
  vine.object({
    token: vine.string().uuid(),
    newPassword: vine.string().minLength(8),
    confirmPassword: vine.string().minLength(8).sameAs('newPassword'),
  })
)
