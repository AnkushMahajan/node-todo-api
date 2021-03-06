const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 5,
        trim: true,
        unique: true,
        validate: {
                validator: (value) => {
                return validator.isEmail(value);
            },
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
            minlength: 6,
            required: true
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]

})

UserSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    return _.pick(user, ['id', 'email']);
}

// custom methods on the model
UserSchema.methods.generateAuthToken = function (){
    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id: user._id.toHexString(), access}, 'secret123').toString();

    user.tokens.push({
        access,
        token
    });

    return user.save().then(() => {
            return token;
    });

}

// model method instead of an instance method
UserSchema.statics.findByToken = function (token){
    let User = this;
    let decoded;

    try {
       decoded = jwt.verify(token, 'secret123');
    } catch (ex) {
        return new Promise((resolve, reject) => {
                reject();
            });
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
}

UserSchema.pre('save', function (next) {
    let user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) next(err);
            bcrypt.hash(user.password, salt, (err, hashPassword) => {
                if (err) next(err);
                user.password = hashPassword;
                next();
            })
        })
    } else {
        next();
    }

})

let User = mongoose.model('Users', UserSchema);

module.exports = {User};