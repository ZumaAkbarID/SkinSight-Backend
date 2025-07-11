import { errorResponse } from '#helpers/response'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class VerifiedUserMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const { auth, response } = ctx
    const user = auth.user

    if (user && !user.isVerified) {
      return response.status(403).send(errorResponse('User is not verified', 403))
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
