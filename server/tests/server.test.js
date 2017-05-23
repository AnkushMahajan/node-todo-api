const expect = require('expect');
const request = require('supertest');

const {app} = require('../server');
const {Todo} = require('../models/Todo');
const {User} = require('../models/User');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed')



beforeEach(populateUsers);
beforeEach(populateTodos);

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

    describe('Delete routes', () => {
        it('Should delete a route by id', (done) => {
            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                id = todos[0]._id;
                request(app).
                    delete(`/todos/${id}`).
                    expect(200).
                    expect((res) => {
                        expect(res.body.todo.text).toBe('First test todo')
                    }).
                    end((err, res) => {
                        if (err) return done(err);
                        Todo.findById(id).then((doc) => {
                            expect(doc).toBe(null);
                            done();
                        }).catch((err) => done(err))
                    });
            });
        });

        it('Should return 500 for an invalid id', (done) => {
            let id = 'dsds';
            request(app).
                delete(`/todos/${id}`).
                expect(500).
                end(done);
        });

        it('Should return 404 when document has already been deleted', (done) =>{
            let id = '591d23bef837add63c045548';
            request(app).
            get(`/todos/${id}`).
            expect(404).
            end(done);
        })
    });

    describe('Patch routes', () => {
        it('Should update a todo for a given id', (done) => {
            Todo.findOne({completed: true}).then((todo) => {
                if (!todo) return done('No todo found');
                let id = todo._id;
                request(app).
                    patch(`/todos/${id}`).
                    send({completed: false}).
                    expect(200).
                    expect((res) => {
                        expect(res.body.todo.completed).toBe(false);
                        expect(res.body.todo.completedAt).toBe(null);
                    }).
                    end((err, res) => {
                        if (err) return done(err);
                        Todo.findById(res.body.todo._id).then((doc) => {
                            expect(doc.completedAt).toBe(null);
                            expect(doc.completed).toBe(false);
                            done();
                        }).catch((err) => done(err))
                    })
            }).catch((err) => done(err))
        })
    })

    describe('Get Users', () => {
        it('Should get user when token is passed in', (done) => {
            request(app).
                get('/users/me').
                set('x-auth', users[0].tokens[0].token).
                expect(200).
                expect((res) => {
                    expect(res.body.id).toBe(users[0]._id.toHexString());
                    expect(res.body.email).toBe(users[0].email);
                }).end(done);
        });

        it('Should return 401 when no token is passed in', (done) => {
            request(app).
                get('/users/me').
                expect(401).
                    expect((res) => {
                        expect(res.body).toEqual({});
                }).end(done);
        });
    });

    describe('Post Users', () => {
       it('should post a user and return auth token', (done) => {
            let userBody = {email: 'amahajan3@gmail.com', password: 'hello12345'};
            request(app).
                post('/users').
                send(userBody).
                expect(200).
                    expect((res) => {
                        expect(res.body.email).toBe('amahajan3@gmail.com');
                        expect(res.headers['x-auth']).toExist();
                }).end((err, res) => {
                    if(err) done(err);
                    User.findById(res.body.id).then((user) => {
                        expect(user.email).toBe('amahajan3@gmail.com');
                        expect(user.password).toNotBe('')
                        done();
                    }).catch((err) => done(err));
                });
       });

       it('should return validation errors if request invalid', (done) => {
           request(app).
           post('/users').
           send({email:'amahajan@gmail.com', password: 'abc'}).
           expect(400).
           expect((res) => {
                expect(res.body.errors).toExist();
           }).end(done);
       });

       it('should not create a user if email already in use', (done) => {
           request(app).
           post('/users').
           send({email: 'ankush@gmail.com', password:'sdsdsdsds'}).
           expect(400).
           expect((res) => {
            expect(res.body.errmsg).toExist();

           }).end(done);
       })
    });
})
