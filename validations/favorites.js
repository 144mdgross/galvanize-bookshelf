'use strict'

const Joi = require('joi')

module.exports.post = {
  body: {
    bookId: Joi.string().required(),
  },
  query: {
    bookId: Joi.string().required()
  },


}
