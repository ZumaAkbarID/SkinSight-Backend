import * as fs from 'node:fs'
import app from '@adonisjs/core/services/app'
import axios from 'axios'
import { cuid } from '@adonisjs/core/helpers'
import env from '#start/env'
import camelcaseKeys from 'camelcase-keys'

/**
 * Upload image ke storage, kirim ke ML OCR Ingredients API,
 * dan return hasil ML + nama file (keys auto camelCase)
 *
 * @param {import('@vinejs/vine').File} scanImage - File VineJS
 * @param {string} skinType
 * @returns {Promise<{status: boolean, message: string, ml: any | null, fileName: string | null}>}
 */
export async function processIngredientsOcr(scanImage: any, skinType: string) {
  const newName = `${cuid()}.${scanImage.extname}`
  const destPath = app.makePath('uploads/ingredients_ocr')

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
  formData.append('skin_type', skinType)

  if (env.get('BYPASS_INGREDIENTS_OCR')) {
    // bypass
    return {
      status: true,
      message: 'Bypass mode active',
      ml: camelcaseKeys(
        {
          extracted_ingredients: ['Water', 'Glycerin', 'Panthenol'],
          harmful_ingredients_found: [
            { name: 'Stearic Acid', reason: 'May worsen clogged pores if not well balanced.' },
          ],
          is_safe: false,
          total_harmful_ingredients: 1,
        },
        { deep: true }
      ),
      fileName: newName,
    }
  }

  try {
    const apiRes = await axios.post(`${env.get('ML_URL')}/read-ingredients`, formData, {
      headers: formData.getHeaders(),
    })

    if (!apiRes.data || !apiRes.data.extracted_ingredients) {
      return {
        status: false,
        message: "ML API doesn't recognize the image",
        ml: null,
        fileName: newName,
      }
    }

    return {
      status: true,
      message: 'Successfully processed ingredients OCR',
      ml: camelcaseKeys(apiRes.data, { deep: true }),
      fileName: newName,
    }
  } catch (err: any) {
    console.error('Error saat menghubungi ML API:', err)
    const apiMessage =
      err.response?.data?.detail || err.response?.data?.message || 'Failed to call ML API'

    return {
      status: false,
      message: apiMessage,
      ml: null,
      fileName: newName,
    }
  }
}
