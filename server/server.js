// Express imports
const express = require('express');
const bodyParser = require('body-parser');

// mongoose and model imports
const {mongoose} = require('./db/mongoose');
const {ObjectID} = require('mongodb');
let {Todo} = require('./models/Todo');
let {User} = require('./models/User');

const app = express();

app.use(bodyParser.json())

app.post('/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    })

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    })
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos})
    }, (err) => {
        res.status(400).send(err);
    })
})

app.get('/todos/:id', (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(500).send('Object id not valid');
    }
    Todo.findById(id).then((todo) => {
        if (!todo) return res.status(404).send('Id not found');
        res.send({todo})
    }, (err) => {
        res.status(400).send(err);
    })
})

app.listen('3000', () => {
    console.log('App is listening on port 3000!');
});

module.exports = {app};
