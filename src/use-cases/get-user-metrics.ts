import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface GetUserMetricsProps {
  userId: string
}

interface GetUserMetricsResponse {
  checkInsCount: number
}

export class GetUserMetricsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetricsProps): Promise<GetUserMetricsResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId)

    return { checkInsCount }
  }
}
