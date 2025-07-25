/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),

  /*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring the mail package
  |----------------------------------------------------------
  */
  SMTP_HOST: Env.schema.string(),
  SMTP_PORT: Env.schema.string(),
  BREVO_API_KEY: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | My Own variables
  |----------------------------------------------------------
  */
  BYPASS_OTP_VERIFICATION: Env.schema.boolean(),
  MAIL_FROM_NAME: Env.schema.string(),
  MAIL_FROM_EMAIL: Env.schema.string({ format: 'email' }),
  APP_URL: Env.schema.string(),
  ML_URL: Env.schema.string(),
  BYPASS_FACE_SCAN: Env.schema.boolean(),
  BYPASS_INGREDIENTS_OCR: Env.schema.boolean(),
  BYPASS_LIMITER: Env.schema.boolean(),
  API_UV_URL: Env.schema.string(),
  API_GEO_URL: Env.schema.string(),
  N8N_URL: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring the limiter package
  |----------------------------------------------------------
  */
  LIMITER_STORE: Env.schema.enum(['database', 'memory'] as const),
})
