'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Clip Schema
 */
var ClipSchema = new Schema({
  text: {
    type: String,
    default: '',
    required: 'Please fill in sentence',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  clipId: {
    type: String,
    default: '',
    required: 'Please fill in YouTube id',
    trim: true
  },
  start: {
    type: Number,
    default: 0,
    required: 'Please fill in start time'
  },
  length: {
    type: Number,
    default: 0,
    required: 'Please fill in length'
  },
  numWords: {
    type: Number,
    default: 0
  },
  numWordsExcludingArticles: {
    type: Number,
    default: 0
  },
  public: {
    type: Boolean,
    default: 0
  }

});

mongoose.model('Clip', ClipSchema);