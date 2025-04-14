export class LateCheckInValidationError extends Error {
  constructor() {
    super('Validation expires 20 minutes after creation.')
  }
}
