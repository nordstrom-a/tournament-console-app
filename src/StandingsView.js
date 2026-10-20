/**
 * Formats league standings as a table with borders for the console.
 */
export class StandingsView {
  #headers = ['#', 'Name', 'P', 'W', 'D', 'L', 'Score', 'Diff', 'Pts']
  #nameColumn = 1

  /**
   * @param {import('tournament-scheduler').StandingsEntry[]} entries - Best placed first, as given by Standings.getEntries().
   * @returns {string} A table with a header row and one row per participant.
   */
  format(entries) {
    const rows = entries.map((entry, index) => this.#createCells(entry, index + 1))
    const widths = this.#calculateColumnWidths(rows)
    return [
      this.#formatBorder('┌', '┬', '┐', widths),
      this.#formatRow(this.#headers, widths),
      this.#formatBorder('├', '┼', '┤', widths),
      ...rows.map(row => this.#formatRow(row, widths)),
      this.#formatBorder('└', '┴', '┘', widths)
    ].join('\n')
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

  #calculateColumnWidths(rows) {
    return this.#headers.map((header, column) => Math.max(header.length, ...rows.map(row => row[column].length)))
  }

  #formatBorder(left, middle, right, widths) {
    return left + widths.map(width => '─'.repeat(width + 2)).join(middle) + right
  }

  #formatRow(cells, widths) {
    const alignedCells = cells.map((cell, column) => this.#alignCell(cell, column, widths[column]))
    return `│ ${alignedCells.join(' │ ')} │`
  }

  #alignCell(cell, column, width) {
    return column === this.#nameColumn ? cell.padEnd(width) : cell.padStart(width)
  }
}
