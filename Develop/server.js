const express = require('express');
const fs = require('fs');
const util = require('util');
const path = require('path');
const db = require('./db/db.json');

const PORT = process.env.port || 3003;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// GET Route for homepage
app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, '/public/index.html'))
});

// GET Route for notes page
app.get('/notes', (request, response) => {
  response.sendFile(path.join(__dirname, '/public/notes.html'))
});

// GET all notes stored in database
app.get('/api/notes', (request, response) => {
  response.json(db);
});

// POST request
app.post('/api/notes', (request, response) => {
  //create a note 
  let database = [];
  let createNote = request.body;
    console.log(createNote);
    // push created note to db file
    database.push(createNote);
    db.push(database);

 fs.writeFile("./db/db.json", JSON.stringify(createNote), "utf8", (err) => {
  if (err) throw (err);

  console.log(createNote, "Note has been added");
});
});

// GET Route if user inputs anything else (put last)
app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, '/public/index.html'))
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);