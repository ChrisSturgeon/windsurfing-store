const SKU = require('../models/sku');
const async = require('async');
const { body, validationResult } = require('express-validator');
const Brand = require('../models/brand');
const SKUInstance = require('../models/skuInstance');
const Discipline = require('../models/discipline');
const Sku = require('../models/sku');
const sku = require('../models/sku');

// Form for new SKU on get
exports.sku_create_get = (req, res, next) => {
  async.parallel(
    {
      brands_list(callback) {
        Brand.find().sort({ name: 1 }).exec(callback);
      },
      discipline_list(callback) {
        Discipline.find().sort({ name: 1 }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render('sku_create', {
        title: 'Create a new SKU',
        brands_list: results.brands_list,
        discipline_list: results.discipline_list,
      });
    }
  );
};

// Form for new SKU on POST
exports.sku_create_post = [
  // Validate and sanitise the inputs
  body('category', 'Category required').isLength({ min: 1 }).escape(),
  body('style', 'Style required').isLength({ min: 1 }).escape(),
  body('brand', 'Brand required').isLength({ min: 1 }).escape(),
  body('model', 'Model required').trim().isLength({ min: 1 }).escape(),
  body('price', 'Price required')
    .trim()
    .isFloat({ min: 0.1, max: 10000 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const sku = new Sku({
      category: req.body.category,
      brand: req.body.brand,
      model: req.body.model,
      discipline: req.body.style,
      price: req.body.price,
    });

    if (!errors.isEmpty()) {
      async.parallel(
        {
          brands_list(callback) {
            Brand.find().sort({ name: 1 }).exec(callback);
          },
          discipline_list(callback) {
            Discipline.find().sort({ name: 1 }).exec(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          res.render('sku_create', {
            title: 'Create a new SKU',
            brands_list: results.brands_list,
            discipline_list: results.discipline_list,
            errors: errors.array(),
          });
        }
      );
    } else {
      // Check model doesn't already exist
      SKU.findOne({ model: req.body.model }).exec((err, found_sku) => {
        if (err) {
          return next(err);
        }
        if (found_sku) {
          res.redirect(found_sku.url);
        } else {
          sku.save((err) => {
            if (err) {
              return next(err);
            }
            res.redirect(sku.url);
          });
        }
      });
    }
  },
];

// Form for delete SKU on GET
exports.sku_delete_get = (req, res, next) => {
  async.parallel(
    {
      sku(callback) {
        SKU.findById(req.params.id).exec(callback);
      },
      sku_instances(callback) {
        SKUInstance.find({ sku: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.sku === null) {
        res.redirect('/stock/skus_list');
      }
      res.render('sku_delete', {
        title: `Delete SKU: ${results.sku.model}`,
        sku: results.sku,
        sku_instances: results.sku_instances,
      });
    }
  );
};

// Form for delete SKU on POST
exports.sku_delete_post = (req, res, next) => {
  async.parallel(
    {
      sku(callback) {
        SKU.findById(req.params.id).exec(callback);
      },
      sku_instances(callback) {
        SKUInstance.find({ sku: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.sku_instances > 0) {
        res.render('sku_delete', {
          title: `Delete SKU: ${results.sku.model}`,
          sku: results.sku,
          sku_instances: results.sku_instances,
        });
      }
      SKU.findByIdAndRemove(req.body.skuID, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/stock/skus_list');
      });
    }
  );
};

// Form for updating SKU on GET
exports.sku_update_get = (req, res, next) => {
  async.parallel(
    {
      brands_list(callback) {
        Brand.find().sort({ name: 1 }).exec(callback);
      },
      discipline_list(callback) {
        Discipline.find().sort({ name: 1 }).exec(callback);
      },
      found_sku(callback) {
        SKU.findById(req.params.id).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render('sku_create', {
        title: `Update details for ${results.found_sku.model}`,
        brands_list: results.brands_list,
        discipline_list: results.discipline_list,
        sku: results.found_sku,
      });
    }
  );
};

// Form for updating SKU on POST
exports.sku_update_post = [
  // Validate and sanitise the inputs
  body('category', 'Category required').isLength({ min: 1 }).escape(),
  body('style', 'Style required').isLength({ min: 1 }).escape(),
  body('brand', 'Brand required').isLength({ min: 1 }).escape(),
  body('model', 'Model required').trim().isLength({ min: 1 }).escape(),
  body('price', 'Price required')
    .trim()
    .isFloat({ min: 0.1, max: 10000 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const sku = new Sku({
      category: req.body.category,
      brand: req.body.brand,
      model: req.body.model,
      discipline: req.body.style,
      price: req.body.price,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      async.parallel(
        {
          brands_list(callback) {
            Brand.find().sort({ name: 1 }).exec(callback);
          },
          discipline_list(callback) {
            Discipline.find().sort({ name: 1 }).exec(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          res.render('sku_create', {
            title: `Update details for ${sku.model}`,
            brands_list: results.brands_list,
            discipline_list: results.discipline_list,
            sku: sku,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      SKU.findByIdAndUpdate(req.params.id, sku, {}, (err, thesku) => {
        if (err) {
          return next(err);
        }
        res.redirect(thesku.url);
      });
    }
  },
];

// Display details page for individual SKU
exports.sku_details = (req, res, next) => {
  SKU.findById(req.params.id).exec((err, found_sku) => {
    if (err) {
      return next(err);
    }
    res.render('sku_detail', {
      title: `Details for ${found_sku.model}`,
      sku: found_sku,
    });
  });
};

// Display list of all SKUs
exports.skus_list = (req, res, next) => {
  SKU.find({})
    .sort({ model: 1 })
    .exec((err, sku_list) => {
      if (err) {
        return next(err);
      }
      res.render('skus_list', { title: 'All SKUs', list_skus: sku_list });
    });
};
