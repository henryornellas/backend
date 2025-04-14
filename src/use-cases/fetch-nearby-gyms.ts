import type { Gym } from '@prisma/client'
import type { GymsRepository } from '@/repositories/gyms-repository'

interface FetchNearbyGymsProps {
  userLatitude: number
  userLongitude: number
}

interface FetchNearbyGymsResponse {
  gyms: Gym[]
}

export class FetchNeabyGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearbyGymsProps): Promise<FetchNearbyGymsResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return { gyms }
  }
}
