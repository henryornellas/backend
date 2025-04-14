import { type Gym, Prisma } from '@prisma/client'
import type { FindManyNearbyProps, GymsRepository } from '../gyms-repository'
import { randomUUID } from 'node:crypto'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

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

  async searchMany(query: string, page: number = 1) {
    return this.items
      .filter(({ title }) => title.toLowerCase().includes(query.toLowerCase()))
      .slice((page - 1) * 20, page * 20)
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyProps) {
    return this.items.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude,
          longitude,
        },
        {
          latitude: Number(gym.latitude),
          longitude: Number(gym.longitude),
        },
      )

      return distance <= 10
    })
  }
}
