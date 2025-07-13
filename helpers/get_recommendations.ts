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
      (item: any) => item.product_name
    )

    const productRecords = await Product.query()
      .whereIn('title', mappedRecommendationsName)
      .select(['id', 'title'])

    const titleToIdMap = productRecords.reduce(
      (acc, curr) => {
        acc[curr.title] = curr.id
        return acc
      },
      {} as Record<string, string>
    )

    const mappedRecommendations = apiRes.data.recommendations.map((item: any) => ({
      id: titleToIdMap[item.product_name] ?? null,
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
