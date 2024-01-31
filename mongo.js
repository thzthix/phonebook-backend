const mongoose = require("mongoose")

if (process.argv.length < 3) {
  console.log("give password as argument")
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://seohas0428:${password}@cluster0.yilcxrc.mongodb.net/phoneBook?retryWrites=true&w=majority`

mongoose.set("strictQuery", false)
mongoose.connect(url)
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Person = mongoose.model("Person", personSchema)
if (process.argv.length < 4) {
  Person.find({}).then((result) => {
    result.forEach((note) => {
      console.log(note)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length >= 4) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}
