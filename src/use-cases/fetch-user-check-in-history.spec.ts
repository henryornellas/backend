import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { FetchUserCheckInHistoryUseCase } from './fetch-user-check-in-history'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

let fetchHistoryUseCase: FetchUserCheckInHistoryUseCase
let checkInsRepository: CheckInsRepository

describe('Fetch check-in history use case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    fetchHistoryUseCase = new FetchUserCheckInHistoryUseCase(checkInsRepository)
  })

  it('should be able to fetch check-in history', async () => {
    await checkInsRepository.create({ gym_id: '1', user_id: '1' })
    await checkInsRepository.create({ gym_id: '2', user_id: '1' })

    const { checkIns } = await fetchHistoryUseCase.execute({ userId: '1' })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: '1' }),
      expect.objectContaining({ gym_id: '2' }),
    ])
  })

  it('should be able to fetch paginated check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({ gym_id: i.toString(), user_id: '1' })
    }

    const { checkIns } = await fetchHistoryUseCase.execute({
      userId: '1',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: '21' }),
      expect.objectContaining({ gym_id: '22' }),
    ])
  })
})
