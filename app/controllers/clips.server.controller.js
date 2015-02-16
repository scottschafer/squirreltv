'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  Clip = mongoose.model('Clip'),
  _ = require('lodash');

Clip.prototype.updateWordCount = function () {
  var clip = this;
  var words = clip.text.split(' ');
  clip.numWords = words.length;
  clip.numWordsExcludingArticles = 0;
  var ignoreWords = "the a an of by ";

  for (var i = 0; i < words.length; i++) {
    if (ignoreWords.indexOf(words[i].toLowerCase() + ' ') == -1) {
      ++clip.numWordsExcludingArticles;
    }
  };

  console.log("updateWordCount(), numWords = " + clip.numWords +
    ", numWordsExcludingArticles = " + clip.numWordsExcludingArticles);
}

/**
 * Create a Clip
 */
exports.create = function (req, res) {
  var clip = new Clip(req.body);
  clip.user = req.user;
  clip.updateWordCount();

  clip.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(clip);
    }
  });
};

/**
 * Show the current Clip
 */
exports.read = function (req, res) {
  res.jsonp(req.clip);
};

/**
 * Update a Clip
 */
exports.update = function (req, res) {
  var clip = req.clip;

  clip = _.extend(clip, req.body);
  clip.updateWordCount();

  clip.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(clip);
    }
  });
};

/**
 * Delete an Clip
 */
exports.delete = function (req, res) {
  var clip = req.clip;

  clip.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(clip);
    }
  });
};

/**
 * List of Clips
 */
exports.list = function (req, res) {
  Clip.find().sort('-created').populate('user', 'displayName').exec(function (err, clips) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(clips);
    }
  });
};

/**
 * Clip middleware
 */
exports.clipByID = function (req, res, next, id) {
  Clip.findById(id).populate('user', 'displayName').exec(function (err, clip) {
    if (err) return next(err);
    if (!clip) return next(new Error('Failed to load Clip ' + id));
    req.clip = clip;
    next();
  });
};

/**
 * Clip authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
  if (req.clip.user.id !== req.user.id) {
    return res.status(403).send('User is not authorized');
  }
  next();
};