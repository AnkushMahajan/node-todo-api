const expect = require('expect');
const request = require('supertest');

const {app} = require('../server');
const {Todo} = require('../models/Todo');

const todos = [{
    text: 'First test todo'
}, {
    text: 'Second test todo'
}]

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => {
        done();
    })
})

describe('routes', () => {
    describe('Post requests', () => {
        it('should post a todo', (done) => {
            let text = 'Test todo text'
            request(app).
            post('/todos').
            send({text}).
            expect(200).
            expect((res) => {
                expect(res.body.text).toBe(text);
            }).
            end((err, res) => {
                if (err) return done(err);
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            })
        });

        it('Should send 400 for bad request', () => {
            let text = '   ';
            request(app).
            post('/todos').
            send({text}).
            expect(400).
            end((err, res) => {
                if (err) return done(err);
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            })
        });
    })

    describe('Get requests', () => {
        it('Should get all todos', (done) => {
            request(app).
            get('/todos').
            expect(200).
            expect((res) => {
                expect(res.body.todos.length).toBe(2);
            }).
            end((err, res) => {
                if (err) return done(err);
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            })
        });

        it('Should get todo matching to the id', (done) => {
            let id = null;
            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                id = todos[0]._id;
                request(app).
                get(`/todos/${id}`).
                expect(200).
                expect((res) => {
                    expect(res.body.todo.text).toBe('First test todo');
                }).
                end((err, res) => {
                    if (err) return done(err);
                    Todo.findById(id).then((doc) => {
                    expect(doc.text).toBe('First test todo');
                    done();
                }).catch((err) => done(err))
            })
            }).catch((e) => done(e));
        });

        it('Should return 500 for an Invalid id', (done) => {
            let id = '591d1f9099a967403bb6216sdsds2';
            request(app).
            get('/todos/id').
            expect(500).
            end(done);
        });

        it('Should return 404 when id not found', (done) => {
            let id = '591d23bef837add63c045548';
            request(app).
            get(`/todos/${id}`).
            expect(404).
            end(done);
        });
    });


})
