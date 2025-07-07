import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'product_ocrs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('scan_image').notNullable()
      table.json('extracted_ingredients')
      table.json('harmful_ingredients_found')
      table.boolean('is_safe').defaultTo(true)
      table.integer('total_harmful_ingredients').defaultTo(0)
      table.string('skin_type').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
