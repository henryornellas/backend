import { expect, it, describe, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists'

let registerUseCase: RegisterUseCase

describe('Register use case', () => {
  beforeEach(() => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    registerUseCase = new RegisterUseCase(inMemoryUsersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await registerUseCase.execute({
      name: 'Seila',
      email: 'email@hotmail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await registerUseCase.execute({
      name: 'Seila',
      email: 'email@hotmail.com',
      password: '123456',
    })

    const isPasswordCorrect = await compare('123456', user.password_hash)

    expect(isPasswordCorrect).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'email@hotmail.com'

    await registerUseCase.execute({
      name: 'Seila',
      email,
      password: '123456',
    })

    await expect(() =>
      registerUseCase.execute({
        name: 'Seila',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
