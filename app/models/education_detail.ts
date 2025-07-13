import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeCreate,
  belongsTo,
  CamelCaseNamingStrategy,
  column,
} from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'
import Education from './education.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class EducationDetail extends BaseModel {
  static selfAssignPrimaryKey = true
  public static namingStrategy = new CamelCaseNamingStrategy()

  @column({ isPrimary: true })
  declare id: string

  @column({ serializeAs: null })
  declare educationId: string

  @column()
  declare markdown: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static assignUuid(educationDetail: EducationDetail) {
    educationDetail.id = randomUUID()
  }

  @belongsTo(() => Education)
  declare education: BelongsTo<typeof Education>
}
