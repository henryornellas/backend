import type { CheckIn, Prisma } from '@prisma/client'
import type { CheckInsRepository } from '../check-ins-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      created_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
    }

    this.items.push(checkIn)

    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const userCheckIn = this.items.find(
      ({ user_id, created_at }) =>
        user_id === userId && created_at.toDateString() === date.toDateString(),
    )

    if (!userCheckIn) {
      return null
    }

    return userCheckIn
  }
}
