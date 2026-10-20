# Tournament Console App

A console app for running a small tournament, such as a game night or a football tournament among friends, without pen and paper. You choose a league or a cup, enter the participants and the results, and the app keeps track of the rounds, the table and the winner.

## Vision

Organising a small tournament by hand means drawing up a schedule, working out who meets whom, counting points and keeping the table up to date. Mistakes are easy to make and someone has to do the bookkeeping instead of playing. Tournament Console App lets the organiser enter only what happens on the field: the participants and the results. The app draws the order, creates every round, keeps the table and announces the winner, so a whole tournament can be run from a laptop in a few minutes.

## Requirements

| ID | Requirement |
| -- | ----------- |
| R1 | The user can choose between a league (everyone meets everyone once) and a cup (single elimination). |
| R2 | The user can enter 2–32 participants by name. Empty names and duplicates (regardless of letter case) are rejected with a message. |
| R3 | The app draws a random order of the participants and shows it. In a cup the drawn order decides the bracket, so the first drawn get the byes when the number of participants is not a power of two. |
| R4 | The app shows the matches of each round, and who has a bye. |
| R5 | The user enters the result of each match as `home-away`, e.g. `2-1`. An invalid result is rejected with a message and the question is asked again. In a cup a draw is rejected. |
| R6 | League: the table (played, won, drawn, lost, score, difference, points) is shown after each round, and the final standings and the winner when all rounds are played. If the top two are equal on points, difference and score, a tie is announced instead of a winner. |
| R7 | Cup: the winners advance to the next round until the final is played. Then the whole bracket is drawn with every result, followed by the champion. |
| R8 | When a tournament is finished the user can start a new one or quit. Closing the input (Ctrl+D or Ctrl+C) ends the app without a crash. |

The test cases for each requirement are found in [TEST_REPORT.md](TEST_REPORT.md).

## Installation and running

You need [Node.js](https://nodejs.org) 20 or later and [Git](https://git-scm.com).

```
git clone https://github.com/nordstrom-a/tournament-console-app.git
cd tournament-console-app
npm install
npm start
```

`npm install` downloads the two modules the app depends on directly from GitHub.

### Repeatable draws

The draw is random by default. To get the same draw every time, for example when following the test report, set `DRAW_SEED` to a whole number:

```
DRAW_SEED=42 npm start          # macOS and Linux
$env:DRAW_SEED=42; npm start    # Windows PowerShell
```

## Example

A league with three participants, started with `DRAW_SEED=42 npm start`:

```
Welcome to Tournament Console App!

Choose a format:
  1. League (everyone meets everyone, a table decides the winner)
  2. Cup (knockout, the winner of each match advances)
> 1

How many participants? 3
Participant 1: Anna
Participant 2: Bo
Participant 3: Cecilia

The draw:
  1. Cecilia
  2. Anna
  3. Bo

Round 1
  Anna - Bo
  Cecilia has a bye

Enter the results, e.g. 2-1:
  Anna - Bo: 2-1

Standings after round 1
┌───┬─────────┬───┬───┬───┬───┬───────┬──────┬─────┐
│ # │ Name    │ P │ W │ D │ L │ Score │ Diff │ Pts │
├───┼─────────┼───┼───┼───┼───┼───────┼──────┼─────┤
│ 1 │ Anna    │ 1 │ 1 │ 0 │ 0 │   2-1 │   +1 │   3 │
│ 2 │ Cecilia │ 0 │ 0 │ 0 │ 0 │   0-0 │    0 │   0 │
│ 3 │ Bo      │ 1 │ 0 │ 0 │ 1 │   1-2 │   -1 │   0 │
└───┴─────────┴───┴───┴───┴───┴───────┴──────┴─────┘

...

Final standings
┌───┬─────────┬───┬───┬───┬───┬───────┬──────┬─────┐
│ # │ Name    │ P │ W │ D │ L │ Score │ Diff │ Pts │
├───┼─────────┼───┼───┼───┼───┼───────┼──────┼─────┤
│ 1 │ Anna    │ 2 │ 2 │ 0 │ 0 │   4-1 │   +3 │   6 │
│ 2 │ Bo      │ 2 │ 0 │ 1 │ 1 │   2-3 │   -1 │   1 │
│ 3 │ Cecilia │ 2 │ 0 │ 1 │ 1 │   1-3 │   -2 │   1 │
└───┴─────────┴───┴───┴───┴───┴───────┴──────┴─────┘

Anna wins the league!

Play a new tournament? (y/n) n

Thanks for playing!
```

A cup ends with the whole bracket, here with four participants:

```
The bracket:
Anna 2 ────┐
           ├─ Anna 1 ─┐
Cecilia 1 ─┘          │
                      ├─ David 🏆
David 3 ─┐            │
         ├─ David 2 ──┘
Bo 0 ────┘

David wins the cup!
```

## For developers

### Dependencies

| Module | Used for |
| ------ | -------- |
| [tournament-scheduler](https://github.com/nordstrom-a/tournament-scheduler) | The core of the app: creating the league rounds and the cup bracket, recording results and calculating the standings. |
| [Dice-RNG-Toolkit](https://github.com/ThJoker3/Dice-RNG-Toolkit) | The random draw of the participants, with an optional seed. |

Both are installed from GitHub as separate projects and are not changed by this app.

### Structure

The app is written in object-oriented JavaScript (ES modules). `src/app.js` creates the objects and starts the app. It is the only code outside a class.

| Class | Responsibility |
| ----- | -------------- |
| `TournamentApp` | The overall flow: format, participants, draw, tournament, play again. |
| `LeagueRunner` / `CupRunner` | Play a league or a cup from the first round to the winner. |
| `RoundPlayer` | Shows a round and asks for the result of each match. |
| `RoundView` / `StandingsView` / `BracketView` | Format a round, the league table and the finished cup bracket as text. |
| `InputParser` | Validates and converts the user's answers. |
| `ParticipantDraw` | The only class that uses Dice-RNG-Toolkit. |
| `ConsoleIO` | The only class that reads from and writes to the console. Asks again until an answer is valid. |
| `InvalidInputError` / `InputClosedError` | An answer that cannot be used, and input that was closed by the user. |

### Known limitations

- Nothing is saved. A tournament is lost when the app is closed.
- Scores are whole numbers, so sports that are decided in another way, such as by time, are not supported.
- An invalid `DRAW_SEED` (not a whole number) stops the app with an error at start.

## License

[MIT](LICENSE)
