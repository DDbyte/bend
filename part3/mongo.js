// import mongoose
const mongoose = require('mongoose')

//retrive pass
const password = process.argv[2]

//conn str
const url =
  `mongodb+srv://alex:${password}@cluster0.exhnn.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

//config mongoose
mongoose.set('strictQuery',false)

//db conn
mongoose.connect(url)

//define schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

// define model based on schema
const Person = mongoose.model('Person', personSchema)

//based on conditions, display all docs, add new doc to db, or exit w/ code 1
if(process.argv.length === 3){
  console.log('Phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} - ${person.number}`)
    })
    //an open database connection keeps the event loop alive, preventing the script from exiting
    mongoose.connection.close()
  })
}
else if(process.argv.length === 5){
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}
else{
  console.log('Usage: node mongo.js pass fullName phoneNumber or only pass to list')
  process.exit(1)
}