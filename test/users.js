const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Importa tu app
const should = chai.should();

chai.use(chaiHttp);

describe('User Registration', () => {
    it('should register a user', (done) => {
        chai.request(app)
            .post('/users/register')
            .send({ username: 'testuser', email: 'test@example.com', password: 'password123' })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('User registered successfully');
                done();
            });
    });
});
