const Brand = require('../models/brand');
const SKU = require('../models/sku');
const async = require('async');
const { body, validationResult } = require('express-validator');
const brand = require('../models/brand');

// Index page
exports.index = (req, res, next) => {
  res.render('index');
};

// Display create brand form on GET
exports.brand_create_get = (req, res, next) => {
  res.render('brand_create', { title: 'Create a new brand' });
};

// Handle create brand form on POST
exports.brand_create_post = [
  // Validate and sanitise
  body('brand_name', 'Brand name required')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  body('about')
    .trim()
    .isLength({ max: 2000 })
    .withMessage('About exceeds max of 2000 characters')
    .isLength({ min: 1 })
    .withMessage('About section required')
    .escape(),

  // Process request now sanitised
  (req, res, next) => {
    // Extract validation errors from the request
    const errors = validationResult(req);

    // Create a brand object with the santised data
    const brand = new Brand({
      name: req.body.brand_name,
      about: req.body.about,
    });

    // Check for error and render form again if neccessary

    if (!errors.isEmpty()) {
      res.render('brand_create', {
        title: 'Create a new brand',
        brand: brand,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid
      // Check if brand already exists
      Brand.findOne({ name: req.body.brand_name }).exec((err, found_brand) => {
        if (err) {
          return next(err);
        }
        if (found_brand) {
          res.redirect(found_brand.url);
        } else {
          brand.save((err) => {
            if (err) {
              return next(err);
            }
            // Brand is saved so forward to the new brand detail page
            res.redirect(brand.url);
          });
        }
      });
    }
  },
];

// Delete brand on GET
exports.brand_delete_get = (req, res, next) => {
  async.parallel(
    {
      brand(callback) {
        Brand.findById(req.params.id).exec(callback);
      },
      brand_items(callback) {
        SKU.find({ brand: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.brand === null) {
        res.redirect('/stock/brands_list');
      }
      res.render('brand_delete', {
        title: `Delete ${results.brand.name} brand`,
        brand: results.brand,
        brand_items: results.brand_items,
      });
    }
  );
};

// Delete brand on POST
exports.brand_delete_post = (req, res, next) => {
  async.parallel(
    {
      brand(callback) {
        Brand.findById(req.params.id).exec(callback);
      },
      brand_items(callback) {
        SKU.find({ brand: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.brand_items.length > 0) {
        res.render('brand_delete', {
          title: `Delete ${results.brand.name} brand`,
          brand: results.brand,
          brand_items: results.brand_items,
        });
      }
      Brand.findByIdAndRemove(req.body.brandid, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/stock/all_brands');
      });
    }
  );
};

// Form for updating brand on GET
exports.brand_update_get = (req, res, next) => {
  Brand.findById(req.params.id).exec((err, found_brand) => {
    if (err) {
      return next(err);
    }
    // Found the brand so pass to form
    res.render('brand_create', {
      title: `Update details for ${brand.name}`,
      brand: found_brand,
    });
  });
};

// Form for updating brand on POST
exports.brand_update_post = [
  // Validate and sanitise

  body('brand_name', 'Brand name required')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  body('about')
    .trim()
    .isLength({ max: 2000 })
    .withMessage('About exceeds max of 2000 characters')
    .isLength({ min: 1 })
    .withMessage('About section required')
    .escape(),

  // Process request

  (req, res, next) => {
    const errors = validationResult(req);

    const brand = new Brand({
      name: req.body.brand_name,
      about: req.body.about,
      _id: req.params.id,
    });

    // Check for errors and render form again is neccessary
    if (!errors.isEmpty()) {
      res.render('brand_create', {
        title: `Update details for ${brand.name}`,
        brand: brand,
        errors: errors.array(),
      });
      return;
    } else {
      // Check updated brand name doesn't already exist
      Brand.findOne({ name: req.body.brand_name }).exec((err, found_brand) => {
        if (err) {
          return next(err);
        }
        if (found_brand) {
          res.redirect(found_brand.url);
        } else {
          Brand.findByIdAndUpdate(req.params.id, brand, {}, (err, thebrand) => {
            if (err) {
              return next(err);
            }
            res.redirect(thebrand.url);
          });
        }
      });
    }
  },
];

// Detail page for an individual brand
exports.brand_detail = (req, res, next) => {
  async.parallel(
    {
      brand(callback) {
        Brand.findById(req.params.id).exec(callback);
      },
      brand_items(callback) {
        SKU.find({ brand: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.brand === null) {
        const err = new Error('Brand not found');
        res.status = 404;
        return next(err);
      }
      res.render('brand_detail', {
        brand: results.brand,
        items_list: results.brand_items,
      });
    }
  );
};

// Page for all brands
exports.brand_list = (req, res) => {
  Brand.find({})
    .sort({ name: 1 })
    .exec((err, list_brands) => {
      if (err) {
        return next(err);
      }
      res.render('brand_list', { title: 'All Brands', list_brands });
    });
};
