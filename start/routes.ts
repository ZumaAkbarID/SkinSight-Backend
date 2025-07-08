/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import LoginController from '#controllers/auth/login_controller'
import RegistersController from '#controllers/auth/registers_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import LogoutsController from '#controllers/auth/logouts_controller'
import AssessmentController from '#controllers/user/assessments_controller'
import ProfilesController from '#controllers/user/profiles_controller'
import { sep, normalize } from 'node:path'
import app from '@adonisjs/core/services/app'
import UpdateProfilesController from '#controllers/user/update_profiles_controller'
import FacesController from '#controllers/scan/faces_controller'
import OcrIngredientsController from '#controllers/product/ocr_ingredients_controller'
import RecommendationsController from '#controllers/product/recommendations_controller'
import EducationsController from '#controllers/educations_controller'
import AdsController from '#controllers/ads_controller'

router.get('/', async () => {
  return {
    hello: 'SkinSight Backend API',
  }
})

router
  .group(() => {
    router
      .group(() => {
        router.post('register', [RegistersController])
        router.post('login', [LoginController])
      })
      .prefix('auth')

    router
      .group(() => {
        router.post('/auth/logout', [LogoutsController])

        router.post('assessment', [AssessmentController])

        router
          .group(() => {
            router.get('profile', [ProfilesController])
            router.put('profile', [UpdateProfilesController])
          })
          .prefix('user')

        router
          .group(() => {
            router.post('face', [FacesController])
            router.post('ingredients', [OcrIngredientsController])
          })
          .prefix('scan')

        router
          .group(() => {
            router.get('recommendations', [RecommendationsController])
          })
          .prefix('product')

        router.get('educations', [EducationsController])

        router.get('ads', [AdsController])
      })
      .use(middleware.auth())
  })
  .prefix('api')

const PATH_TRAVERSAL_REGEX = /(?:^|[\\/])\.\.(?:[\\/]|$)/

router
  .get('/profile_pictures/*', ({ request, response }) => {
    const filePath = request.param('*').join(sep)
    const normalizedPath = normalize(filePath)

    if (PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
      return response.badRequest('Malformed path')
    }

    const absolutePath = app.makePath('uploads/profile_pictures', normalizedPath)
    return response.download(absolutePath)
  })
  .as('profilePictures')

router
  .get('/scan_faces/*', ({ request, response }) => {
    const filePath = request.param('*').join(sep)
    const normalizedPath = normalize(filePath)

    if (PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
      return response.badRequest('Malformed path')
    }

    const absolutePath = app.makePath('uploads/scan_faces', normalizedPath)
    return response.download(absolutePath)
  })
  .as('scanFaces')

router
  .get('/ingredients_ocr/*', ({ request, response }) => {
    const filePath = request.param('*').join(sep)
    const normalizedPath = normalize(filePath)

    if (PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
      return response.badRequest('Malformed path')
    }

    const absolutePath = app.makePath('uploads/ingredients_ocr', normalizedPath)
    return response.download(absolutePath)
  })
  .as('ingredientsScan')
