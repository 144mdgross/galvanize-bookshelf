'use strict';

const express = require('express');
const knex = require('../knex')
const hbs = require('handlebars')
const humps = require('humps');
let bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
const bodyParser = require('body-parser')
const boom = require('boom')

// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/', (req, res, next) => {
  let hasEmail = false
  let emailDb = false
  let email = req.body.email


  if (!req.body.password || req.body.password.length < 8) {
    return next(boom.create(400, 'Password must be at least 8 characters long'))
  } else {
    const salt = bcrypt.genSaltSync()
    const hash = bcrypt.hashSync(req.body.password, salt)

    knex('users')
      .insert([{
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        email: req.body.email,
        hashed_password: hash
      }])
      .returning(['id', 'first_name', 'last_name', 'email'])
      .then(newUser => {
        let camelUser = humps.camelizeKeys(newUser)
        res.send(camelUser[0])
      })
      .catch(err => {
        if (err.message.includes('unique')) {
          return next(boom.create(400, 'Email already exists'))
        } else {
          return next(boom.create(400, 'Email must not be blank'))
        }
      })
    }
})

module.exports = router;
