import { expect, it, describe, beforeEach } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'
import { GymsRepository } from '@/repositories/gyms-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let gymsRepository: GymsRepository
let searchGymsUseCase: SearchGymsUseCase

describe('Fetch check-in history use case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    searchGymsUseCase = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for a gym', async () => {
    await gymsRepository.create({
      title: 'Local Gym',
      description: 'local gym',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    })
    await gymsRepository.create({
      title: 'Some random local gym',
      description: 'local gym',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    })
    await gymsRepository.create({
      title: 'Random name',
      description: 'local gym',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    })

    const { gyms } = await searchGymsUseCase.execute({ query: 'local gym' })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Local Gym' }),
      expect.objectContaining({ title: 'Some random local gym' }),
    ])
  })

  it('should be able to get paginated search for a gym', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Local Gym ${i}`,
        description: 'local gym',
        latitude: new Decimal(0),
        longitude: new Decimal(0),
      })
    }

    const { gyms } = await searchGymsUseCase.execute({
      query: 'local gym',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Local Gym 21' }),
      expect.objectContaining({ title: 'Local Gym 22' }),
    ])
  })
})
