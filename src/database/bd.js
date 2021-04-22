const mongoose = require('mongoose')
require('dotenv').config({ path: '.env' })

mongoose.Promise = global.Promise
mongoose.connection.on('error', (error) => {
    console.error('ERRO:' + error.message)
})

module.exports = mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})