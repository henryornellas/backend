import type { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface FetchUserCheckInHistoryProps {
  userId: string
  page?: number
}

interface FetchUserCheckInHistoryResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckInHistoryProps): Promise<FetchUserCheckInHistoryResponse> {
    const checkIns = await this.checkInsRepository.findCheckIns(userId, page)

    return { checkIns }
  }
}
