'use strict'

const express = require('express');
const knex = require('../knex')
const jwt = require('jsonwebtoken');
const router = express.Router();
const Boom = require('boom')
const bcrypt = require('bcrypt');
const saltRounds = 10;
require('dotenv').config()

function badEmailBadPassword (req, res, next) {
  let email = req.body.email
  let password = req.body.password
  if (email === "" || !email) {
    return next(Boom.create(400, "Email must not be blank"))
  } else if (password === "" || !password) {
    return next(Boom.create(400, "Password must not be blank"))
  } else {
    next()
  }
}

router.get('/', (req, res, _next) => {
  if (req.cookies.token) {
    res.status(200)
      .set('Content-Type', 'application/json')
      .send('true')
  } else {
    res.status(200)
      .set('Content-Type', 'application/json')
      .send('false')
  }
})

router.post('/', badEmailBadPassword, (req, res, next) => {
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
          const jwtToken = jwt.sign({
            email: email,
            id: id,
            firstName: firstName,
            lastName: lastName
          }, 'kirkegaard')

          res.cookie('token', jwtToken, {httpOnly: true})
          // req.session.jwt = token
          res.send({id: id, firstName: firstName, lastName: lastName, email:email})
        } else {
          return next(Boom.badRequest('Bad email or password'))
        }
      } else {
        return next(Boom.badRequest('Bad email or password'))
      }
    })
})

router.delete('/', (req, res, next) => {
  res.clearCookie('token')
  // req.session = null
  res.send(true)
    // .set('Content-Type', 'application/json')
    // .send('true')
})

module.exports = router;
