import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeCreate,
  CamelCaseNamingStrategy,
  column,
  computed,
  hasMany,
  hasOne,
} from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import UserDetail from './user_detail.js'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'
import FaceScan from './face_scan.js'
import ProductOcr from './product_ocr.js'

export default class User extends BaseModel {
  static selfAssignPrimaryKey = true
  public static namingStrategy = new CamelCaseNamingStrategy()

  @column({ isPrimary: true })
  declare id: string

  // @column({
  //   serialize: (value: string) => {
  //     if (value.length <= 15) return value

  //     const parts = value.trim().split(/\s+/)
  //     if (parts.length >= 2) {
  //       const combined = `${parts[0]} ${parts[1]}`
  //       if (combined.length <= 15) {
  //         return combined
  //       }
  //       return parts[0]
  //     }

  //     return parts[0]
  //   },
  // })
  @column()
  declare fullName: string

  @column()
  declare email: string

  @column()
  declare profilePicture: string | null

  @column({ serializeAs: null })
  declare password: string | null

  @column.dateTime()
  declare emailVerifiedAt: DateTime | null

  @computed()
  get isVerified(): boolean {
    return !!this.emailVerifiedAt
  }

  @computed()
  get hasPassword(): boolean {
    return !!this.password && this.password.length > 0
  }

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @beforeCreate()
  static assignUuid(user: User) {
    user.id = randomUUID()
  }

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    prefix: 'skinsight_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })

  @hasOne(() => UserDetail)
  declare userDetail: HasOne<typeof UserDetail>

  @computed()
  get isAssessmentCompleted(): boolean {
    return !!this.userDetail
  }

  @hasMany(() => FaceScan)
  declare faceScans: HasMany<typeof FaceScan>

  @hasMany(() => ProductOcr)
  declare productOcr: HasMany<typeof ProductOcr>
}
