import type { CheckIn, Prisma } from '@prisma/client'

export interface CheckInsRepository {
  countByUserId(userId: string): Promise<number>
  save(checkIn: CheckIn): Promise<CheckIn>
  findById(checkInId: string): Promise<CheckIn | null>
  findCheckIns(userId: string, page?: number): Promise<CheckIn[]>
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
}
