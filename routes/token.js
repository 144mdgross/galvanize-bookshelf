'use strict'

const express = require('express');
const knex = require('../knex')
const cookieSession = require('cookie-session')
const jwt = require('jsonwebtoken');
const router = express.Router();
const Boom = require('boom')
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.use(cookieSession({
  name: 'token',
  keys: ['Santa', 'hatesCookies'],
  maxAge: 24 * 60 * 60 * 1000
}))

router.get('/', (req, res, _next) => {
  if (req.session.jwt) {
    res.status(200)
      .set('Content-Type', 'application/json')
      .send('true')
  } else {
    res.status(200)
      .set('Content-Type', 'application/json')
      .send('false')
  }
})

router.post('/', (req, res, next) => {
  knex('users')
    .where('email', `${req.body.email}`)
    .then(compareUserInfo => {
      if (compareUserInfo.length > 0) {
        const hash = compareUserInfo[0].hashed_password
        const email = compareUserInfo[0].email
        const firstName = compareUserInfo[0].first_name
        const lastName = compareUserInfo[0].last_name
        const id = compareUserInfo[0].id
        const passes = bcrypt.compareSync(req.body.password, hash)

        if (passes) {
          const token = jwt.sign({
            email: email,
            id: id,
            firstName: firstName,
            lastName: lastName
          }, 'kirkegaard')

          req.session.jwt = token
          res.send(id, email, firstName, lastName)
        } else {
          return next(Boom.badRequest('Bad email or password'))
        }
      } else {
        return next(Boom.badRequest('Bad email or password'))
      }
    })
})

router.delete('/', (req, res, next) => {
  req.session = null
  res.status(200)
    .set('Content-Type', 'application/json')
    .send('true')
})

module.exports = router;
