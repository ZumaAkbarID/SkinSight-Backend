import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    await User.create({
      fullName: 'John Doe',
      email: 'jhondoe@gmail.com',
      password: await hash.make('password123'),
      emailVerifiedAt: DateTime.now(),
    })
  }
}
