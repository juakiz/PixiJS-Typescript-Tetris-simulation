## Tetris Simulation

Requirements:
§ pixi.js,
§ typescript

Game simulation:
- Grid: 3 X 12
- Dropping shapes:

- Create a list of shapes in json file which will be read by the game. The json should
provide - type of shape, initial position on grid (which column to start in) and initial
shape rotation.
- First shape drops from the top and keeps dropping, until it hits the bottom.
- Next shape will then drop and stacks on top of the previous shape/s.
- When a whole row is complete, destroy the row and slide down all the rows above
it.
- Continue dropping shapes down until no more whole shapes can fit in the grid or
until the end of the list of shapes (which ever comes first)
- Add instructions to run it locally in the readme
- Please host your static website on a platform of your convenience

Bonus
- Scoreboard – add 10 points for each row that is completed.

## Usage

-   `npm run build` - starts build procedure
-   `npm run dev` - start watching for files and open's server on localhost:8080
-   `npm run test` - run tests
-   `npm run code-coverage` - generate code coverage report
-   `npm run code-style-check` - run's eslint and prettier check on your code
