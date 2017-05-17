const { MongoClient, ObjectID} = require('mongodb');

let obj = new ObjectID();

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to Mongo Database Server', err);
    }

    /*//find one and update
    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID('591be666e3b5e063c2a14848')
    }, {
        $set: {
            completed: true
        }
    }, {
        returnOriginal: false
    }).then( (result) => {
        console.log('Updated record', JSON.stringify(result, undefined, 2))
    }, (err) => {
        console.log('Error while deleting record', err);
    })*/

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('591bda3fdc76fd281d5bb37c')
    }, {
        $inc: {
            age: -1
        }
    }, {
        returnOriginal: false
    }).then((result) => {
       console.log('Update user is', JSON.stringify(result, undefined, 2))
    }, (err) => {
        console.log('Could not update user', err);
    })

    db.close();
})