import { ConsoleIO } from './ConsoleIO.js'
import { InputClosedError } from './InputClosedError.js'
import { TournamentApp } from './TournamentApp.js'

const io = new ConsoleIO()
const app = new TournamentApp(io)

try {
  await app.run()
} catch (error) {
  if (!(error instanceof InputClosedError)) {
    throw error
  }
  io.print('\nGoodbye!')
} finally {
  io.close()
}
