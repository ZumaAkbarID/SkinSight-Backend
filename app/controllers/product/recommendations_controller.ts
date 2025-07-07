import { errorResponse, successResponse } from '#helpers/response'
import type { HttpContext } from '@adonisjs/core/http'

export default class RecommendationsController {
  async handle({ auth, response }: HttpContext) {
    const user = auth.user!
    await user.load('userDetail')

    if (!user.userDetail || !user.userDetail.skinType) {
      return response
        .status(400)
        .json(errorResponse('Please complete your assessment before using this feature', 400))
    }

    // dummy product list (hardcoded)
    const products = [
      {
        title: 'Avoskin Luminous Emultion Night Cream - Night ...',
        price: 'Rp109.000',
        description: 'Exp 08/2026 Avoskin Luminous Emulsion Night Cr...',
        imageUrl:
          'https://images.tokopedia.net/img/cache/500-square/VqbcmM/2023/12/16/65b0ab1e-67c2-4e33-a6dc-2786c963baf6.jpg',
        link: 'https://www.tokopedia.com/avoskinbandung/avoskin-luminous-emultion-night-cream-night-cream',
        type: 'Krim Wajah',
        brand: 'avoskin',
        ingredients: 'Aqua, Ethyl ascorbic acid, Ethylhexyl olivate, ...',
      },
      {
        title: 'Avoskin Buy Rana or Ruby Lip Balm Free Cushion',
        price: 'Rp189.000',
        description: '1. Lip balm dari Avoskin dengan melted-butter...',
        imageUrl:
          'https://images.tokopedia.net/img/cache/500-square/VqbcmM/2023/12/16/65b0ab1e-67c2-4e33-a6dc-2786c963baf6.jpg',
        link: 'https://www.tokopedia.com/avoskinbandung/avoskin-buy-rana-or-ruby-lip-balm-free-cushion',
        type: 'Buku Kecantikan',
        brand: 'avoskin',
        ingredients: 'Ingredients tidak ditemukan.',
      },
      {
        title: 'Lacoco Sunscreen Daily UV Counter SPF 50 PA+++',
        price: 'Rp79.000',
        description: 'Expired Date : 09/2027 Daily UV Counter SPF 50...',
        imageUrl:
          'https://images.tokopedia.net/img/cache/500-square/VqbcmM/2023/12/16/65b0ab1e-67c2-4e33-a6dc-2786c963baf6.jpg',
        link: 'https://www.tokopedia.com/avoskinbandung/lacoco-sunscreen-daily-uv-counter-spf-50-pa',
        type: 'Sunblock wajah',
        brand: 'avoskin',
        ingredients: '2% Niacinamide, Vit. C, Sunflower extract, dan ...',
      },
      {
        title: 'Avoskin Perfect Hydrating Treatment Essence (P...',
        price: 'Rp149.000',
        description: 'EXPIRED DATE 01/2027 Avoskin Perfect Hydrating...',
        imageUrl:
          'https://images.tokopedia.net/img/cache/500-square/VqbcmM/2023/12/16/65b0ab1e-67c2-4e33-a6dc-2786c963baf6.jpg',
        link: 'https://www.tokopedia.com/avoskinbandung/avoskin-perfect-hydrating-treatment-essence',
        type: 'Serum Wajah',
        brand: 'avoskin',
        ingredients: 'Ingredients tidak ditemukan.',
      },
      {
        title: 'Avoskin Miraculous Refining Serum - 30ml',
        price: 'Rp195.000',
        description: 'Exp Date : 08/2027 Miraculous Refining Serum F...',
        imageUrl:
          'https://images.tokopedia.net/img/cache/500-square/VqbcmM/2023/12/16/65b0ab1e-67c2-4e33-a6dc-2786c963baf6.jpg',
        link: 'https://www.tokopedia.com/avoskinbandung/avoskin-miraculous-refining-serum-30ml',
        type: 'Serum Wajah',
        brand: 'avoskin',
        ingredients: 'Water, Propylene Glycol, Glycolic Acid, Niacin...',
      },
    ]

    return response
      .status(200)
      .json(successResponse(products, 'Recommendations fetched successfully', 200))
  }
}
