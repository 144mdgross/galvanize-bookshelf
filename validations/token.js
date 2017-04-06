'use strict'

const Joi = require('joi')

module.exports.post = {
  body: {
    email: Joi.string().required(),
    password: Joi.string().required()
  }
}
