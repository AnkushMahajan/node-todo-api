const {ObjectID} = require('mongodb');
const mongoose = require('../server/db/mongoose');
const {Todo} = require('../server/models/Todo');

// remove all documents
Todo.remove({}).then((result) => {
    console.log(result)
})

// remove one documents
Todo.findOneAndremove({}).then((result) => {
    console.log(result)
})

// remove one documents
Todo.findByIdAndremove('').then((result) => {
    console.log(result)
})