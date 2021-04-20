const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();

const app = express();

const DB_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/travel-diary';

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:8080',
}));

require('./models/Entry');
require('./models/User');

require('./config/passport')(passport);

app.use('/', require('./routes'));

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${server.address().port}`);
});
