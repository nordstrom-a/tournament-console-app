/**
 * Formats league standings as a text table for the console.
 */
export class StandingsView {
  /**
   * @param {import('tournament-scheduler').StandingsEntry[]} entries - Best placed first, as given by Standings.getEntries().
   * @returns {string} A header row followed by one row per participant.
   */
  format(entries) {
    const nameWidth = Math.max('Name'.length, ...entries.map(entry => entry.getParticipant().getName().length))
    const header = this.#formatRow(['#', 'Name', 'P', 'W', 'D', 'L', 'Score', 'Diff', 'Pts'], nameWidth)
    const rows = entries.map((entry, index) => this.#formatRow(this.#createCells(entry, index + 1), nameWidth))
    return [header, ...rows].join('\n')
  }

  #createCells(entry, position) {
    return [
      String(position),
      entry.getParticipant().getName(),
      String(entry.getPlayed()),
      String(entry.getWins()),
      String(entry.getDraws()),
      String(entry.getLosses()),
      `${entry.getScored()}-${entry.getConceded()}`,
      this.#formatDifference(entry.getScoreDifference()),
      String(entry.getPoints())
    ]
  }

  #formatDifference(difference) {
    return difference > 0 ? `+${difference}` : String(difference)
  }

  #formatRow(cells, nameWidth) {
    const [position, name, ...numbers] = cells
    return `  ${position.padStart(2)}  ${name.padEnd(nameWidth)}${numbers.map(number => number.padStart(6)).join('')}`
  }
}
