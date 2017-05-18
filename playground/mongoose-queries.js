const {ObjectID} = require('mongodb');
const mongoose = require('../server/db/mongoose');
const {Todo} = require('../server/models/Todo');

let id = '591d1535177b7c4939fe107sdsd0';

if (!ObjectID.isValid(id)) {
   return console.log('Id not valid')
}

Todo.find({
    _id: id
}).then((todos) => {
    console.log('Todos', todos)
});

Todo.findOne({
    _id: id
}).then((todo) => {
    console.log('Todo', todo)
});

Todo.findById(id).then((todo) => {
    if (!todo) return console.log('Todo not found')
    console.log('Todo', todo)
}).catch((e) => console.log(e))
