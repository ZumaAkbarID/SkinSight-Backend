import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeCreate,
  belongsTo,
  CamelCaseNamingStrategy,
  column,
} from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'

export default class FaceScan extends BaseModel {
  static selfAssignPrimaryKey = true
  public static namingStrategy = new CamelCaseNamingStrategy()

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare scanImage: string

  @column()
  declare dry: number | null

  @column()
  declare oily: number | null

  @column()
  declare normal: number | null

  @column()
  declare sensitivity: number | null

  @column()
  declare acne: number | null

  @column()
  declare predictedLabel: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static assignId(faceScan: FaceScan) {
    faceScan.id = randomUUID()
  }

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
