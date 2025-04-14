import { expect, it, describe, beforeEach } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'
import { GymsRepository } from '@/repositories/gyms-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { FetchNeabyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: GymsRepository
let fetchNearbyGymsUseCase: FetchNeabyGymsUseCase

describe('Fetch nearby gyms use case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    fetchNearbyGymsUseCase = new FetchNeabyGymsUseCase(gymsRepository)
  })

  it('should fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Gym',
      description: 'local gym',
      latitude: new Decimal(-18.6447265),
      longitude: new Decimal(-48.2099757),
    })

    await gymsRepository.create({
      title: 'Gym 2',
      description: 'local gym',
      latitude: new Decimal(-15.7637094),
      longitude: new Decimal(-49.6437488),
    })

    const { gyms } = await fetchNearbyGymsUseCase.execute({
      userLatitude: -18.6405092,
      userLongitude: -48.2020048,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Gym' })])
  })
})
