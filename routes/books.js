 'use strict';

 const express = require('express');

 // eslint-disable-next-line new-cap
 const router = express.Router();
 const knex = require('../knex')
 const hbs = require('handlebars')
 const humps = require('humps');
 const boom = require('boom')

  function letUserInput(req, res, _next) {
    for (var key in req.body) {
      if (!req.body.title) {
        return _next(boom.create(400, 'Title must not be blank'))
      } else if (!req.body.genre) {
          return _next(boom.create(400, 'Genre must not be blank'))
      } else if (!req.body.author) {
          return _next(boom.create(400, 'Author must not be blank'))
      } else if (!req.body.description) {
          return _next(boom.create(400, 'Description must not be blank'))
      } else if (!req.body.coverUrl) {
          return _next(boom.create(400, 'Cover URL must not be blank'))
      }
    }
    _next()
  }

 function needError (req, res, _next) {
   if (holdError.length < 1) {
     _next()
   } else {
     console.log("error array", holdError);
     for (var i = 0; i < holdError.length; i++) {
       return _next(boom.create(400, `${holdError[i]} must not be blank`))
     }
   }
 }


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
   let id = +req.params.id
   if (!Number.isNaN(id)) {
     knex('books')
       .where('id', `${id}`)
       .then(book => {
         if (book.length >= 1) {
           let humpBook = humps.camelizeKeys(book)
           res.send(humpBook[0])
         } else {
           return _next(boom.create(404, 'Not Found'))
         }
       })
       .catch(err => {
         console.error(err.message);
       })
   } else {
     return _next(boom.create(404, 'Not Found'))
   }
 })


//  add letUserInput and needError into the post substack once I figure out how to get right key in error message.
 router.post('/', letUserInput, needError, (req, res, _next) => {

   knex('books')
     .insert({
       title: req.body.title,
       author: req.body.author,
       genre: req.body.genre,
       description: req.body.description,
       cover_url: req.body.coverUrl
     }, '*')
     .then(post => {
       let camelPost = humps.camelizeKeys(post)
       res.send(camelPost[0])
     })
     .catch(err => {
       return next(boom.create(404, 'Not Found'))
     })
 })
 //
 router.patch('/:id', (req, res, _next) => {
   let body = req.body
   let id = +req.params.id

   if (!Number.isNaN(id)) {
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
         if (data.length >= 1) {
           let updateHumps = humps.camelizeKeys(data)
           res.send(updateHumps[0])
         } else {
           return _next(boom.create(404, 'Not Found'))
         }
       })
       .catch(err => {
         return _next(boom.create(404, 'Not Found'))
       })
   } else {
     return _next(boom.create(404, 'Not Found'))
   }
 })

 router.delete('/:id', (req, res, _next) => {
   let id = +req.params.id
   if (!Number.isNaN(id)) {
     knex('books')
       .where('id', `${id}`)
       .del()
       .returning(['title', 'author', 'genre', 'description', 'cover_url'])
       .then(deleteData => {
         if (deleteData.length === 1) {
           let camelDelete = humps.camelizeKeys(deleteData)
           res.send(camelDelete[0])
         } else {
           return _next(boom.notFound('Not Found'))
         }
       })
   } else {
     return _next(boom.notFound('Not Found'))
   }
 })

 module.exports = router;
