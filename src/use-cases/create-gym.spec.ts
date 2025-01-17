import { beforeEach, describe, expect, it } from 'vitest'
import { CreateGymUseCase } from './create-gym'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let createGymUseCase: CreateGymUseCase

describe('Create gym use case', () => {
  beforeEach(() => {
    const gymsRepository = new InMemoryGymsRepository()
    createGymUseCase = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create a gym', async () => {
    const { gym } = await createGymUseCase.execute({
      phone: null,
      title: 'Gym',
      latitude: 0,
      longitude: 0,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
