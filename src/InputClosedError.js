/**
 * Thrown when the user closes the input, e.g. with Ctrl+D, so no more answers can be read.
 */
export class InputClosedError extends Error {
  constructor() {
    super('The input was closed.')
    this.name = 'InputClosedError'
  }
}
