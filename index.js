require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(morgan('tiny'))
const cors = require('cors')
app.use(express.static('dist'))
app.use(cors())
morgan.token('content', function (req) {
  return JSON.stringify(req.body)
})

app.use(express.json())
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :content'
  )
)

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => response.json(persons))
})
app.get('/info', (request, response) => {
  const date = new Date().toLocaleString()
  Person.find({}).then((persons) => {
    response.send(
      `<h1>phonebook has info for ${persons.length} people</h1> <br/> <h2>${date}</h2> `
    )
  })
})
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  const newName = body.name
  const newNumber = body.number
  if (!newName || !newNumber) {
    return response.status(404).json({
      error: 'name or number is missing',
    })
  }

  // // const personexists = data.find((d) => d.name === newName)
  // if (personexists) {
  //   return response.status(404).json({
  //     error: "name must be unique",
  //   })
  // }
  const newPerson = new Person({
    name: newName,
    number: body.number,
    // id: generateId(),
  })

  //data = data.concat(newPerson)
  newPerson
    .save()
    .then((savedPerson) => {
      response.json(savedPerson)
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)
