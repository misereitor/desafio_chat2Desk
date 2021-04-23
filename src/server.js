const express = require('express')
const mustache = require('mustache-express')
const router = require('./routes')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/User')
const helpers = require('./helpers')
const cookieParser = require("cookie-parser")
const session = require("express-session")
const flash = require("express-flash")
require('dotenv').config({ path: '.env' })

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static('./public'))

app.use(cookieParser(process.env.SECRET))
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(flash())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
    res.locals.h = { ...helpers }
    res.locals.flashes = req.flash()
    res.locals.user = req.user

    if (req.isAuthenticated()) {
        res.locals.h.menu = res.locals.h.menu.filter(i => i.logged)
    } else {
        res.locals.h.menu = res.locals.h.menu.filter(i => i.guest)
    }
    next()
})


app.use(router)
app.use((req, res, next) => {
    res.render('404')
})

app.engine('mst', mustache("./src/views/partials", ".mst"))
app.set("view engine", "mst")
app.set("views", "./src/views/pages")

app.listen(8080 || process.env.PORT, () => console.log("Server rodando na porta 8080"))

module.exports = app