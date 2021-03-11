// CRUD create read update delete

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if(error){ 
        return console.log('Unable to connect!')
    }

    const db = client.db(databaseName)

    // db.collection('users').insertOne({
    //     name: 'Alok',
    //     age: 18
    // })

    // db.collection('users').insertMany([
    //     {
    //         name: 'salemon bhoi',
    //         age: 60
    //     }, {
    //         name: 'Abhishek bachhan',
    //         age: 99
    //     }
    // ], (error, result) => {
    //     console.log(result.ops);
    // })

    db.collection('tasks').insertMany([
        {
            description: 'First work',
            completed: false
        }, {
            description: '2nd work',
            completed: true
        }, {
            description: 'No work',
            completed: true
        }
    ], (error, result) => {
        if(error){
            return console.log('Error occured!')
        }

        console.log(result.ops)
    })

})