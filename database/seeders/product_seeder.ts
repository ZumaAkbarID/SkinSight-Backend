import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { parse } from 'fast-csv'
import fs from 'fs'
import Product from '#models/product'
import app from '@adonisjs/core/services/app'

// function formatDescriptionToMarkdown(raw: string): string {
//   return raw
//     .replace(/\r\n|\r|\n/g, ' ') // gabungkan semua baris dulu
//     .replace(/([•\-–‣])\s*/g, '\n- ') // bullet point jadi markdown
//     .replace(/(\d+)\.\s*/g, '\n$1. ') // numbering jadi markdown
//     .replace(/(–|—)/g, '-') // normalisasi strip
//     .replace(/ {2,}/g, ' ') // hapus spasi berlebih
//     .replace(/\n\s*/g, '\n') // rapikan spasi setelah newline
//     .trim()
// }

export default class extends BaseSeeder {
  async run() {
    // const filePath = app.makePath('database/csv/beta.csv')
    const filePath = app.makePath('database/csv/skincare.csv')
    const stream = fs.createReadStream(filePath)

    const products: Partial<Product>[] = []

    const parser = stream.pipe(parse({ headers: true, ignoreEmpty: true }))

    console.log(`📥 Memulai impor data dari ${filePath}...`)

    for await (const row of parser) {
      if (!row['Title'] || !row['Price']) {
        console.warn(`⚠️  Baris dilewati karena tidak lengkap:`, row)
        continue
      }

      // const rawDescription = row['Description'] || ''
      // const markdownDescription = formatDescriptionToMarkdown(rawDescription)

      products.push({
        title: row['Title'],
        price: parseFloat(row['Price']),
        // description: markdownDescription,
        description: row['Description'] || '',
        imageUrl: row['Image URL'],
        link: row['Link'],
        type: row['Type'],
        brand: row['Brand'],
        ingredients: row['Ingredients'],
      })
    }

    await Product.query().delete()
    console.log(`🗑️ Menghapus data lama...`)

    await Product.createMany(products)

    console.log(`✅ Import selesai: ${products.length} data dimasukkan.`)
  }
}
