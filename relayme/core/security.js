var crypto = require('crypto');

// Returns a class that does security operations.
module.exports = function(modules) {
    var config = modules.config;
    function byteArrayToString(byteArray) {
        var chars = [];
        for (var i = 0, n = byteArray.length; i < n;) {
            chars.push(((byteArray[i++] & 0xff) << 8) | (byteArray[i++] & 0xff));
        }
        return String.fromCharCode.apply(null, chars);
    }

    var securityClass = {
        hashPassword : function hashPassword(password, salt) {
            var binarySalt = (new Buffer(salt, 'hex')).toString('binary');
            var hash = crypto.createHmac('sha512', binarySalt).update(password).digest('hex');
            return hash;
        },

        hashPasswordForEncryption : function hashPasswordForEncryption(password, salt) {
            var base64Salt = (new Buffer(salt, 'binary')).toString('base64');
            var hash = crypto.createHmac('sha1', base64Salt).update(password).digest('base64');
            // console.log('Hash of password (for encryption) %s using %s is: %s', password, salt, hash);
            return hash;
        },

        getEncryptionKey : function getEncryptionKey(password, salt) {
            if (!salt)
                return undefined;
            var key = this.hashPasswordForEncryption(password, salt).substring(0, 16);
            return key;
        },

        getIV : function getIV(password, salt) {
            if (!salt)
                return undefined;
            var iv = this.hashPasswordForEncryption(password, salt).split('').reverse().join('').substring(0, 16);
            return iv;
        },

        encryptString : function encryptString(str, password, salt) {
            console.log('encrypting string %s', str);
            if (!password || !salt || !str) {
                console.log('password or salt is invalid, can\'t encrypt.');
                return undefined;
            }
            var encryptionKey = this.getEncryptionKey(password, salt);
            var iv = this.getIV(password, salt);
            if (!encryptionKey || !iv)
                return undefined;
            var cipher = crypto.createCipheriv('aes-128-cbc', encryptionKey, iv);
            var cipherText = cipher.update(str, 'binary', 'base64');
            var cipherTextRemaining = cipher.final('base64');
            return cipherText + cipherTextRemaining;
        },

        decryptString : function decryptString(str, password, salt) {
            console.log('decrypting string %s', str);
            if (!password || !salt || !str) {
                console.log('password or salt is invalid, can\'t decrypt.');
                return undefined;
            }
            var encryptionKey = this.getEncryptionKey(password, salt);
            var iv = this.getIV(password, salt);
            if (!encryptionKey || !iv)
                return undefined;
            var desipher = crypto.createDecipheriv('aes-128-cbc', encryptionKey, iv);
            var desipherText = desipher.update(str, 'base64', 'binary');
            var desipherTextRemaining = desipher.final('binary');
            return desipherText + desipherTextRemaining;
        }
    };

    return securityClass;
}
