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
import AdsController from '#controllers/ads_controller'
import FaceHistoriesController from '#controllers/scan/face_histories_controller'
import OcrIngredientsHistoriesController from '#controllers/product/ocr_ingredients_histories_controller'
import OcrIngredientsHistoryDetailsController from '#controllers/product/ocr_ingredients_history_details_controller'
import EducationsController from '#controllers/education/educations_controller'
import EducationDetailsController from '#controllers/education/education_details_controller'
import VerifiesController from '#controllers/auth/verifies_controller'
import { throttle } from '#start/limiter'
import GooglesController from '#controllers/auth/googles_controller'
import ForgotPasswordsController from '#controllers/auth/forgot_passwords_controller'
import ChangePasswordsController from '#controllers/user/change_passwords_controller'
import ProductsController from '#controllers/product/products_controller'
import CategoriesBrandsController from '#controllers/product/categories_brands_controller'
import ProductCategoriesController from '#controllers/product/product_categories_controller'
import NewsController from '#controllers/news/news_controller'
import NewsDetailsController from '#controllers/news/news_details_controller'
import CurrentuvindicesController from '#controllers/external/currentuvindices_controller'

router
  .get('/', async () => {
    return {
      hello: 'SkinSight Backend API',
      adonisVersion: app.adonisVersion,
      nodeVersion: process.version,
    }
  })
  .use(throttle)

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
        router.post('google', [GooglesController])
      })
      .prefix('oauth2')

    router
      .group(() => {
        router.post('generate-otp', [ForgotPasswordsController, 'generateOtp'])
        router.post('verify-otp', [ForgotPasswordsController, 'verifyOtp'])
        router.post('reset-password', [ForgotPasswordsController, 'resetPassword'])
      })
      .prefix('forgot-password')

    router
      .group(() => {
        router.post('new', [VerifiesController, 'newOtp'])
        router.post('verify', [VerifiesController, 'verifyOtp'])
      })
      .prefix('otp')
      .middleware(middleware.auth())

    router
      .group(() => {
        router.post('/auth/logout', [LogoutsController])

        router.post('assessment', [AssessmentController])

        router
          .group(() => {
            router.get('profile', [ProfilesController])
            router.put('profile', [UpdateProfilesController])

            router.post('change-password', [ChangePasswordsController])
          })
          .prefix('user')

        router
          .group(() => {
            router.post('face', [FacesController])
            router.get('face/history', [FaceHistoriesController])
            router.post('ingredients', [OcrIngredientsController])
            router.get('ingredients/history', [OcrIngredientsHistoriesController])
            router.get('ingredients/history/:id', [OcrIngredientsHistoryDetailsController])
          })
          .prefix('scan')

        router
          .group(() => {
            router.get('recommendations', [RecommendationsController])
            router.get('all', [ProductsController, 'all'])
            router.get('types-and-brands', [ProductsController, 'getTypesAndBrands'])
            router.get('brand/:brand', [CategoriesBrandsController])
            router.get('brand/:brand/:type', [ProductCategoriesController])
          })
          .prefix('product')

        router
          .group(() => {
            router.get('/', [EducationsController])
            router.get('/detail', [EducationDetailsController])
          })
          .prefix('educations')

        router
          .group(() => {
            router.get('/', [NewsController])
            router.post('/:id', [NewsDetailsController])
          })
          .prefix('news')

        router.get('current-uv-index', [CurrentuvindicesController])

        router.get('ads', [AdsController])
      })
      .use([middleware.auth(), middleware.verifiedUser()])
  })
  .prefix('api')
  .use(throttle)

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

router
  .get('/brands/*', ({ request, response }) => {
    const filePath = request.param('*').join(sep)
    const normalizedPath = normalize(filePath)

    if (PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
      return response.badRequest('Malformed path')
    }

    const absolutePath = app.makePath('uploads/brands', normalizedPath)
    return response.download(absolutePath)
  })
  .as('brands')
