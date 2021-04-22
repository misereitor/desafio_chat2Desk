const User = require('../models/User')
const crypto = require('crypto')
const { exec } = require('child_process')

exports.index = (req, res) => {
    res.render('home')
}

exports.login = (req, res) => {
    let dadosDaPagina = {
        pageTitle: 'Login'
    }
    res.render('login', dadosDaPagina)
}

exports.loginAction = (req, res) => {
    const auth = User.authenticate()
    auth(req.body.email, req.body.password, (err, result) => {
        if (!result) {
            req.flash('error', 'E-mail ou senhas estão incorretos')
            res.redirect('/login')
            return
        }

        req.login(result, () => { })

        req.flash('success', 'Login efetuado com sucesso')
        res.redirect('/')
    })
}

exports.logout = (req, res) => {
    req.logout()
    res.redirect('/')
}

exports.register = (req, res) => {
    let dadosDaPagina = {
        pageTitle: 'register'
    }
    res.render('register', dadosDaPagina)
}

exports.registerAction = (req, res) => {
    const newUser = new User(req.body)
    User.register(newUser, req.body.password, (err) => {
        if (err) {
            req.flash('error', 'Ocorreu um erro, tente novamente.')
            console.error("ERRO" + err.message)
            res.redirect('/register')
            return
        }
        req.flash('success', 'Registro efetuado com sucecsso.')
        res.redirect('/login')
    })
}

exports.forget = (req, res) => {
    res.render('forget')
}

exports.forgetAction = async (req, res) => {
    const user = await User.findOne({ email: req.body.email }).exec()
    if (!user) {
        req.flash('error', 'e-mail não cadastrado')
        res.redirect('/forget')
        return
    }

    try {
        user.resertPasswordToken = crypto.randomBytes(20).toString('hex')
        user.resertPasswordExpires = Date.now() + 3600000
        await user.save()

        const restLink = `http://${req.headers.host}/forget/${user.resertPasswordToken}`

        req.flash('success', 'E-mail enviado com sucesso - Link: ' + restLink)

        res.redirect('/login')
    } catch (erro) {
        req.flash('error', 'Algo deu errado, tente novamente')
        console.error(erro.message)
        return
    }

}

exports.forgetToken = async (req, res) => {
    const user = await User.findOne({
        resertPasswordToken: req.params.token,
        resertPasswordExpires: { $gt: Date.now() }
    }).exec()

    if (!user) {
        req.flash('error', 'Limite de tempo para alteração de senha alterado.')
        res.redirect('/login')
        return
    }
    res.render('forgetPassword')
}

exports.forgetTokenAction = async (req, res) => {
    const user = await User.findOne({
        resertPasswordToken: req.params.token,
        resertPasswordExpires: { $gt: Date.now() }
    }).exec()

    if (!user) {
        req.flash('error', 'Limite de tempo para alteração de senha alterado.')
        res.redirect('/login')
        return
    }

    if (req.body.password != req.body['password-confirm']) {
        req.flash('error', 'As senhas não confere')
        res.redirect('back')
        return
    }

    user.setPassword(req.body.password, async () => {
        try {
            await user.save()
        } catch (erro) {
            req.flash('error', 'Falha a alterar a senha')
            res.redirect('back')
            console.error(erro.message)
            return
        }
        req.flash('success', 'Senha alterada com sucesso')
        res.redirect('/')
    })
}

exports.profile = (req, res) => {
    res.render('profile')
}

exports.profileAction = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.user._id },
            { name: req.body.name, email: req.body.email },
            { new: true, runValidators: true }
        )
    } catch (erro) {
        req.flash('error', 'Algo deu errado, tente novamente')
        console.error(erro.message)
        return
    }

    req.flash('success', 'Dados atualizados com sucesso.')
    res.redirect('/profile')
}
