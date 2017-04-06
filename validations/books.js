'use strict';
const Joi = require('joi');

module.exports.post = {
  body: {
    title: Joi.string().required(),
    author: Joi.string().required(),
    genre: Joi.string().required(),
    description: Joi.string().required(),
    coverUrl: Joi.string().required()
  }
};
