const router = require('express').Router();
const passport = require('passport');

router.use('/users', require('./users'));
router.use('/entries', passport.authenticate('jwt', { session: false }), require('./entries'));

router.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce((errors, key) => {
        // eslint-disable-next-line no-param-reassign
        errors[key] = err.errors[key].message;

        return errors;
      }),
    });
  }

  return next(err);
});

module.exports = router;
