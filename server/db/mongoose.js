let mongoose = require('mongoose');

// mongoose defaults are callbacks assigning a Promise
mongoose.Promise = global.Promise;
// connect to database from mongoose
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = { mongoose };

