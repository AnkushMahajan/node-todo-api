const { MongoClient, ObjectID} = require('mongodb');

let obj = new ObjectID();

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to Mongo Database Server', err);
    }
    console.log('Connected to Mongo Db server');
    //db.collection('Todos').find() returns a cursor to the documents
    db.collection('Users').find({name: 'Ankush'}).toArray().then((docs) => {
        console.log('Users');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch documents', err)
    })

    db.close();
})