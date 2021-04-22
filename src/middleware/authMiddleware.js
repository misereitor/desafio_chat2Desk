module.exports.isLogged = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect('/login')
        return
    }
    next()
}

module.exports.isNotLogged = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.redirect('/')
        return
    }
    next()
}

module.exports.changePassword = (req, res) => {
    if (req.body.password != req.body['password-confirm']) {
        req.flash('error', 'As senhas não confere')
        res.redirect('/profile')
        return
    }
    req.user.setPassword(req.body.password, async () => {
        try {
            await req.user.save()
        } catch (erro) {
            req.flash('error', 'Falha a alterar a senha')
            res.redirect('/profile')
            console.error(erro.message)
            return
        }
        req.flash('success', 'Senha alterada com sucesso')
        res.redirect('/')
    })
}