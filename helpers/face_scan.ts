import * as fs from 'node:fs'
import app from '@adonisjs/core/services/app'
import axios from 'axios'
import { cuid } from '@adonisjs/core/helpers'
import env from '#start/env'

/**
 * Upload image ke storage, kirim ke ML API, dan return hasil ML + nama file
 * @param {import('@vinejs/vine').File} scanImage - File VineJS
 * @returns {Promise<{ml: any, fileName: string}>}
 */
export async function processFaceScan(scanImage: any) {
  const newName = `${cuid()}.${scanImage.extname}`
  const destPath = app.makePath('uploads/scan_faces')

  await scanImage.move(destPath, {
    name: newName,
    overwrite: true,
  })

  const FormData = (await import('form-data')).default
  const formData = new FormData()
  formData.append('image', fs.createReadStream(`${destPath}/${newName}`), newName)

  let apiRes: any

  // if (env.get('NODE_ENV') !== 'development') {
  //   apiRes = await axios.post('https://ml-service-url/skin-type', formData, {
  //     headers: formData.getHeaders(),
  //   })

  //   if (!apiRes.data || !apiRes.data.predicted_label) {
  //     throw new Error('ML service failed')
  //   }
  // } else {
  // simulasi ML
  apiRes = {
    data: {
      dry: 0.2,
      oily: 0.5,
      normal: 0.3,
      predicted_label: 'oily',
    },
  }
  // }

  return { ml: apiRes.data, fileName: newName }
}
