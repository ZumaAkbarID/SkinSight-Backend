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

export default class UserDetail extends BaseModel {
  static selfAssignPrimaryKey = true
  public static namingStrategy = new CamelCaseNamingStrategy()

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare gender: string | null

  // @column.date()
  // declare dateOfBirth: DateTime | null

  @column()
  declare age: number | null

  // @computed()
  // public get age() {
  //   if (!this.dateOfBirth) return null

  //   return Math.floor(DateTime.now().diff(this.dateOfBirth, 'years').years)
  // }

  @column()
  declare skinType: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static assignUuid(user: UserDetail) {
    user.id = randomUUID()
  }

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
