import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let authenticateUseCase: AuthenticateUseCase
let usersRepository: InMemoryUsersRepository

describe('Authenticate use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    authenticateUseCase = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'Seila',
      email: 'henry@hotmail.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await authenticateUseCase.execute({
      email: 'henry@hotmail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      authenticateUseCase.execute({
        email: 'henry@hotmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'Seila',
      email: 'henry@hotmail.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      authenticateUseCase.execute({
        email: 'henry@hotmail.com',
        password: '1',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
