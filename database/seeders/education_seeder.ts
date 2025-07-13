import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { parse } from 'fast-csv'
import fs from 'fs'
import Education from '#models/education'
import app from '@adonisjs/core/services/app'
import { randomUUID } from 'node:crypto'
import EducationDetail from '#models/education_detail'

export default class extends BaseSeeder {
  async run() {
    const filePath = app.makePath('database/csv/educations.csv')
    const stream = fs.createReadStream(filePath)

    const educations: Partial<Education>[] = []
    const educationDetail: Partial<EducationDetail>[] = []

    const parser = stream.pipe(parse({ headers: false, skipRows: 16, ignoreEmpty: true }))

    console.log(`📥 Memulai impor data dari ${filePath}...`)

    for await (const row of parser) {
      if (row.length >= 5) {
        const randomUuid = randomUUID()

        educations.push({
          id: randomUuid,
          title: row[1],
          category: row[2],
          thumbnail: row[3],
        })

        educationDetail.push({
          id: randomUUID(),
          educationId: randomUuid,
          markdown: row[4],
        })
      }
    }

    await Education.query().delete()
    console.log(`🗑️ Menghapus data lama dari tabel 'educations'...`)
    await EducationDetail.query().delete()
    console.log(`🗑️ Menghapus data lama dari tabel 'education_details'...`)

    try {
      await Education.createMany(educations)
      console.log(`✅ Data berhasil diimpor ke tabel 'educations'.`)

      await EducationDetail.createMany(educationDetail)
      console.log(`✅ Data berhasil diimpor ke tabel 'education_details'.`)
    } catch (error) {
      console.error('❌ Gagal mengimpor data:', error)
    }
  }
}
