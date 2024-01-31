require("dotenv").config()
const Person = require("./models/person")
const express = require("express")
const morgan = require("morgan")
const app = express()
app.use(morgan("tiny"))
const cors = require("cors")
app.use(express.static("dist"))
app.use(cors())
morgan.token("content", function (req, res) {
  return JSON.stringify(req.body)
})

app.use(express.json())
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :content"
  )
)

const generateId = () => {
  return Math.random() * 10 + 999
}
app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => response.json(persons))
})
app.get("/info", (request, response) => {
  const date = new Date().toLocaleString()
  response.send(
    `<h1>phonebook has info for ${data.length} people</h1> <br/> <h2>${date}</h2> `
  )
})
app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person)
  })
})

app.post("/api/persons", (request, response) => {
  const body = request.body
  const newName = body.name
  const newNumber = body.number
  if (!newName || !newNumber) {
    return response.status(404).json({
      error: "name or number is missing",
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
  newPerson.save().then((savedPerson) => {
    response.json(savedPerson)
  })
  response.json(newPerson)
})

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
