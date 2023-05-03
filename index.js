require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const Person = require('./models/person')

morgan.token('body', (request) => JSON.stringify({name: request.body.name, number: request.body.number}));

app.use(express.json());
app.use(express.static('dist'));
app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/api/persons', (request, response) => Person.find({}).then(pers => response.json(pers)));

app.get('/api/info', async (request, response) => {
    const time = new Date().toString();
    const personCount = await Person.estimatedDocumentCount({});
    console.log(personCount);
    const sendInfo = 
      `<h2>The phonebook has info for ${personCount} people</h2>
      <p>${time}</p>`;

    response.send(sendInfo);
});

app.get('/api/persons/:id', (request, response, next) => 
  Person.findById(request.params.id)
  .then(person => person ? response.json(person) : response.status(404).end)
  .catch(err => next(err)));

app.delete('/api/persons/:id', (request, response, next) => {
  Person
  .findByIdAndDelete(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(err => next(err))
});

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    if (body === undefined) {
      return response.status(400).json({ error: 'content missing' })
    } 
    const person = new Person({
      name: body.name,
      number: body.number
    })

    person.save()
    .then(savedPerson => response.json(savedPerson))
    .catch(err => next(err));

  });

  app.put('/api/persons/:id', (request, response, next) => {
    const {name, number} = request.body;

    if (name === undefined || number === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }

    Person
    .findByIdAndUpdate(
      request.params.id,
      {name, number},
      {new: true, runValidators: true, context: 'query'}
    )
    .then(upadtedPerson => response.json(upadtedPerson))
    .catch(err => next(err));

  }) 

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

  app.use(unknownEndpoint);

  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).send({error: error.message})
    }
  
    next(error)
  }

  app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
