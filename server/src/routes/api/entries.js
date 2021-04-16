const router = require('express').Router();
const mongoose = require('mongoose');

const User = mongoose.model('User');
const Entry = mongoose.model('Entry');

router.get('/', (req, res, next) => {
  const { id } = req.user;
  User.findById(id)
    .populate('entries')
    .then((user) => {
      res.json({ entries: user.entries });
    })
    .catch(next);
});

router.post('/', (req, res, next) => {
  const entry = new Entry(req.body);
  entry.user = req.user.id;
  entry
    .save()
    .then((newEntry) => {
      res.json({ newEntry });
      User.findOneAndUpdate(
        { _id: newEntry.user },
        { $push: { entries: newEntry._id } },
        { safe: true, upsert: false },
      )
        .then()
        .catch(next);
    })
    .catch(next);
});

router.put('/:entryId', (req, res, next) => {
  Entry.findOneAndUpdate({ _id: req.params.entryId }, req.body, {
    new: true,
  })
    .then((newEntry) => {
      res.json({ entry: newEntry });
    })
    .catch(next);
});

router.get('/:entryId', (req, res, next) => {
  Entry.findById(req.params.entryId)
    .then((entry) => res.json({ entry }))
    .catch(next);
});

module.exports = router;
