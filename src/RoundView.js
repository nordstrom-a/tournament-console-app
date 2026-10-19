/**
 * Formats rounds and matches as text for the console.
 */
export class RoundView {
  /**
   * @param {import('tournament-scheduler').Round} round - The round to format.
   * @returns {string} The round number, one line per match and one line per participant with a bye.
   */
  format(round) {
    const lines = [`Round ${round.getNumber()}`]
    for (const match of round.getMatches()) {
      lines.push(`  ${this.formatMatch(match)}`)
    }
    for (const participant of round.getParticipantsWithBye()) {
      lines.push(`  ${participant.getName()} has a bye`)
    }
    return lines.join('\n')
  }

  /**
   * @param {import('tournament-scheduler').Match} match - The match to format.
   * @returns {string} "Home - Away", or "Home 2 - 1 Away" when the match is played.
   */
  formatMatch(match) {
    const home = match.getHomeParticipant().getName()
    const away = match.getAwayParticipant().getName()
    if (!match.isPlayed()) {
      return `${home} - ${away}`
    }
    return `${home} ${match.getHomeScore()} - ${match.getAwayScore()} ${away}`
  }
}
