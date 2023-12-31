require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
app.use(cors())
const Person = require('./models/person')
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


app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    let date = new Date()
    Person.find({}).then(persons => {
        response.send(`Phonebook has info for ${persons.length} people<br>${date}`)
    })

})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({error: 'malformatted id'})
        })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {

    const person = request.body
    if (person.name === undefined) {
        return response.status(400).json({ error: 'Name missing' })
    }
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
    Person.find({}).then(persons => {
        const allPersons = persons
        const existsPerson = allPersons.filter(per => {
            return per.name === person.name
        })
        if (existsPerson.length > 0) {
            Person.findOneAndUpdate(
                {"name": person.name},
                {"number": person.number}
            ).then(result => {
                console.log('Person updated!')
                response.status(200).end()
            }).catch(error => next(error))
        } else {
            const p = new Person({
                "name": person.name,
                "number": person.number
            })

            p.save().then(result => {
                console.log('Person saved!')
            })

        }
        response.json(persons)
    })

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})