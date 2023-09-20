const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)

}

const password = process.argv[2]

const url = `mongodb+srv://udev2045:${password}@cluster0.kd45tck.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
    const Id = parseInt(Math.random() * 9999999)
    let message = `added ${process.argv[3]} number ${process.argv[4]} to phonebook`
    const person = new Person({
        id: Id,
        name: process.argv[3],
        number: process.argv[4],
    })

    person.save().then(result => {
        console.log(message)
        mongoose.connection.close()
    })
}
if (process.argv.length === 3) {
    Person
        .find({})
        .then(persons => {
            console.log('Phonebook:')
            persons.forEach(p => {
                console.log(`${p.name}: ${p.number}`)
            })
            mongoose.connection.close()
        })
}
