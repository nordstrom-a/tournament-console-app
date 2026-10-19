import { RandomGenerator, Randomizer } from 'dice-rng-toolkit'

/**
 * Draws a random order for the participants. This is the only class that
 * depends on dice-rng-toolkit.
 */
export class ParticipantDraw {
  #randomizer = new Randomizer()
  #randomGenerator

  /**
   * @param {number} seed - The same seed always gives the same draw.
   * @throws {Error} If the seed is not an integer.
   */
  constructor(seed) {
    this.#randomGenerator = new RandomGenerator(seed)
  }

  /**
   * @param {string[]} names - The names to draw. Not changed.
   * @returns {string[]} A new array with the names in random order.
   */
  draw(names) {
    return this.#randomizer.shuffle(names, this.#randomGenerator)
  }
}
