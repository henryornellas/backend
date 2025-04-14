import { expect, it, describe, beforeEach, vi, afterEach } from 'vitest'
import type { CheckInsRepository } from '@/repositories/check-ins-repository'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

let checkInsRepository: CheckInsRepository
let validateCheckInUseCase: ValidateCheckInUseCase

describe('Validate check-in use case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    validateCheckInUseCase = new ValidateCheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate the check-in', async () => {
    const newCheckIn = await checkInsRepository.create({
      gym_id: '1',
      user_id: '1',
    })

    const { checkIn } = await validateCheckInUseCase.execute({
      checkInId: newCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate inexistent check-in', async () => {
    await expect(() =>
      validateCheckInUseCase.execute({ checkInId: '' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to validate check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2025, 3, 1, 13, 40))

    const newCheckIn = await checkInsRepository.create({
      gym_id: '1',
      user_id: '1',
    })

    const THIRTY_MINUTES = 1000 * 60 * 30

    vi.advanceTimersByTime(THIRTY_MINUTES)

    await expect(() =>
      validateCheckInUseCase.execute({ checkInId: newCheckIn.id }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
