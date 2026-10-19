import { InvalidInputError } from './InvalidInputError.js'

/**
 * Converts the user's answers into values the app can use.
 */
export class InputParser {
  #minParticipants = 2
  #maxParticipants = 32

  /**
   * @param {string} answer - '1' for a league or '2' for a cup.
   * @returns {'league' | 'cup'} The chosen tournament format.
   * @throws {InvalidInputError} If the answer is neither '1' nor '2'.
   */
  parseFormat(answer) {
    if (answer === '1') {
      return 'league'
    }
    if (answer === '2') {
      return 'cup'
    }
    throw new InvalidInputError('Please enter 1 or 2.')
  }

  /**
   * @param {string} answer - The number of participants.
   * @returns {number} The number of participants.
   * @throws {InvalidInputError} If the answer is not a whole number within the allowed range.
   */
  parseParticipantCount(answer) {
    const count = this.#parseWholeNumber(answer)
    if (count === null || count < this.#minParticipants || count > this.#maxParticipants) {
      throw new InvalidInputError(`Please enter a whole number from ${this.#minParticipants} to ${this.#maxParticipants}.`)
    }
    return count
  }

  /**
   * @param {string} answer - The participant's name.
   * @param {string[]} takenNames - The names already entered.
   * @returns {string} The name.
   * @throws {InvalidInputError} If the name is empty or already taken (case-insensitive).
   */
  parseParticipantName(answer, takenNames) {
    if (answer === '') {
      throw new InvalidInputError('The name cannot be empty.')
    }
    if (takenNames.some(name => name.toLowerCase() === answer.toLowerCase())) {
      throw new InvalidInputError(`"${answer}" is already taken. Please enter another name.`)
    }
    return answer
  }

  /**
   * @param {string} answer - The result as "home-away", e.g. "2-1".
   * @returns {{ homeScore: number, awayScore: number }} The scores.
   * @throws {InvalidInputError} If the answer is not two whole numbers separated by a dash.
   */
  parseResult(answer) {
    const scores = answer.match(/^(\d+)\s*-\s*(\d+)$/)
    if (scores === null) {
      throw new InvalidInputError('Please enter the result as two whole numbers, e.g. 2-1.')
    }
    return { homeScore: Number(scores[1]), awayScore: Number(scores[2]) }
  }

  /**
   * Like parseResult, but for matches that must have a winner.
   *
   * @param {string} answer - The result as "home-away", e.g. "2-1".
   * @returns {{ homeScore: number, awayScore: number }} The scores.
   * @throws {InvalidInputError} If the answer is invalid or a draw.
   */
  parseDecisiveResult(answer) {
    const result = this.parseResult(answer)
    if (result.homeScore === result.awayScore) {
      throw new InvalidInputError('A cup match must have a winner. Please enter a result that is not a draw.')
    }
    return result
  }

  #parseWholeNumber(answer) {
    return /^\d+$/.test(answer) ? Number(answer) : null
  }
}
