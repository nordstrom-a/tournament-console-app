import { ConsoleIO } from './ConsoleIO.js'
import { InputClosedError } from './InputClosedError.js'
import { ParticipantDraw } from './ParticipantDraw.js'
import { TournamentApp } from './TournamentApp.js'

const drawSeed = process.env.DRAW_SEED === undefined ? Date.now() : Number(process.env.DRAW_SEED)
const io = new ConsoleIO()
const app = new TournamentApp(io, new ParticipantDraw(drawSeed))

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
