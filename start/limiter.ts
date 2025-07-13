/*
|--------------------------------------------------------------------------
| Define HTTP limiters
|--------------------------------------------------------------------------
|
| The "limiter.define" method creates an HTTP middleware to apply rate
| limits on a route or a group of routes. Feel free to define as many
| throttle middleware as needed.
|
*/

import limiter from '@adonisjs/limiter/services/main'
import env from './env.js'

export const throttle = limiter.define('global', () => {
  if (env.get('BYPASS_LIMITER')) {
    return limiter.allowRequests(1000).every('1 minute')
  } else {
    return limiter.allowRequests(10).every('1 minute')
  }
})
