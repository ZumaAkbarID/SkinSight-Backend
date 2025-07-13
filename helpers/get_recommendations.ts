import axios from 'axios'
import env from '#start/env'
import Product from '#models/product'

export async function getProductRecommendations(skinType: string) {
  try {
    const apiRes = await axios.post(
      `${env.get('ML_URL')}/get-recommendations`,
      {
        skin_type: skinType,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    )

    const mappedRecommendationsName = apiRes.data.recommendations.map(
      (rec: any) => rec.product_name
    )

    const recommendations = await Product.query()
      .whereIn('title', mappedRecommendationsName)
      .orderBy('price', 'asc')

    return {
      status: true,
      message: 'Successfully getting recommendations',
      ml: recommendations,
    }
  } catch (err: any) {
    console.error('Error saat menghubungi ML API:', err)

    const apiMessage = err.response?.data?.detail || 'Failed to call ML API'

    return {
      status: false,
      message: apiMessage,
      ml: null,
    }
  }
}
