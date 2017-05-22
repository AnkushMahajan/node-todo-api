require('./config/config');

// Express imports
const express = require('express');
const bodyParser = require('body-parser');
const {authenticate} = require('./middleware/authenticate');

const _ = require('lodash');

// mongoose and model imports
const {mongoose} = require('./db/mongoose');
const {ObjectID} = require('mongodb');
const {Todo} = require('./models/Todo');
const {User} = require('./models/User');

const app = express();

app.use(bodyParser.json())

// Todos requests
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
});

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
});

app.delete('/todos/:id', (req, res) => {
   let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(500).send('Id not found')
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) return res.status(404).send('No document to remove');
        res.send({todo});
    }, (err) => {
        res.status(400).send(err);
    })
});

app.patch('/todos/:id', (req, res) => {
    let id = req.params.id;
    console.log(id);
    // pick only selects the properties mentioned in the array from the object
    let body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)) {
        return res.status(500).send('Id not found');
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate( id, {
        $set: body
    }, {
        new: true
    }).then((todo) => {
        if (!todo) return res.status(500).send('Id not found');
        res.send({todo});
    }, (err) => {
        res.status(500).send(err)
    })
})

// User requests
app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    let user = new User(body);

    user.save().then((user) => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((err) => {
        res.status(400).send(err);
    })
});



app.get('/users/me', authenticate,  (req, res) => {
    res.send(req.user)
});

app.listen('3000', () => {
    console.log('App is listening on port 3000!');
});

module.exports = {app};
