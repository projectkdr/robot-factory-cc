## How to run
1. Open the terminal from the root folder
2. Run "npx json-server --watch src/mock-server/db.json --port 8000" the command line
3. Open another terminal again
4. Run 'npm start' from the command line

#Note: 
If you refresh the browser, you may encounter issues with the network as the json-server sometimes triggers a 404 error even if it serves the API.
To fix this, if the json-server has ended, do step 2 again. Go to src/mock-server and copy the data from test.json to db.json.

## Json Server
run in another terminal
npx json-server --watch src/mock-server/db.json --port 8000

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Launches the test runner in the interactive watch mode.


