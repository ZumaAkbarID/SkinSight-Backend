/**
 *
 * WE DONT USE THIS ANYMORE
 * WE USE SCRAPING INSTEAD
 */

import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeCreate,
  CamelCaseNamingStrategy,
  column,
  hasOne,
} from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'
import EducationDetail from './education_detail.js'
import type { HasOne } from '@adonisjs/lucid/types/relations'

export default class Education extends BaseModel {
  static selfAssignPrimaryKey = true
  public static namingStrategy = new CamelCaseNamingStrategy()

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare title: string

  @column()
  declare category: string

  @column()
  declare thumbnail: string

  @column.dateTime({
    autoCreate: true,
    serializeAs: null,
  })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  declare updatedAt: DateTime

  @beforeCreate()
  static assignUuid(education: Education) {
    if (!education.id) {
      education.id = randomUUID()
    }
  }

  @hasOne(() => EducationDetail)
  declare detail: HasOne<typeof EducationDetail>
}
