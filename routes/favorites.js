'use strict';

const express = require('express')
const knex = require('../knex')
const jwt = require('jsonwebtoken');
const cookieSession = require('cookie-session')
const Boom = require('boom')
const bodyParser = require('body-parser')
const humps = require('humps')
const ev = require('express-validation')
const validations = require('../validations/favorites')
// eslint-disable-next-line new-cap
const router = express.Router();

function loggedIn(req, res, next) {
  if (req.cookies.token) {
    next()
  } else {
    return next(Boom.unauthorized('Unauthorized'))
  }
}

function bookExists(req, res, next) {
  knex('books')
    .where('id', `${req.body.bookId}`)
    .then(book => {
      next()
    })
    .catch(err => next(Boom.create(400, 'Book not found')))
}

router.get('/', loggedIn, (req, res, next) => {
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

router.get('/check', loggedIn, (req, res, next) => {
  let bookId = +req.query.bookId

  if (!Number.isNaN(bookId)) {
    knex('favorites')
      .join('books', 'books.id', 'book_id')
      .where('book_id', `${bookId}`)
      .then((book) => {
        if (book.length > 0) {
          res.status(200)
            .set('Content-Type', 'application/json')
            .send('true')
        } else {
          res.status(200)
            .set('Content-Type', 'application/json')
            .send('false')
        }
      })
      .catch((err) => {
        next(err);
      });
  } else {
    return next(Boom.create(400, 'Book ID must be an integer'))
  }
})


// when I have ev(validations.post)...I can't add favorites..However I am validating it somewhat too
router.post('/', loggedIn, (req, res, next) => {
  const token = req.cookies
  const favorite = +req.body.bookId

  if (!Number.isNaN(favorite)) {
    knex('favorites')
      .insert([{
        book_id: `${req.body.bookId}`,
        user_id: 1,
      }])
      .returning('*')
      .then(newFav => {

        let camelFav = humps.camelizeKeys(newFav)
        res.status(200)
          .set('Content-Type', 'application/json')
          .send(camelFav[0])
      })
      .then((sql) => {
        return knex.raw("SELECT setval('favorites_id_seq', (SELECT MAX(id) FROM favorites));")
      })
      .catch(err => next(Boom.create(404, 'Book not found')))
  } else {
    return next(Boom.create(400, 'Book ID must be an integer'))
  }
})

router.delete('/', loggedIn, (req, res, next) => {
  let book = +req.body.bookId
  if (!Number.isNaN(book)) {
    knex('favorites')
      .where('book_id', `${req.body.bookId}`)
      .del()
      .returning('*')
      .then(gone => {
        let camelGone = humps.camelizeKeys(gone)

        res.send({
          bookId: `${camelGone[0].bookId}`,
          userId: `${camelGone[0].userId}`
        })
      })
      .catch(err => next(Boom.notFound('Favorite not found')))
  } else {
    return next(Boom.create(400, 'Book ID must be an integer'))
  }
})

module.exports = router;
