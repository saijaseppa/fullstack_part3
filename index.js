const http = require('http');
const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.static('build'))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons);
  })

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(per => per.id === id)

    if (person) {
        response.json(person);
    }
    else {
        response.status(404).end();
    }
})

app.get('/api/info', (request, response) => {
    const count = persons.length;
    const date = Date();
    response.send(`<p>Phonebook has info for ${count} people</p>
                    <p>${date}</p>`)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id)

    response.status(204).end();
})

const generateId = () => {
    let id = Math.floor(Math.random() * 100000);
    //console.log("id on ", id);
    return id;
}

app.post('/api/persons', (request, response) => {
    const body = request.body;
    console.log("request.body: ", body);
    
    const personFound = persons.find(per => per.name === body.name)
    console.log(personFound)

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }
    if (personFound) {
        return response.status(400).json({
            error: 'name must be unique' 
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person);
    response.json(person);
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})