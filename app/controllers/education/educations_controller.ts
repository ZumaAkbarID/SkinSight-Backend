import { errorResponse, successResponse } from '#helpers/response'
import type { HttpContext } from '@adonisjs/core/http'

export default class EducationsController {
  async handle({ auth, response }: HttpContext) {
    const user = auth.user!
    await user.load('userDetail')

    if (!user.userDetail || !user.userDetail.skinType) {
      return response
        .status(400)
        .json(errorResponse('Please complete your assessment before using this feature', 400))
    }

    // dummy education list (hardcoded)
    const educations = [
      {
        id: 'uuid-1',
        title: 'Perawatan Kulit Berjerawat',
        category: 'Acne',
        thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400',
      },
      {
        id: 'uuid-2',
        title: 'Cara Memilih Sunscreen yang Tepat',
        category: 'Sunscreen',
        thumbnail: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400',
      },
      {
        id: 'uuid-3',
        title: 'Mengenal Ingredients Berbahaya',
        category: 'Ingredients',
        thumbnail: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400',
      },
      {
        id: 'uuid-4',
        title: 'Langkah Dasar Skincare untuk Pemula',
        category: 'Skincare Dasar',
        thumbnail: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400',
      },
      {
        id: 'uuid-5',
        title: 'Perbedaan Toner dan Essence',
        category: 'Produk Skincare',
        thumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
      },
    ]

    return response
      .status(200)
      .json(successResponse(educations, 'Educations fetched successfully', 200))
  }
}
