/**
 * Thrown when the user's answer cannot be used. The message is shown to the user.
 */
export class InvalidInputError extends Error {
  /**
   * @param {string} message - Explains to the user what a valid answer looks like.
   */
  constructor(message) {
    super(message)
    this.name = 'InvalidInputError'
  }
}
