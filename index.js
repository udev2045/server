const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
app.use(cors())
morgan.token('part3', function (tokens, req, res) {
    let data = tokens.method(req, res) === 'POST' ? JSON.stringify(req.body) : ''
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        data
    ].join(' ')
})
app.use(express.json());
app.use(morgan('part3'))
let persons = [{
    "id": 1, "name": "Arto Hellas", "number": "040-123456"
}, {
    "id": 2, "name": "Ada Lovelace", "number": "39-44-5323523"
}, {
    "id": 3, "name": "Dan Abramov", "number": "12-43-234345"
}, {
    "id": 4, "name": "Mary Poppendieck", "number": "39-23-6423122"
}]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    let date = new Date()
    response.send(`Phonebook has info for ${persons.length} people<br>${date}`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = parseInt(request.params.id)
    console.log(response)
    const p = persons.find(person => person.id === id)
    if (p) {
        response.json(p)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = parseInt(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const Id = parseInt(Math.random() * 9999999)

    const person = request.body
    if (!person.name) {
        return response.status(400).json({
            error: 'Name missing'
        })
    }
    if (!person.number) {
        return response.status(400).json({
            error: 'Number missing'
        })
    }
    let personExists = persons.filter(p => p.name === person.name)
    if (personExists.constructor === Array && personExists.length > 0) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    person.id = Id

    persons = persons.concat(person)

    response.json(persons)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})