import type { Prisma, User } from '@prisma/client'
import type { UsersRepository } from '../users-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.items.push(user)

    return user
  }

  async findByEmail(email: string) {
    const user = this.items.find((e) => e.email === email)

    if (!user) return null

    return user
  }

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((e) => e.id === id)

    if (!user) return null

    return user
  }
}
