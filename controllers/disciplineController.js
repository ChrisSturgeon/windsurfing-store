const Discipline = require('../models/discipline');
const SKU = require('../models/sku');
const async = require('async');
const { body, validationResult } = require('express-validator');

// Creates new discipline form on GET
exports.discipline_create_get = (req, res, next) => {
  res.render('discipline_create', { title: 'Create a new discipline' });
};

// Creates new discipline on POST
exports.discipline_create_post = [
  body('discipline_name', 'Style name required')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    const discipline = new Discipline({ name: req.body.discipline_name });

    if (!errors.isEmpty()) {
      res.render('discipline_create', {
        title: 'Create a new discipline',
        errors: errors.array(),
      });
    } else {
      // Check discipline doesn't already exist
      Discipline.findOne({ name: req.body.discipline_name }).exec(
        (err, found_discipline) => {
          if (err) {
            return next(err);
          }
          if (found_discipline) {
            res.redirect(found_discipline.url);
          } else {
            discipline.save((err) => {
              if (err) {
                return next(err);
              }
              res.redirect(discipline.url);
            });
          }
        }
      );
    }
  },
];

// Displays details and components for individual discipline
exports.discipline_detail = (req, res, next) => {
  async.parallel(
    {
      discipline(callback) {
        Discipline.findById(req.params.id).exec(callback);
      },
      discipline_items(callback) {
        SKU.find({ discipline: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.discipline === null) {
        const err = new Error('Discipline not found');
        res.status = 404;
        return next(err);
      }
      res.render('discipline_detail', {
        discipline: results.discipline,
        items: results.discipline_items,
      });
    }
  );
};

// Displays list of all disciplines
exports.disciplines_list = (req, res, next) => {
  Discipline.find()
    .sort({ name: 1 })
    .exec((err, list) => {
      if (err) {
        return next(err);
      }
      res.render('discipline_list', {
        title: 'All Disciplines',
        disciplines_list: list,
      });
    });
};
