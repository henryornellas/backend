import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { GetUserMetricsUseCase } from './get-user-metrics'

let getUserMetricsUseCase: GetUserMetricsUseCase
let checkInsRepository: CheckInsRepository

describe('Get user metrics use case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    getUserMetricsUseCase = new GetUserMetricsUseCase(checkInsRepository)
  })

  it('should be able to get check-ins count from user metrics', async () => {
    await checkInsRepository.create({ gym_id: '1', user_id: '1' })
    await checkInsRepository.create({ gym_id: '2', user_id: '1' })

    const { checkInsCount } = await getUserMetricsUseCase.execute({
      userId: '1',
    })

    expect(checkInsCount).toEqual(2)
  })
})
