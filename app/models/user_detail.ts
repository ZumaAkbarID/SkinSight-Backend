import { DateTime } from 'luxon'
import { BaseModel, column, computed } from '@adonisjs/lucid/orm'

export default class UserDetail extends BaseModel {
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

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
