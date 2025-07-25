import * as fs from 'node:fs'
import app from '@adonisjs/core/services/app'
import axios from 'axios'
import { cuid } from '@adonisjs/core/helpers'
import env from '#start/env'

/**
 * Upload image ke storage, kirim ke ML API, dan return hasil ML + nama file
 * @param {import('@vinejs/vine').File} scanImage - File VineJS
 * @returns {Promise<{status: boolean, message: string, ml: any | null, fileName: string | null}>}
 */
export async function processFaceScan(scanImage: any) {
  const newName = `${cuid()}.${scanImage.extname}`
  const destPath = app.makePath('uploads/scan_faces')

  try {
    await scanImage.move(destPath, {
      name: newName,
      overwrite: true,
    })
  } catch (err) {
    return {
      status: false,
      message: 'Failed to save image to server',
      ml: null,
      fileName: null,
    }
  }

  const FormData = (await import('form-data')).default
  const formData = new FormData()
  formData.append('file', fs.createReadStream(`${destPath}/${newName}`), newName)

  if (env.get('BYPASS_FACE_SCAN')) {
    // bypass
    return {
      status: true,
      message: 'Bypass mode active',
      ml: {
        dry: 0.2,
        oily: 0.5,
        normal: 0.3,
        predicted_label: 'oily',
      },
      fileName: newName,
    }
  }

  try {
    const apiRes = await axios.post(`${env.get('ML_URL')}/predict-skin`, formData, {
      headers: formData.getHeaders(),
    })

    if (!apiRes.data || !apiRes.data.predicted_label) {
      return {
        status: false,
        message: "ML API doesn't recognize the image",
        ml: null,
        fileName: newName,
      }
    }

    return {
      status: true,
      message: 'Successfully processed face scan',
      ml: apiRes.data,
      fileName: newName,
    }
  } catch (err: any) {
    console.error('Error saat menghubungi ML API:', err)

    const apiMessage = err.response?.data?.detail || 'Failed to call ML API'

    return {
      status: false,
      message: apiMessage,
      ml: null,
      fileName: newName,
    }
  }
}
