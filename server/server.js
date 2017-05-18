// Express imports
const express = require('express');
const bodyParser = require('body-parser');

// mongoose and model imports
const {mongoose} = require('./db/mongoose');
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
})

app.listen('3000', () => {
    console.log('App is listening on port 3000!');
});
