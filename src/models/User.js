const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const db = require('../database/bd')

mongoose.Promise = global.Promise

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    resertPasswordToken: String,
    resertPasswordExpires: Date
})

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' })

module.exports = mongoose.model('User', userSchema)