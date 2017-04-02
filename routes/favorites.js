'use strict';

const express = require('express')
const knex = require('../knex')
const jwt = require('jsonwebtoken');
const cookieSession = require('cookie-session')
const Boom = require('boom')
const bodyParser = require('body-parser')
const humps = require('humps')
// eslint-disable-next-line new-cap
const router = express.Router();

console.log('anything?');
router.get('/', (req, res, next) => {
  knex('favorites')
   .join('books', 'books.id', 'book_id')
   .then((books) => {
     let camelBooks = humps.camelizeKeys(books)
     res.send(camelBooks);
   })
   .catch((err) => {
     next(err);
   });
})

router.get('/check', (req, res, next) => {
  // this is where I stopped. Set this up to taken an id. 
  let bookId = req.query.bookId
  knex('favorites')
   .join('books', 'books.id', 'book_id')
   .then((books) => {
     let camelBooks = humps.camelizeKeys(books)
     res.send(camelBooks);
   })
   .catch((err) => {
     next(err);
   });

  // check out express docs for handling this route
})

router.post('/', (req, res, next) => {
  res.end()
})

router.delete('/', (req, res, next) => {
  res.end()
})

module.exports = router;
