import { RoundRobinScheduler, Standings } from 'tournament-scheduler'
import { StandingsView } from './StandingsView.js'

/**
 * Plays a league where every participant meets every other participant once.
 */
export class LeagueRunner {
  #io
  #roundPlayer
  #inputParser
  #scheduler = new RoundRobinScheduler()
  #standingsView = new StandingsView()

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
   * Plays all rounds, shows the standings after each round and finally the winner.
   *
   * @param {import('tournament-scheduler').Participant[]} participants - At least two participants.
   * @throws {import('./InputClosedError.js').InputClosedError} If the user closes the input.
   */
  async run(participants) {
    const standings = new Standings(participants)
    const rounds = this.#scheduler.createRounds(participants)

    for (const round of rounds) {
      await this.#roundPlayer.play(round, answer => this.#inputParser.parseResult(answer))
      round.getMatches().forEach(match => standings.recordMatch(match))
      const isLastRound = round === rounds.at(-1)
      this.#showStandings(standings, isLastRound ? 'Final standings' : `Standings after round ${round.getNumber()}`)
    }
    this.#showWinner(standings)
  }

  #showStandings(standings, title) {
    this.#io.print(`\n${title}`)
    this.#io.print(this.#standingsView.format(standings.getEntries()))
  }

  #showWinner(standings) {
    const [leader] = standings.getEntries()
    this.#io.print(`\n${leader.getParticipant().getName()} wins the league!`)
  }
}
