import * as readline from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { InputClosedError } from './InputClosedError.js'
import { InvalidInputError } from './InvalidInputError.js'

/**
 * Reads input from and writes output to the console. The rest of the app
 * talks to the console only through this class.
 */
export class ConsoleIO {
  #readline
  #inputClosed = new AbortController()

  constructor() {
    this.#readline = readline.createInterface({ input: stdin, output: stdout })
    this.#readline.once('close', () => this.#inputClosed.abort())
  }

  /**
   * @param {string} question - The text shown before the cursor.
   * @returns {Promise<string>} The answer without surrounding whitespace.
   * @throws {InputClosedError} If the user closes the input, e.g. with Ctrl+D.
   */
  async ask(question) {
    try {
      const answer = await this.#readline.question(question, { signal: this.#inputClosed.signal })
      return answer.trim()
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new InputClosedError()
      }
      throw error
    }
  }

  /**
   * Asks the question again until the answer can be parsed.
   *
   * @param {string} question - The text shown before the cursor.
   * @param {(answer: string) => *} parse - Converts the answer, throws InvalidInputError if it is invalid.
   * @returns {Promise<*>} The parsed answer.
   * @throws {InputClosedError} If the user closes the input.
   */
  async askUntilValid(question, parse) {
    while (true) {
      const answer = await this.ask(question)
      try {
        return parse(answer)
      } catch (error) {
        if (!(error instanceof InvalidInputError)) {
          throw error
        }
        this.print(error.message)
      }
    }
  }

  /**
   * @param {string} [text=''] - The text to print on its own line.
   */
  print(text = '') {
    console.log(text)
  }

  close() {
    this.#readline.close()
  }
}
