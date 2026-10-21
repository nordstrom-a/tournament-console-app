import { SingleEliminationScheduler } from 'tournament-scheduler'
import { BracketView } from './BracketView.js'

/**
 * Plays a knockout cup where the winner of each match advances until a champion is decided.
 */
export class CupRunner {
  #io
  #roundPlayer
  #inputParser

  /**
   * @param {import('./ConsoleIO.js').ConsoleIO} io - Used for all output.
   * @param {import('./RoundPlayer.js').RoundPlayer} roundPlayer - Plays each round.
   * @param {import('./InputParser.js').InputParser} inputParser - Validates the entered results.
   */
  constructor(io, roundPlayer, inputParser) {
    this.#io = io
    this.#roundPlayer = roundPlayer
    this.#inputParser = inputParser
  }

  /**
   * Plays round after round until the final is played, then shows the bracket and the champion.
   *
   * @param {import('tournament-scheduler').Participant[]} participants - At least two participants, in bracket order.
   * @throws {import('./InputClosedError.js').InputClosedError} If the user closes the input.
   */
  async run(participants) {
    const scheduler = new SingleEliminationScheduler()
    const rounds = [scheduler.createFirstRound(participants)]
    await this.#playRound(rounds.at(-1))

    while (!scheduler.isComplete()) {
      rounds.push(scheduler.createNextRound())
      await this.#playRound(rounds.at(-1))
    }
    this.#showBracket(rounds)
    this.#io.print(`\n${scheduler.getChampion().getName()} wins the cup!`)
  }

  async #playRound(round) {
    await this.#roundPlayer.play(round, answer => this.#inputParser.parseDecisiveResult(answer))
  }

  #showBracket(rounds) {
    this.#io.print('\nThe bracket:')
    this.#io.print(new BracketView(rounds).format())
  }
}
