import { Participant } from 'tournament-scheduler'
import { CupRunner } from './CupRunner.js'
import { InputParser } from './InputParser.js'
import { LeagueRunner } from './LeagueRunner.js'
import { RoundPlayer } from './RoundPlayer.js'

/**
 * Guides the user through setting up and playing a tournament.
 */
export class TournamentApp {
  #io
  #participantDraw
  #inputParser = new InputParser()
  #leagueRunner
  #cupRunner

  /**
   * @param {import('./ConsoleIO.js').ConsoleIO} io - Used for all input and output.
   * @param {import('./ParticipantDraw.js').ParticipantDraw} participantDraw - Decides the order of the participants.
   */
  constructor(io, participantDraw) {
    this.#io = io
    this.#participantDraw = participantDraw
    const roundPlayer = new RoundPlayer(io)
    this.#leagueRunner = new LeagueRunner(io, roundPlayer, this.#inputParser)
    this.#cupRunner = new CupRunner(io, roundPlayer, this.#inputParser)
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
    const drawnNames = this.#participantDraw.draw(names)
    this.#showDraw(drawnNames)
    const participants = drawnNames.map(name => new Participant(name))
    await this.#playTournament(format, participants)
  }

  async #askFormat() {
    this.#io.print('\nChoose a format:')
    this.#io.print('  1. League (everyone meets everyone, a table decides the winner)')
    this.#io.print('  2. Cup (knockout, the winner of each match advances)')
    return this.#io.askUntilValid('> ', answer => this.#inputParser.parseFormat(answer))
  }

  async #askParticipantNames() {
    this.#io.print()
    const count = await this.#io.askUntilValid('How many participants? ', answer => this.#inputParser.parseParticipantCount(answer))
    const names = []
    for (let number = 1; number <= count; number++) {
      const name = await this.#io.askUntilValid(`Participant ${number}: `, answer => this.#inputParser.parseParticipantName(answer, names))
      names.push(name)
    }
    return names
  }

  #showDraw(drawnNames) {
    this.#io.print('\nThe draw:')
    drawnNames.forEach((name, index) => this.#io.print(`  ${index + 1}. ${name}`))
  }

  async #playTournament(format, participants) {
    if (format === 'league') {
      await this.#leagueRunner.run(participants)
    } else {
      await this.#cupRunner.run(participants)
    }
  }
}
