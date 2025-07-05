import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'face_scans'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().notNullable()
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('scan_image').notNullable()
      table.decimal('dry', 5, 2)
      table.decimal('oily', 5, 2)
      table.decimal('normal', 5, 2)
      table.decimal('sensitivity', 5, 2)
      table.decimal('acne', 5, 2)
      table.string('predicted_label').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
