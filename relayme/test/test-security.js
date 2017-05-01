var request = require('supertest');
var should = require('should');
var util = require('./testutil')();

describe('Security', function() {
    var modules = util.getModules();
    var baseUrl = modules.config.application.BASE_URL;

    describe('encryption', function() {
        it('Should encrypt and decrypt', function(done) {
            var password = 'jollyfellow';
            var salt = 'JTJxZEVxZEdeSUJEVlVecw==';
            var plainText = 'quick brown fox jumps over the lazy dog';
            var expectedCipherText = 'jqqYC9NOcrq5Ojka2FrSSQyAgIwpOXZW6RKQE9CUUNVoBPruOUa2wpY7I4yprvCN';
            var cipherText = modules.security.encryptString(plainText, password, salt);
            cipherText.should.equal(expectedCipherText);
            var decryptedText = modules.security.decryptString(cipherText, password, salt);
            decryptedText.should.equal(plainText);
            done();
        });
    });
});
