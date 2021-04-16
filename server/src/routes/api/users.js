const router = require('express').Router();
const passport = require('passport');
const User = require('mongoose').model('User');
const utils = require('../../lib/utils');

router.post('/login', (req, res, next) => {
  if (!req.body.email) {
    return res.status(422).json({ errors: { email: "can't be blank" } });
  }
  if (!req.body.password) {
    return res.status(422).json({ errors: { password: "can't be blank" } });
  }

  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (user) {
      const tokenObject = utils.generateJwt(user);
      return res.json({
        user: user.convertToJson(),
        token: tokenObject.token,
        expiresIn: tokenObject.expires,
      });
    }
    return res.status(422).json(info);
  })(req, res, next);
});

router.post('/register', (req, res, next) => {
  const user = new User({ entries: [] });

  user.username = req.body.username;
  user.email = req.body.email;
  user.setPassword(req.body.password);

  user
    .save()
    .then(() => res.json({ user: user.convertToJson() }))
    .catch(next);
});

module.exports = router;
