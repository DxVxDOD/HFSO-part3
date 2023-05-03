const mongoose = require("mongoose")

const password = process.argv[2]

const mongoUrl = `mongodb+srv://orbangdavid24:${password}@cluster0.sjpb3xy.mongodb.net/phoneBookApp?retryWrites=true&w=majority`

mongoose.set("strictQuery", true)
mongoose.connect(mongoUrl)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number
})

const Person = mongoose.model("Person", personSchema)

const person = new Person({
  name: process.argv[3],
  number: process.argv[4]
})

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    result.map(pers => console.log(pers.name, pers.number))
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  person.save().then(() => {
    console.log(`${person.name}s details gave been saved`)
    mongoose.connection.close()
  })
} else if (process.argv.length < 5) {
  console.log("give password as argumnet[2], name as argument[3], number as argument[3]")
  process.exit(1)
}