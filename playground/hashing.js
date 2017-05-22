const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

let message = 'Hello there!';

let hash = SHA256(message).toString();

console.log(`The message is ${message} and the hash is ${hash}`);

let data = {
    id: 10
};

let token = jwt.sign(data, 'secret123');
let decoded = jwt.verify(token, 'secret123');


console.log(`token is ${token} and decoded is `, decoded)
