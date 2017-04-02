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

function loggedIn(req, res, next) {
  if(req.cookies.token) {
    next()
  } else {
    return next(Boom.unauthorized('Unauthorized'))
  }
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
let bookId = req.query.bookId
  knex('favorites')
   .join('books', 'books.id', 'book_id')
   .where('book_id', `${bookId}`)
   .then((book) => {
     if(book.length > 0) {
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
})

router.post('/', loggedIn, (req, res, next) => {
  const token = req.cookies
  const favorite = req.body.bookId

  knex('favorites')
  .insert([{
    book_id: `${req.body.bookId}`,
    user_id: 1,
    // user_id: `${}`, // decrpyt jwt token and get user id
   }])
   .returning('*')
   .then(newFav => {

     let camelFav = humps.camelizeKeys(newFav)
     res.status(200)
       .set('Content-Type', 'application/json')
       .send(camelFav[0])
   })
   .then((sql) => {
     console.log('setval', sql);
     return knex.raw("SELECT setval('favorites_id_seq', (SELECT MAX(id) FROM favorites));")
})
// setval not working. come back later. do manually for now.
})
router.delete('/', loggedIn, (req, res, next) => {
  knex('favorites')
  .where('book_id', `${req.body.bookId}`)
  .del()
  .returning('*')
  .then(gone => {
    console.log('GONE', gone);
    let camelGone = humps.camelizeKeys(gone)

    res.send({bookId: `${camelGone[0].bookId}`, userId: `${camelGone[0].userId}`})
  })
})

module.exports = router;
