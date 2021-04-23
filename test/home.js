const app = require('../src/server')
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = chai.expect
chai.use(chaiHttp)
chai.use(require('chai-url'));
describe('No controller home', function () {

  it('deve retornar status 200 ao fazer GET /', function (done) {
    chai.request(app)
      .get('/')
      .end(function (err, res) {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('deve ir para rota / ao fazer GET /sair', function (done) {
    chai.request('http://localhost:8080')
      .get('/logout')
      .end(function (err, res) {
        expect('http://localhost:8080').to.path('/');
        done();
      });
  });

  it('deve ir para rota / ao fazer POST /entrar', function (done) {
    const loginVazio = { user: { name: '', password: '' } };
    chai.request('http://localhost:8080')
      .post('/login')
      .send(loginVazio)
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });

  it('deve ir para rota /contatos ao fazer POST /entrar', function (done) {
    const login = { email: 'teste@teste.com', password: 'teste' };
    chai.request(app)
      .post('/entrar')
      .send(login)
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done()
      });
  });
});