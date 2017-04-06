'use strict';
const Joi = require('joi')

// req.body
// req.query
// req.params
// req.header
// req.cookies

module.exports.post = {
  body: {
    email: Joi.string()
      .label('Email')
      .required()
      .email()
      .trim(),

    password: Joi.string()
      .label('Password')
      .required()
      .trim()
      .min(8)
  }
};
