const { MongoClient, ObjectID} = require('mongodb');

let obj = new ObjectID();

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to Mongo Database Server', err);
    }
    console.log('Connected to Mongo Db server');

    // Mongo doesn't create a database unless something is inserted into it
    /*db.collection('Todos').insertOne({
     text: 'Something to do',
     completed: false
     }, (err, result) => {
     if (err) {
     return console.log('Unable to insert something to do');
     }

     console.log(JSON.stringify(result.ops, undefined, 2));
     })*/

    db.collection('Users').insertOne({
        name: 'Ankush',
        age: 29
    }, (err, result) => {
        if (err) {
            return console.log('Unable to Insert into Users Collection')
        }

        console.log(JSON.stringify(result.ops, undefined, 2));
    })
    db.close();
})