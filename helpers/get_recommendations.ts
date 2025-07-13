import axios from 'axios'
import env from '#start/env'

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

    const mappedRecommendations = apiRes.data.recommendations.map((item: any) => ({
      productName: item.product_name,
      productImage: item.product_image,
      productLink: item.product_link,
      price: new Intl.NumberFormat('id-ID').format(item.price),
      matchReason: item.match_reason,
    }))

    return {
      status: true,
      message: 'Successfully getting recommendations',
      ml: mappedRecommendations,
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
