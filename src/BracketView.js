/**
 * Draws a finished cup as a bracket tree for the console, with the first
 * round to the left and the champion to the right.
 */
export class BracketView {
  #rounds

  /**
   * @param {import('tournament-scheduler').Round[]} rounds - All rounds of a finished cup, the first round first.
   */
  constructor(rounds) {
    this.#rounds = rounds
  }

  /**
   * @returns {string} The bracket, one line per participant and one line per match winner.
   */
  format() {
    const finalIndex = this.#rounds.length - 1
    const [finalMatch] = this.#rounds[finalIndex].getMatches()
    const bracket = this.#drawMatch(finalMatch, finalIndex, `${finalMatch.getWinner().getName()} 🏆`)
    return bracket.lines.map(line => line.trimEnd()).join('\n')
  }

  #drawMatch(match, roundIndex, winnerLabel) {
    const home = match.getHomeParticipant()
    const away = match.getAwayParticipant()
    const homeBranch = this.#drawPathTo(home, roundIndex - 1, `${home.getName()} ${match.getHomeScore()}`)
    const awayBranch = this.#drawPathTo(away, roundIndex - 1, `${away.getName()} ${match.getAwayScore()}`)
    return this.#joinBranches(homeBranch, awayBranch, winnerLabel)
  }

  #drawPathTo(participant, roundIndex, label) {
    const previousMatch = roundIndex >= 0 ? this.#findMatchOf(participant, this.#rounds[roundIndex]) : undefined
    if (previousMatch === undefined) {
      return { lines: [label], anchor: 0 }
    }
    return this.#drawMatch(previousMatch, roundIndex, label)
  }

  #findMatchOf(participant, round) {
    return round.getMatches().find(match =>
      match.getHomeParticipant() === participant || match.getAwayParticipant() === participant)
  }

  #joinBranches(top, bottom, label) {
    const width = Math.max(...top.lines.map(line => line.length), ...bottom.lines.map(line => line.length))
    const lines = [
      ...top.lines.map((line, index) => this.#connect(line, width, index - top.anchor, '┐')),
      `${' '.repeat(width)}  ├─ ${label}`,
      ...bottom.lines.map((line, index) => this.#connect(line, width, bottom.anchor - index, '┘'))
    ]
    return { lines, anchor: top.lines.length }
  }

  #connect(line, width, stepsTowardMiddle, corner) {
    if (stepsTowardMiddle === 0) {
      return `${line} ${'─'.repeat(width - line.length)}─${corner}`
    }
    const connector = stepsTowardMiddle > 0 ? '│' : ' '
    return `${line.padEnd(width)}  ${connector}`
  }
}
