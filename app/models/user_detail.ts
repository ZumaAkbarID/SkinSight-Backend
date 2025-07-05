import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, computed } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'

export default class UserDetail extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare gender: string | null

  @column.date({
    serialize: (value) => (value ? value.toFormat('yyyy-MM-dd') : null),
  })
  declare dateOfBirth: DateTime | null

  @computed()
  public get age() {
    if (!this.dateOfBirth) return null

    const now = DateTime.now()
    let age = now.year - this.dateOfBirth.year

    // Check if birthday has occurred this year
    if (
      now.month < this.dateOfBirth.month ||
      (now.month === this.dateOfBirth.month && now.day < this.dateOfBirth.day)
    ) {
      age--
    }
    return age
  }

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
