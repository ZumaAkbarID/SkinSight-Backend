import axios from 'axios'
import env from '#start/env'

export type N8NDto = {
  userId: string
  fullName: string
  age: number
  skinType: string
  message: string
}

export async function sendMessage(data: N8NDto) {
  try {
    const apiRes = await axios.post(
      `${env.get('N8N_URL')}/webhook/skinsight`,
      {
        ...data,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    )

    return {
      status: true,
      message: 'Successfully sent message to N8N',
      api: apiRes.data,
    }
  } catch (err: any) {
    console.error('Error saat menghubungi N8N API:', err)

    const apiMessage = err.response?.data?.detail || 'Failed to call N8N API'

    return {
      status: false,
      message: apiMessage,
      api: null,
    }
  }
}
