import type { Gym } from '@prisma/client'
import type { GymsRepository } from '@/repositories/gyms-repository'

interface CreateGymUseCaseProps {
  title: string
  description?: string | null
  phone: string | null
  latitude: number
  longitude: number
}

interface CreateGymUseCaseResponse {
  gym: Gym
}

export class CreateGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    phone,
    title,
    latitude,
    longitude,
    description,
  }: CreateGymUseCaseProps): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      phone,
      title,
      latitude,
      longitude,
      description,
    })

    return { gym }
  }
}
