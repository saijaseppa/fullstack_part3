const http = require('http');
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const Person = require('./models/person');

app.use(express.static('build'));
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());



app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(persons => {
            response.json(persons);
        })
        .catch(error => next(error))
  })

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                const modified = {
                    name: person.name,
                    number: person.number,
                    id: person.id
                }
                response.json(modified);
            }
            else {
                response.status(404).end();
            }
        })
        .catch(error => next(error))
})

app.get('/api/info', (request, response, next) => {
    const date = Date();
    Person.find({})
        .then(persons => {
            response.send(`<p>Phonebook has info for ${persons.length} people</p>
                    <p>${date}</p>`)
        })
        .catch(error => next(error))  
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            result.toJSON() 
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body;
    console.log("request.body: ", body);

    if (body.name === undefined) {
        return response.status(400).json({error: 'name missing'})
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    //muokkaaa numeroa jos numero on jo tietokannassa
    const body = request.body;

    const person = {
        name: body.name,
        number: body.number
    }
    
    Person.findByIdAndUpdate(
        request.params.id, 
        person, 
        { new: true, runValidators: true, context: 'query' }
        )
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error)) 
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message })
    }
    next(error)
  }
app.use(errorHandler)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})