import { successResponse } from '#helpers/response'
import type { HttpContext } from '@adonisjs/core/http'

export default class AdsController {
  async handle({ auth, response }: HttpContext) {
    const user = auth.user!
    await user.load('userDetail')

    if (!user.userDetail || !user.userDetail.skinType) {
      return response.status(400).json({
        status: 'error',
        message: 'Please complete your assessment before using this feature',
        code: 400,
      })
    }

    const ads = [
      {
        id: 'uuid-1',
        title: 'Diskon 30% Produk Avoskin',
        thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400',
        ctaText: 'Belanja Sekarang',
        ctaLink: 'https://tokopedia.link/avoskin',
        description:
          'Hanya minggu ini! Nikmati diskon 30% untuk produk skincare pilihan dari Avoskin.',
        brand: 'Avoskin',
      },
      {
        id: 'uuid-2',
        title: 'Free Ongkir Semua Produk',
        thumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
        ctaText: 'Cek Promo',
        ctaLink: 'https://tokopedia.link/promo-ongkir',
        description: 'Dapatkan gratis ongkir tanpa minimum pembelian untuk area Jabodetabek.',
        brand: 'Tokopedia',
      },
      {
        id: 'uuid-3',
        title: 'New! Sunscreen SPF 50++',
        thumbnail: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400',
        ctaText: 'Lihat Produk',
        ctaLink: 'https://tokopedia.link/sunscreenbaru',
        description:
          'Proteksi maksimal dari sinar UV dengan sunscreen baru, cocok untuk semua jenis kulit.',
        brand: 'Lacoco',
      },
    ]

    return response.status(200).json(successResponse(ads, 'Ads fetched successfully', 200))
  }
}
