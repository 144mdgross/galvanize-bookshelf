'use strict';

const express = require('express');
const knex = require('../knex')
const hbs = require('handlebars')
const humps = require('humps');
let bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/', (req, res, next) => {
  let hasEmail = false
  req.body.email === '' ? hasEmail = false : hasEmail = true
  let password = req.body.password
  let emailMatch = false
  knex('users')
  .returning('email')
  .then(email => {
    for (var i = 0; i < email[0].length; i++) {
      if (req.body.email === email[i]) {
        emailMatch = true
      }
    }
  })

  // found example using sync...maybe not the best
  if (hasEmail && password.length > 8 && !emailMatch ) {
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
  } else if (!hasEmail) {
    res.send('Email must not be blank')
  } else if ()
})

module.exports = router;
