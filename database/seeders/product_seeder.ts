import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { parse } from 'fast-csv'
import fs from 'fs'
import Product from '#models/product'
import app from '@adonisjs/core/services/app'

export default class extends BaseSeeder {
  async run() {
    const filePath = app.makePath('database/csv/beta.csv')
    const stream = fs.createReadStream(filePath)

    const products: Partial<Product>[] = []

    const parser = stream.pipe(parse({ headers: true, ignoreEmpty: true }))

    for await (const row of parser) {
      products.push({
        title: row['Title'],
        price: parseFloat(row['Price']),
        description: row['Description'],
        imageUrl: row['Image URL'],
        link: row['Link'],
        type: row['Type'],
        brand: row['Brand'],
        ingredients: row['Ingredients'],
      })
    }

    await Product.createMany(products)

    console.log(`✅ Import selesai: ${products.length} data dimasukkan.`)
  }
}
