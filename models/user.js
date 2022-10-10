const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    },

    address: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },

    customerphoto: {
        type: String,
        },
   
    mobilenumber: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 10
    },

    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },

    date:{
        type: Date,
        required: true,
        unique:true
    }
    
}));

function validateUser(user) {
    const schema = {
        name: Joi.string().min(3).max(30).required(),
        address: Joi.string().max(50).required(),
        customerphoto :Joi.string(),
        mobilenumber: Joi.number().min(10).required(),
        email: Joi.string().min(5).max(255).required().email(),
    };
    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
