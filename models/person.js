const mongoose = require("mongoose")
require("dotenv").config()

const mongoUrl = process.env.MONGO_URI

mongoose.set("strictQuery", false)
mongoose.connect(mongoUrl)
  .then(() => {
    console.log("connected to MongoDB")
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, "{VALUE} is too short, provide a name with 3 or more characters."],
  },
  number: {
    type: String,
    validate: {
      validator: (v) => /^\d{2,3}-\d{5,}$/.test(v),
      message: (error) => `${error.value} is not a valid phone number. Try 123-45678 or 12-3456789 formats.`,
    },
  },
})

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model("Person", personSchema)
