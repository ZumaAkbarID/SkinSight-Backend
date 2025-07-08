import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table.string('title', 512)
      table.decimal('price', 15, 2)
      table.text('description')
      table.text('image_url')
      table.text('link')
      table.string('type', 100)
      table.string('brand', 100)
      table.text('ingredients')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
