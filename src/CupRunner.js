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

    while (!this.#isFinal(rounds.at(-1))) {
      rounds.push(scheduler.createNextRound())
      await this.#playRound(rounds.at(-1))
    }
    this.#showBracket(rounds)
    this.#showChampion(rounds.at(-1))
  }

  async #playRound(round) {
    await this.#roundPlayer.play(round, answer => this.#inputParser.parseDecisiveResult(answer))
  }

  #isFinal(round) {
    return round.getMatches().length === 1 && round.getParticipantsWithBye().length === 0
  }

  #showBracket(rounds) {
    this.#io.print('\nThe bracket:')
    this.#io.print(new BracketView(rounds).format())
  }

  #showChampion(final) {
    const [finalMatch] = final.getMatches()
    this.#io.print(`\n${finalMatch.getWinner().getName()} wins the cup!`)
  }
}
