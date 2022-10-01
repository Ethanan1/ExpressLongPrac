const { application } = require('express');
const express = require('express');
const app = express();
require('express-async-errors')

app.use(express.json())
// /static route able to access assets folder
app.use("/static", express.static("assets")) //going into /static => cding into assets folder
// ^ Has built in response so it doesn't move on to any other code

const logPath = (req, res, next) => {
  console.log("method: ", req.method)
  console.log("path: ", req.path)

  res.on("finish", () => {
    console.log("status code: ", res.statusCode)
  })

  next();
}

app.use(logPath);

// setup of router in app.js for getAllDogs
const dogsRouter = require('./routes/dogs.js')
app.use('/dogs', dogsRouter)

// For testing purposes, GET /
app.get('/', (req, res) => {
  res.json("Express server running. No content provided at root level. Please use another route.");
});

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json(req.body);
  next();
});

// connect middleware to routes


// For testing express-async-errors
app.get('/test-error', async (req, res) => {
  throw new Error("Hello World!")
});

app.use((req, res, next) => { // Creating an error, not an error handler (taking in an error) so only needs 3 things passed in.
  const error = new Error("The requested resource couldn't be found.");
  error.statusCode = 404;
  next(error) // No more routes, nothing left to hit. Calling next to push that error through
  // to express' default error formatter which then responds with an Error that is formatted by express.
})

const port = 8080;
app.listen(port, () => console.log('Server is listening on port', port));
