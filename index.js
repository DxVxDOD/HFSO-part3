const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

morgan.token('body', (request) => JSON.stringify({name: request.body.name, number: request.body.number}))

app.use(express.json());
app.use(express.static('dist'));
app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let notes = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get('/api/persons', (request, response) => response.json(notes));

app.get('/api/info', (request, response) => {
    const time = new Date().toString()
    const numberOfPeople = notes.map(note => note.id)
    const sendInfo = `
    <h2>The phonebook has info for ${Math.max(...numberOfPeople)} people</h2>
    <p>${time}</p>`;

    response.send(sendInfo);
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const note = notes.find(note => note.id === id)
    
    note ? response.json(note) : response.status(404).end;
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    notes = notes.filter(note => note.id !== id);

    response.status(204).end();
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    const name = notes.find(note => note.name === body.name);

    if(!body.name) response.status(400).json({error: 'name missing!'})
    if(!body.number) response.status(400).json({error: 'number missing!'})
    if(name) response.status(400).json({error: 'name already exists!'})
  
    const note = {
        id: Math.floor(Math.random() * 10000),
        name: body.name,
        number: body.number,
    }

    notes = notes.concat(note);
  
    response.json(note);
  })

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
