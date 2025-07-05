import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, CamelCaseNamingStrategy, column } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'

export default class Otp extends BaseModel {
  static selfAssignPrimaryKey = true
  public static namingStrategy = new CamelCaseNamingStrategy()

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare email: string

  @column()
  declare otp: string

  @column.dateTime()
  declare expiresAt: DateTime

  @column()
  declare isUsed: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static assignUuid(otp: Otp) {
    otp.id = randomUUID()
  }
}
