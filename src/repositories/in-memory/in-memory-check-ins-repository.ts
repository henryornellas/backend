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

  async findCheckIns(userId: string, page: number = 1) {
    const userCheckIns = this.items.filter(({ user_id }) => user_id === userId)

    const paginated = userCheckIns.slice((page - 1) * 20, page * 20)

    return paginated
  }

  async countByUserId(userId: string) {
    return this.items.filter(({ user_id }) => user_id === userId).length
  }

  async findById(checkInId: string) {
    const foundCheckIn = this.items.find(({ id }) => id === checkInId)

    if (!foundCheckIn) return null

    return foundCheckIn
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.items.findIndex(({ id }) => id === checkIn.id)

    if (checkInIndex >= 0) {
      this.items[checkInIndex].validated_at = new Date()
    }

    return checkIn
  }
}
