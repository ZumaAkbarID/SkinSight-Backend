import axios from 'axios'
import env from '#start/env'
import { convertToJakartaTime } from './time.js'

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

    const now = {
      time: convertToJakartaTime(data.now.time),
      uvi: data.now.uvi,
      level: classifyUVIndex(data.now.uvi),
    }

    const forecast = data.forecast.map((entry: any) => ({
      time: convertToJakartaTime(entry.time),
      uvi: entry.uvi,
      level: classifyUVIndex(entry.uvi),
    }))

    return {
      status: true,
      message: 'Successfully getting recommendations',
      api: {
        now,
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
