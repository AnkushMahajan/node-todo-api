const {Todo} = require('../../models/Todo');
const {User} = require('../../models/User');
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const todos = [{
    text: 'First test todo'
}, {
    text: 'Second test todo',
    completed: true,
    completedAt: 123
}]

const userOneId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'ankush@gmail.com',
    password: 'hello1234',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'secret123').toString()
    }]
}, {
    _id: new ObjectID,
    email: 'ankush1@gmail.com',
    password: 'hello12345'
}]

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => {
        done();
    })
}

const populateUsers = (done) => {
    User.remove({}).then(() => {
        let user1 = new User(users[0]).save();
        let user2 = new User(users[1]).save();

        return Promise.all([user1, user2]);
    }).then(() =>  done());
}

module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
}