const Discipline = require('../models/discipline');
const SKU = require('../models/sku');
const async = require('async');
const { body, validationResult } = require('express-validator');
const discipline = require('../models/discipline');

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

// Delete discipline on GET request
exports.discipline_delete_get = (req, res, next) => {
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
        res.redirect('/stock/disciplines_list');
      }
      res.render('discipline_delete', {
        title: `Delete ${results.discipline.name} category`,
        discipline: results.discipline,
        discipline_items: results.discipline_items,
      });
    }
  );
};

// Delete brand on POST
exports.discipline_delete_post = (req, res, next) => {
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
      if (results.discipline_items.length > 0) {
        res.render('discipline_delete', {
          title: `Delete ${results.discipline.name} category`,
          discipline: results.discipline,
          discipline_items: results.discipline_items,
        });
      }
      Discipline.findByIdAndRemove(req.body.disciplineID, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/stock/all_disciplines');
      });
    }
  );
};

// Form for updating discipline on GET
exports.discipline_update_get = (req, res, next) => {
  Discipline.findById(req.params.id).exec((err, found_discipline) => {
    if (err) {
      return next(err);
    }
    // Found brand so render form
    res.render('discipline_create', {
      title: `Update ${found_discipline.name}`,
      discipline: found_discipline,
    });
  });
};

exports.discipline_update_post = [
  body('discipline_name', 'Style name required')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const discipline = new Discipline({
      name: req.body.discipline_name,
      _id: req.params.id,
    });

    // Check for errors
    if (!errors.isEmpty()) {
      res.render('discipline_create', {
        title: `Update details for ${discipline.name}`,
        discipline: discipline,
        errors: errors.array(),
      });
      return;
    } else {
      // Check discipline name isn't already registered
      Discipline.findOne({ name: req.body.discipline_name }).exec(
        (err, found_discipline) => {
          if (err) {
            return next(err);
          }
          if (found_discipline) {
            res.redirect(found_discipline.url);
          } else {
            Discipline.findByIdAndUpdate(
              req.params.id,
              discipline,
              {},
              (err, thediscipline) => {
                if (err) {
                  return next(err);
                }
                res.redirect(thediscipline.url);
              }
            );
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
