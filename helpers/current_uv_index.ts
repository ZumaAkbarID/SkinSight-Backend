import axios from 'axios'
import env from '#start/env'
import { convertToJakartaTime } from './time.js'
import Product from '#models/product'

/**
 * Clasification of UV Index
 * https://en.wikipedia.org/wiki/Ultraviolet_index
 */
function classifyUVIndex(uvIndex: number): string {
  if (uvIndex <= 2) return 'Low'
  else if (uvIndex <= 5) return 'Moderate'
  else if (uvIndex <= 7) return 'High'
  else if (uvIndex <= 10) return 'Very High'
  else if (uvIndex > 10) return 'Extreme'
  else return 'Unknown'
}

function getUVRecommendation(uvIndex: number): { spfMin: number; description: string } {
  if (uvIndex <= 0) {
    return { spfMin: 0, description: 'Safe to be outside without sunscreen.' }
  } else if (uvIndex <= 2) {
    return { spfMin: 15, description: 'Low risk, consider SPF 15 for prolonged sun exposure.' }
  } else if (uvIndex <= 5) {
    return { spfMin: 30, description: 'Apply at least SPF 30 and seek shade during midday hours.' }
  } else if (uvIndex <= 7) {
    return {
      spfMin: 30,
      description: 'Wear SPF 30+, a hat, and sunglasses, reduce time in the sun.',
    }
  } else if (uvIndex <= 10) {
    return {
      spfMin: 50,
      description: 'Use SPF 50+, wear protective clothing, and limit sun exposure.',
    }
  } else if (uvIndex > 10) {
    return {
      spfMin: 50,
      description: 'Extreme risk!, Use SPF 50+, cover up, and avoid the sun if possible.',
    }
  } else {
    return {
      spfMin: 50,
      description: 'SUPER EXTREME RISK: Use SPF 50+, cover up, and avoid the sun if possible.',
    }
  }
}

export async function getCurrentUVIndex(long: string, lat: string) {
  try {
    const apiRes = await axios.get(`${env.get('API_UV_URL')}?latitude=${lat}&longitude=${long}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    if (apiRes.status !== 200) {
      throw new Error(`Failed to fetch data: ${apiRes.statusText}`)
    }

    const data = apiRes.data

    const recommendations = getUVRecommendation(data.now.uvi)

    const now = {
      time: convertToJakartaTime(data.now.time),
      uvi: data.now.uvi,
      level: classifyUVIndex(data.now.uvi),
      recommendation: recommendations.description,
    }

    const forecast = data.forecast.map((entry: any) => ({
      time: convertToJakartaTime(entry.time),
      uvi: entry.uvi,
      level: classifyUVIndex(entry.uvi),
    }))

    const products = await Product.query().whereIn('type', ['Sunblock', 'Sunscreen'])

    const filtered = products
      .filter((product) => {
        const match = product.title.match(/spf\s*(\d+)/i)
        if (!match) return false

        const spfValue = parseInt(match[1])
        return spfValue >= recommendations.spfMin
      })
      .slice(0, 8)

    return {
      status: true,
      message: 'Successfully getting recommendations',
      api: {
        now,
        recommendationProducts: filtered,
        forecast,
      },
    }
  } catch (err: any) {
    console.error('Error saat menghubungi API UV:', err)

    const apiMessage = err.response?.data?.detail || 'Failed to call API UV'

    return {
      status: false,
      message: apiMessage,
      api: null,
    }
  }
}
