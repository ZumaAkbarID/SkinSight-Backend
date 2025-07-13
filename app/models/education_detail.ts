import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeCreate,
  belongsTo,
  CamelCaseNamingStrategy,
  column,
  computed,
} from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'
import Education from './education.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class EducationDetail extends BaseModel {
  static selfAssignPrimaryKey = true
  public static namingStrategy = new CamelCaseNamingStrategy()

  @column({ isPrimary: true, serializeAs: null })
  declare id: string

  @column({ serializeAs: null })
  declare educationId: string

  @column()
  declare markdown: string

  @computed()
  get readTime(): string {
    const words = this.markdown?.split(/\s+/).length ?? 0
    const minutes = Math.ceil(words / 200)
    return minutes <= 1 ? '< 1 min read' : `${minutes} min read`
  }

  @column.dateTime({
    autoCreate: true,
    serialize: (value: DateTime) => {
      return value.toFormat('dd LLLL yyyy')
    },
  })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  declare updatedAt: DateTime

  @beforeCreate()
  static assignUuid(educationDetail: EducationDetail) {
    if (!educationDetail.id) {
      educationDetail.id = randomUUID()
    }
  }

  @belongsTo(() => Education)
  declare education: BelongsTo<typeof Education>
}
