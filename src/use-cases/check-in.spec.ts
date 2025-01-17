import { expect, it, describe, beforeEach, vi, afterEach } from 'vitest'
import type { CheckInsRepository } from '@/repositories/check-ins-repository'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let gymsRepository: InMemoryGymsRepository
let checkInsRepository: CheckInsRepository
let checkInsUseCase: CheckInUseCase

describe('Check-in use case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    checkInsRepository = new InMemoryCheckInsRepository()

    checkInsUseCase = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: '1',
      title: '',
      phone: null,
      latitude: 0,
      longitude: 0,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    vi.setSystemTime(new Date(2024, 0, 9, 8))

    const { checkIn } = await checkInsUseCase.execute({
      gymId: '1',
      userId: '1',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  // TDD -> Red; Green, Refactor

  it('should not be able to check in twice a day', async () => {
    vi.setSystemTime(new Date(2024, 0, 9, 8))

    await checkInsUseCase.execute({
      gymId: '1',
      userId: '1',
      userLatitude: 0,
      userLongitude: 0,
    })

    await expect(() =>
      checkInsUseCase.execute({
        gymId: '1',
        userId: '1',
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2024, 0, 9, 8))

    await checkInsUseCase.execute({
      gymId: '1',
      userId: '1',
      userLatitude: 0,
      userLongitude: 0,
    })

    vi.setSystemTime(new Date(2024, 0, 10, 8))

    const { checkIn } = await checkInsUseCase.execute({
      gymId: '1',
      userId: '1',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.create({
      id: '2',
      title: '',
      phone: null,
      latitude: new Decimal(30),
      longitude: new Decimal(50),
    })

    await expect(() =>
      checkInsUseCase.execute({
        gymId: '2',
        userId: '1',
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
