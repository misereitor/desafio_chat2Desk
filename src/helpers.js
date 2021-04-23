exports.defaultPageTitle = 'Desafio de Login'

exports.menu = [
    { name: 'Home', slug: '/', guest: true, logged: true },
    { name: 'Login', slug: '/login', guest: true, logged: false },
    { name: 'Cadastrar', slug: '/register', guest: true, logged: false },
    { name: 'perfil', slug: '/profile', guest: false, logged: true },
    { name: "sair", slug: "/logout", guest: false, logged: true }
]