const passportJwt = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const fs = require('fs');
const path = require('path');

const { ExtractJwt } = passportJwt;
const JwtStrategy = passportJwt.Strategy;

const User = require('mongoose').model('User');
const { validatePassword } = require('../lib/utils');

const PUB_KEY = fs.readFileSync(path.join(__dirname, '..', 'id_rsa_pub.pem'), 'utf-8');

const localStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  (email, password, done) => {
    User.findOne({ email })
      .then((user) => {
        if (!user || !validatePassword(password, user.hash, user.salt)) {
          return done(null, false, { errors: { 'email or password': 'is wrong' } });
        }
        return done(null, user);
      })
      .catch((err) => {
        done(err);
      });
  },
);

const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256'],
  },
  (jwtPayload, done) => {
    User.findOne({ _id: jwtPayload.sub })
      .then((user) => done(null, user.convertToJson()))
      .catch((err) => done(err));
  },
);

module.exports = (passport) => {
  passport.use(localStrategy);
  passport.use(jwtStrategy);
};
