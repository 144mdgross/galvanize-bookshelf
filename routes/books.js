'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex')
const hbs = require('handlebars')
const humps = require('humps');

router.get('/', (req, res, _next) => {
  knex('books')
   .orderBy('title', 'asc')
   .then((books) => {
     let camelBooks = humps.camelizeKeys(books)
     res.send(camelBooks);
   })
   .catch((err) => {
     next(err);
   });
})

router.get('/:id', (req, res, _next) => {
  let id = req.params.id
  knex('books')
  .where('id', `${id}`)
  .then(book => {
    let humpBook = humps.camelizeKeys(book)
    res.send(humpBook[0])
  })
})
// note i changed the test to have an id matching b/c i inserted it twice through testing it seems....maybe there is a better way?
router.post('/', (req, res, _next) => {
  console.log('anybody here?');
  knex('books')
  .insert({
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    description: req.body.description,
    cover_url: req.body.coverUrl
  }, '*')
  .then(post => {
    console.log(post, 'anything here?');
    let camelPost = humps.camelizeKeys(post)
    res.send(camelPost[0])
  })
})
//
router.patch('/:id', (req, res, _next) => {
  let body =req.body
  let id = +req.params.id

  knex('books')
  .where('id', `${id}`)
  .update({
    'title': req.body.title,
    'author': req.body.author,
    'genre': req.body.genre,
    'description': req.body.description,
    'cover_url': req.body.coverUrl
  })
  .returning('*')
  .then(data => {
    let updateHumps = humps.camelizeKeys(data)
    res.send(updateHumps[0])
  })

})

router.delete('/:id', (req, res, _next) => {
  let id = +req.params.id
  knex('books')
  .where('id', `${id}`)
  .del()
  .returning(['title', 'author', 'genre', 'description', 'cover_url'])
  .then(deleteData => {
    let camelDelete = humps.camelizeKeys(deleteData)
    res.send(camelDelete[0])

  })

})

module.exports = router;
