import { InputParser } from './InputParser.js'

/**
 * Guides the user through setting up and playing a tournament.
 */
export class TournamentApp {
  #io
  #inputParser = new InputParser()

  /**
   * @param {import('./ConsoleIO.js').ConsoleIO} io - Used for all input and output.
   */
  constructor(io) {
    this.#io = io
  }

  /**
   * Runs the app until the user is done.
   *
   * @throws {import('./InputClosedError.js').InputClosedError} If the user closes the input.
   */
  async run() {
    this.#io.print('Welcome to Tournament Console App!')
    const format = await this.#askFormat()
    const names = await this.#askParticipantNames()
    this.#io.print(`\nA ${format} with ${names.length} participants: ${names.join(', ')}`)
  }

  async #askFormat() {
    this.#io.print('\nChoose a format:')
    this.#io.print('  1. League (everyone meets everyone, a table decides the winner)')
    this.#io.print('  2. Cup (knockout, the winner of each match advances)')
    return this.#io.askUntilValid('> ', answer => this.#inputParser.parseFormat(answer))
  }

  async #askParticipantNames() {
    this.#io.print()
    const count = await this.#io.askUntilValid('How many participants? ',answer => this.#inputParser.parseParticipantCount(answer))
    const names = []
    for (let number = 1; number <= count; number++) {
      const name = await this.#io.askUntilValid(`Participant ${number}: `, answer => this.#inputParser.parseParticipantName(answer, names))
      names.push(name)
    }
    return names
  }
}
