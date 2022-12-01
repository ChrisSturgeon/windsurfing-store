const { reset } = require('nodemon');
const { response } = require('../app');
const Brand = require('../models/brand');
const SKU = require('../models/sku');
const async = require('async');

// Index page
exports.index = (req, res, next) => {
  res.render('index');
};

// Display create brand form on GET
exports.brand_create_get = (req, res, next) => {
  res.send('Create Brand GET');
};

// Handle create brand form on POST
exports.brand_create_post = (req, res, next) => {
  res.send('Create brand POST');
};

// Delete brand on GET
exports.brand_delete_get = (req, res, next) => {
  res.send('Delete brand GET');
};

// Delete brand on POST
exports.brand_delete_post = (req, res, next) => {
  res.send('Delete brand POST');
};

// Form for updating brand on GET
exports.brand_update_get = (req, res, next) => {
  res.send('Brand Update GET');
};

// Form for updating brand on POST
exports.brand_update_post = (req, res, next) => {
  res.send('Brand Update POST');
};

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

  // res.send(`This is a page for the brand with object ID ${req.params.id}`);
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
