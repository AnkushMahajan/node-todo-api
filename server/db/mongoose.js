let mongoose = require('mongoose');

// mongoose defaults are callbacks assigning a Promise
mongoose.Promise = global.Promise;
// connect to database from mongoose
mongoose.connect(process.env.MONGODB_URI);

module.exports = { mongoose };

