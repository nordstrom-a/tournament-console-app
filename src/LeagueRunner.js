import { RoundRobinScheduler } from 'tournament-scheduler'

/**
 * Plays a league where every participant meets every other participant once.
 */
export class LeagueRunner {
  #roundPlayer
  #inputParser
  #scheduler = new RoundRobinScheduler()

  /**
   * @param {import('./RoundPlayer.js').RoundPlayer} roundPlayer - Plays each round.
   * @param {import('./InputParser.js').InputParser} inputParser - Validates the entered results.
   */
  constructor(roundPlayer, inputParser) {
    this.#roundPlayer = roundPlayer
    this.#inputParser = inputParser
  }

  /**
   * @param {import('tournament-scheduler').Participant[]} participants - At least two participants.
   * @throws {import('./InputClosedError.js').InputClosedError} If the user closes the input.
   */
  async run(participants) {
    for (const round of this.#scheduler.createRounds(participants)) {
      await this.#roundPlayer.play(round, answer => this.#inputParser.parseResult(answer))
    }
  }
}
