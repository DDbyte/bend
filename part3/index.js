


const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')
const app = express()

//middlewares
app.use(express.json()) //parses incoming JSON in HTTP request bodies and makes them accessible under request.body
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', (request) => {
  return JSON.stringify(request.body)
})
app.use(morgan(
  ':method :url :status :res[content-length] - :response-time ms :body'
))

//Rout Handlers
//get all
app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => response.json(persons))
    .catch(error => next(error))
})//

//get info
app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
      const currentTime = new Date()
      const message = `<p>Phonebook has info for ${count} people</p>
                             <p>${currentTime}</p>`
      response.send(message)
    })
    .catch(error => next(error))
})//

//get by id
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})//

//delete doc
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      if (result) {
        // found and deleted
        response.status(204).end()
      } else {
        // not found
        response.status(404).json({ error: 'Resource not found' })
      }
    })
    .catch(error => next(error)) // pass exceptions to the error handler
})//


//create doc
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  // validate content
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing',
    })
  }

  // validate duplicate entry
  Person.findOne({ name: body.name })
    .then(existingPerson => {
      if (existingPerson) {
        return response.status(400).json({
          error: 'name must be unique',
        })
      }

      // if no duplicate, proceed to create the document
      const person = new Person({
        name: body.name,
        number: body.number,
      })

      return person.save()
    })
    .then(savedPerson => {
      if (savedPerson) {
        response.json(savedPerson)
      }
    })
    .catch(error => next(error))
})//



//update doc
app.put('/api/persons/:id', (request, response, next) => {

  const { name, number } = request.body

  //the optional { new: true } param, causes the event handler to be called with the new modified doc instead of the original
  Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})//

//endpoint error
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}//

app.use(unknownEndpoint)

//express error handlers
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}//

//the last loaded middleware
app.use(errorHandler)

//start the server
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

//PORT has to match [http_service]  internal_port = 3000 in fly.toml file