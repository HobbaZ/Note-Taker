const express = require('express');
const fs = require('fs');
const util = require('util');
const path = require('path');
const db = require('./db/db.json');
const { v4: uuidv4 } = require('uuid');

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
    return response.json(db);
});

// POST request
app.post('/api/notes', (request, response) => {

  //create a note and create id
  let createNote = request.body;
  createNote.id = uuidv4();
  
  //push note to db file
    db.push(createNote);
 
 fs.writeFile("./db/db.json", JSON.stringify(db, null, 2), (err) => { //null, 2 adds new lines and indentation to JSON file to make it easier to read
  if (err) throw (err);

  console.log(createNote, "Note has been added to db.json file");

  return response.json(createNote);
});
});

//DELETE Route for deleting notes
app.delete('/api/notes/:id', (request, response) => {
  let noteToDelete = request.params.id;

  // db is an array with objects in it should be able to use splice to remove note
    for (let index = 0; index < db.length; index++) {
      if (noteToDelete === db[index].id) {
        db.splice(index, 1);
        break;
    }
  }
   //write db file again
   fs.writeFile("./db/db.json", JSON.stringify(db, null, 2), (err) => { //null, 2 adds new lines and indentation to JSON file to make it easier to read
    if (err) throw (err);
  
    console.log("Note deleted");
  
    return response.json(db);
  });
});

app.get('/api/notes/:id', async (request, response) => {
  let noteToGet = request.params.id;
  let edit = await (db({noteToGet}));
  response.send(edit)
});

app.post('/api/notes/:id', async (request, response) => {
  let noteToGet = request.params.id;
  let edit = await (request.body);
  response.send(edit)
});

/*//Editing notes
app.get('/api/notes/:id', (request, response) => {
  let noteToGet = request.params.id;

    // db is an array with objects in it should be able to use splice to remove note
    for (let index = 0; index < db.length; index++) {
      if (noteToGet === db[index].id) {
        break;
    }
  }
   //write db file again
   fs.writeFile("./db/db.json", JSON.stringify(db, null, 2), (err) => { //null, 2 adds new lines and indentation to JSON file to make it easier to read
    if (err) throw (err);
  
    console.log("Note deleted");
  
    return response.json(db);
  });
});*/

// GET Route if user inputs anything else (put last)
app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, '/public/index.html'))
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);