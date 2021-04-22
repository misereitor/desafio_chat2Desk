const express = require('express')
const router = express.Router()

const authMiddleware = require('./middleware/authMiddleware')
const userController = require('./controller/userController')

router.get('/', userController.index)

router.get('/login', authMiddleware.isNotLogged, userController.login)
router.post('/login', authMiddleware.isNotLogged, userController.loginAction)

router.get('/logout', userController.logout)

router.get('/register', authMiddleware.isNotLogged, userController.register)
router.post('/register', authMiddleware.isNotLogged, userController.registerAction)

router.get('/forget', authMiddleware.isNotLogged, userController.forget)
router.post('/forget', authMiddleware.isNotLogged, userController.forgetAction)
router.get('/forget/:token', authMiddleware.isNotLogged, userController.forgetToken)
router.post('/forget/:token', authMiddleware.isNotLogged, userController.forgetTokenAction)

router.get('/profile', authMiddleware.isLogged, userController.profile)
router.post('/profile', authMiddleware.isLogged, userController.profileAction)
router.post('/profile/password', authMiddleware.isLogged, authMiddleware.changePassword)

module.exports = router