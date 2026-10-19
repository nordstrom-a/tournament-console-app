import { RoundView } from './RoundView.js'

/**
 * Shows a round and asks the user for the result of each match in it.
 */
export class RoundPlayer {
  #io
  #roundView = new RoundView()

  /**
   * @param {import('./ConsoleIO.js').ConsoleIO} io - Used for all input and output.
   */
  constructor(io) {
    this.#io = io
  }

  /**
   * @param {import('tournament-scheduler').Round} round - The round to play. A result is recorded in each match.
   * @param {(answer: string) => { homeScore: number, awayScore: number }} parseResult - Converts an entered result,
   * throws InvalidInputError if it cannot be used.
   * @throws {import('./InputClosedError.js').InputClosedError} If the user closes the input.
   */
  async play(round, parseResult) {
    this.#io.print()
    this.#io.print(this.#roundView.format(round))
    this.#io.print('\nEnter the results, e.g. 2-1:')
    for (const match of round.getMatches()) {
      const { homeScore, awayScore } = await this.#io.askUntilValid(`  ${this.#roundView.formatMatch(match)}: `, parseResult)
      match.recordResult(homeScore, awayScore)
    }
  }
}
