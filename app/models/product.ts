import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeCreate,
  CamelCaseNamingStrategy,
  column,
  computed,
} from '@adonisjs/lucid/orm'
import { randomUUID } from 'crypto'
import router from '@adonisjs/core/services/router'
import stringHelpers from '@adonisjs/core/helpers/string'

export default class Product extends BaseModel {
  static selfAssignPrimaryKey = true
  public static namingStrategy = new CamelCaseNamingStrategy()

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare title: string

  @column({ serialize: (value: number) => new Intl.NumberFormat('id-ID').format(value) })
  declare price: number

  @column()
  declare description: string

  @column()
  declare imageUrl: string

  @computed({ serializeAs: 'brandImageUrl' })
  get brandImageUrl() {
    return router
      .builder()
      .params([`${stringHelpers.slug(this.brand.toLowerCase())}.jpg`])
      .make('brands')
  }

  @column()
  declare link: string

  @column()
  declare type: string

  @column()
  declare brand: string

  @column()
  declare ingredients: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static assignId(product: Product) {
    product.id = randomUUID()
  }
}
