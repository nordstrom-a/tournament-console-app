# Test Report

## Summary

The app was tested **manually through its console interface**, with at least one test case per requirement (R1–R8 in [README.md](README.md)). Each test case starts the app and types the answers in the *Input* column, one per line, in the order given. To repeat a test:

```
npm install
DRAW_SEED=42 npm start
```

`DRAW_SEED=42` makes the draw the same every time, so the matches and tables in the expected outcomes can be compared exactly. Where another seed is used, it is written in the *Input* column. Without a seed the draw is random, which is tested separately (TC9).

To get the same results quickly, some sessions were replayed with a small script that types the same lines into `npm start`. This gives the same output as typing them by hand.

**Environment:** Node.js v24.7.0, macOS, tournament-scheduler 0.2.0, Dice-RNG-Toolkit from GitHub (`main`). Last run: 2026-10-21.

**What was hardest to test:**
- **Randomness.** A random draw cannot be compared with an expected outcome. This was solved with `DRAW_SEED`, which passes a seed to Dice-RNG-Toolkit.
- **Closing the app with Ctrl+C.** Ctrl+C only reaches the app from a real terminal, so it was tested in a terminal window and not with piped input.
- **The layout of large tables and brackets.** Checked by eye with long names and with 32 participants. A program could check the character positions, but that would test the view's implementation rather than what the user sees.

Two bugs were found while testing. Both are marked ❌ in the table and have been fixed.

## Test Results

| Test case | Requirement | Input | Expected outcome | Actual outcome |
| --------- | ----------- | ----- | ---------------- | -------------- |
| TC1 Choose a league | R1 | `1`, `3`, `Anna`, `Bo`, `Cecilia`, then any results | A league is played: rounds with byes and a table after each round. | ✅ As expected. |
| TC2 Choose a cup | R1 | `2`, `4`, `Anna`, `Bo`, `Cecilia`, `David`, then any results | A cup is played: knockout rounds, a bracket and a champion at the end. | ✅ As expected. |
| TC3 Invalid format | R1 | `3`, `abc`, an empty line, then `1` | "Please enter 1 or 2." after each of the first three answers, then the question about the number of participants. | ✅ As expected. |
| TC4 Smallest and largest number of participants | R2 | `1`, `2` (and in a second run `2`, `32`) | Both are accepted and the app asks for "Participant 1". | ✅ As expected. |
| TC5 Invalid number of participants | R2 | `1`, `1`, `33`, `abc`, `4.5`, an empty line, then `2` | "Please enter a whole number from 2 to 32." after each invalid answer. `2` is accepted. | ✅ As expected. |
| TC6 Empty name | R2 | `1`, `2`, `Anna`, an empty line, then `Bo` | "The name cannot be empty." and "Participant 2:" is asked again. `Bo` is accepted. | ✅ As expected. |
| TC7 Duplicate name in another letter case | R2 | `1`, `2`, `Anna`, `anna`, then `Bo` | `"anna" is already taken. Please enter another name.` `Bo` is accepted. | ✅ As expected. |
| TC8 Same seed gives the same draw | R3 | Run twice: `DRAW_SEED=42`, `1`, `4`, `Anna`, `Bo`, `Cecilia`, `David` | Both runs show the draw `1. Anna 2. David 3. Bo 4. Cecilia`. | ✅ As expected. |
| TC9 The draw is random without a seed | R3 | Run three times without `DRAW_SEED`: `1`, `4`, `Anna`, `Bo`, `Cecilia`, `David` | A numbered draw is shown, and the order differs between runs. | ✅ Three different orders: Bo–Cecilia–Anna–David, Bo–Cecilia–David–Anna, David–Anna–Bo–Cecilia. |
| TC10 The draw decides the byes in a cup | R3, R4 | `DRAW_SEED=7`, `2`, `5`, `A`, `B`, `C`, `D`, `E` | Draw `D, B, C, E, A`. The first three drawn (D, B, C) have a bye, and round 1 is `E - A`. | ✅ As expected. |
| TC11 League with an odd number shows byes | R4 | `1`, `3`, `Anna`, `Bo`, `Cecilia`, `2-1`, `1-1`, `0-2` | Three rounds with one match each: `Anna - Bo` (Cecilia has a bye), `Cecilia - Bo` (Anna has a bye), `Cecilia - Anna` (Bo has a bye). | ✅ As expected. |
| TC12 League with an even number | R4 | `1`, `4`, `Anna`, `Bo`, `Cecilia`, `David`, then results | Three rounds with two matches each and no byes. Everyone meets everyone once. | ✅ Round 1: Anna–Cecilia, David–Bo. Round 2: Anna–Bo, Cecilia–David. Round 3: Anna–David, Bo–Cecilia. |
| TC13 Valid results | R5 | In TC12: `2-1` and `0 - 0` (spaces around the dash) | Both are accepted and appear in the table. | ✅ As expected. |
| TC14 Invalid results | R5 | In TC12, for David - Bo: `x`, `2:1`, `1-`, `-1-2`, then `0 - 0` | "Please enter the result as two whole numbers, e.g. 2-1." after each invalid answer, and the same match is asked again. | ✅ As expected. |
| TC15 A draw is rejected in a cup | R5 | `2`, `4`, `Anna`, `Bo`, `Cecilia`, `David`, `2-1`, `1-1`, then `3-0` | "A cup match must have a winner. Please enter a result that is not a draw." `3-0` is accepted. A draw in a league (`0 - 0` in TC13) is accepted. | ✅ As expected. |
| TC16 Table after each round | R6 | TC12 with the results `2-1`, `0 - 0`, `3-1`, `1-2`, `10-0`, `2-2` | After round 1: Anna 3 pts (2-1, +1), Bo and David 1 pt (0-0), Cecilia 0 pts (1-2, -1). After round 2: Anna 6, David 4, Bo 1, Cecilia 0. | ✅ All values checked by hand. |
| TC17 Final standings and winner | R6 | Same as TC16 | "Final standings": Anna 3 W, 15-2, +13, 9 pts; David 1/1/1, 2-11, -9, 4 pts; Bo 0/2/1, 3-5, -2, 2 pts; Cecilia 0/1/2, 4-6, -2, 1 pt. Then "Anna wins the league!". | ✅ As expected. |
| TC18 Equal at the top of the league | R6 | `1`, `2`, `Anna`, `Bo`, `1-1` | "The league ends with a tie at the top!" and no winner. | ❌ At first "Anna wins the league!" was shown, because the module sorts equal entries by name. Fixed: the app now compares the top two entries. ✅ After the fix. |
| TC19 Cup with four participants | R7 | `2`, `4`, `Anna`, `Bo`, `Cecilia`, `David`, `2-1`, `3-0`, `1-2` | Round 2 is `Anna - David` (the winners). After the final, the bracket shows all results with David 🏆, then "David wins the cup!". | ✅ As expected. |
| TC20 Cup with byes | R7 | `DRAW_SEED=7`, `2`, `5`, `A`, `B`, `C`, `D`, `E`, `2-1`, `3-0`, `2-0`, `0-1` | Round 2: `D - E`, `B - C`. Final `D - B`. In the bracket the branches of D, B and C start one round later than E and A. "B wins the cup!". | ✅ As expected. |
| TC21 Cup with two participants | R7 | `2`, `2`, `X`, `Y`, `0-2` | The first round is the final. The bracket shows `X 0` and `Y 2` with Y 🏆, then "Y wins the cup!". | ✅ As expected. |
| TC22 Large tournament and long names | R6, R7 | A cup with 32 participants (`Team01`–`Team32`, all results `2-1`), and a league with the name `A very long team name FC` | The bracket has 63 lines and all lines connect correctly. The table column becomes as wide as the longest name. | ✅ Checked by eye. |
| TC23 Play again or quit | R8 | After a finished tournament: `maybe`, `YES`, a new league `1`, `2`, `A`, `B`, `1-0`, then `no` | "Please enter y or n." after `maybe`. `YES` starts a new tournament from the format question. `no` shows "Thanks for playing!" and the app ends. | ✅ As expected. |
| TC24 Close the input with Ctrl+D | R8 | `1`, `4`, `Anna`, then Ctrl+D | "Goodbye!" and the app ends without an error message (exit code 0). | ✅ As expected. |
| TC25 Close the app with Ctrl+C | R8 | In a terminal: `1`, `2`, `A`, `B`, then Ctrl+C at the first result | "Goodbye!" and the app ends without an error message (exit code 0). | ✅ As expected. |
| TC26 A repeated question does not add blank lines | R2 | `1`, `x`, then `2` | The number question is asked again directly below the error message. | ❌ At first an extra blank line was printed every time the question was repeated. Fixed by printing the blank line before the question instead of inside it. ✅ After the fix. |

## Known Issues in Third-Party Modules

**None found** that affected the requirements. Dice-RNG-Toolkit is only used for the draw, through `Randomizer.shuffle()` and `RandomGenerator`, and both worked as documented.

Some observations from using it:

- **All errors are plain `Error`.** A caller cannot tell an invalid seed apart from other errors without reading the message. The app does not validate `DRAW_SEED` itself, so `DRAW_SEED=abc` stops the app at start with the module's message "Seed must be an integer". Since `DRAW_SEED` is only meant for testing, this is listed as a known limitation in the README instead of being worked around.
- **The README only shows installation from npm** (`npm install dice-rng-toolkit`). The app installs the module from GitHub instead, to be sure to use the code in the repository listed on Zulip.
