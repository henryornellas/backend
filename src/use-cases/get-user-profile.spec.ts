import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetUserProfileUseCase } from './get-user-profile'
import type { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { ResourceNotFoundError } from './errors/resource-not-found'

let usersRepository: UsersRepository
let getUserProfileUseCase: GetUserProfileUseCase

describe('Get user profile use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    getUserProfileUseCase = new GetUserProfileUseCase(usersRepository)
  })

  it('should get user profile', async () => {
    const newUser = await usersRepository.create({
      name: 'Henry',
      email: 'henry@email.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await getUserProfileUseCase.execute({ userId: newUser.id })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not get user profile with wrong id', async () => {
    await expect(() =>
      getUserProfileUseCase.execute({
        userId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
