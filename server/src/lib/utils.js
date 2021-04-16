const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const PRIV_KEY = fs.readFileSync(path.join(__dirname, '..', 'id_rsa_priv.pem'), 'utf-8');

function validatePassword(password, hash, salt) {
  return hash === crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
}

function generateJwt(user) {
  const expiresIn = '1d';

  const payload = {
    sub: user._id,
    iat: Date.now(),
  };

  const token = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn, algorithm: 'RS256' });

  return {
    token,
    expires: expiresIn,
  };
}

module.exports.validatePassword = validatePassword;
module.exports.generateJwt = generateJwt;
