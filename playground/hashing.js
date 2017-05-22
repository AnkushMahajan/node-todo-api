const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let message = 'Hello there!';

let hash = SHA256(message).toString();

console.log(`The message is ${message} and the hash is ${hash}`);

let data = {
    id: 10
};

let token = jwt.sign(data, 'secret123');
let decoded = jwt.verify(token, 'secret123');


console.log(`token is ${token} and decoded is `, decoded);

let password = 'hello';
bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(`Hashed value is ${hash}`);
    })
});

bcrypt.compare(password, '$2a$10$4oh/lgi1c41IVjZMxGcgZeAk7epa4WvRYqnLC/O7TVNDM75rBMSGi', (err, res) => {
    console.log(res);
})
