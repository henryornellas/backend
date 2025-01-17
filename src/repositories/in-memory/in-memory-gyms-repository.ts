import { type Gym, Prisma } from '@prisma/client'
import type { GymsRepository } from '../gyms-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id || randomUUID(),
      title: data.title,
      phone: data.phone || null,
      description: data.description || null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      createdAt: new Date(),
    }

    this.items.push(gym)

    return gym
  }

  async findById(id: string) {
    const gym = this.items.find((e) => e.id === id)

    if (!gym) return null

    return gym
  }
}
