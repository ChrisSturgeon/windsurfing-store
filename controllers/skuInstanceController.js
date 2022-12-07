const SKU = require('../models/sku');
const SKUInstance = require('../models/skuInstance');
const async = require('async');
const { body, validationResult } = require('express-validator');

// Form for new SKU on get
exports.sku_instance_create_get = (req, res, next) => {
  SKU.find({})
    .sort({ model: 1 })
    .exec((err, sku_list) => {
      if (err) {
        return next(err);
      }
      res.render('sku_instance_create', {
        title: 'Create a new SKU Instance',
        sku_list: sku_list,
      });
    });
};

// Form for new SKU on POST
exports.sku_instance_create_post = [
  // Validate and sanitise the form inputs
  body('model', 'Model Required').isLength({ min: 1 }).escape(),
  body('size', 'Size Required').isFloat({ min: 1 }).trim().escape(),
  body('size_unit', 'Size Unit Required').isLength({ min: 1 }).trim().escape(),
  body('quality', 'Quality Rating Required').isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const instance = new SKUInstance({
      sku: req.body.model,
      size: req.body.size,
      unit: req.body.size_unit,
      quality: req.body.quality,
    });

    if (!errors.isEmpty()) {
      SKU.find({})
        .sort({ model: 1 })
        .exec((err, sku_list) => {
          if (err) {
            return next(err);
          }
          res.render('sku_instance_create', {
            title: 'Create a new SKU Instance',
            instance: instance,
            sku_list: sku_list,
            errors: errors.array(),
          });
        });
    } else {
      instance.save((err) => {
        if (err) {
          return next(err);
        }
        SKU.findById(instance.sku).exec((err, found_sku) => {
          if (err) {
            return next(err);
          }
          res.redirect(found_sku.url);
        });
      });
    }
  },
];

// Form for delete SKU on GET
exports.sku_instance_delete_get = (req, res, next) => {
  SKUInstance.findById(req.params.id).exec((err, found_instance) => {
    if (err) {
      return next(err);
    }
    res.render('sku_instance_delete', {
      title: 'Delete Stock Item',
      instance: found_instance,
    });
  });
};

// Form for delete SKU on POST
exports.sku_instance_delete_post = (req, res, next) => {
  SKUInstance.findByIdAndRemove(req.body.instanceID, (err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/stock/skus_list');
  });
};

// Form for updating SKU on GET
exports.sku_instance_update_get = (req, res, next) => {
  async.parallel(
    {
      instance(callback) {
        SKUInstance.findById(req.params.id).exec(callback);
      },
      sku_list(callback) {
        SKU.find({}).sort({ model: 1 }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render('sku_instance_create', {
        title: 'Update stock item',
        instance: results.instance,
        sku_list: results.sku_list,
      });
    }
  );
};

// Form for updating SKU on POST
exports.sku_instance_update_post = [
  // Validate and sanitise the form inputs
  body('model', 'Model Required').isLength({ min: 1 }).escape(),
  body('size', 'Size Required').isFloat({ min: 1 }).trim().escape(),
  body('size_unit', 'Size Unit Required').isLength({ min: 1 }).trim().escape(),
  body('quality', 'Quality Rating Required').isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const instance = new SKUInstance({
      sku: req.body.model,
      size: req.body.size,
      unit: req.body.size_unit,
      quality: req.body.quality,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      SKU.find({})
        .sort({ model: 1 })
        .exec((err, sku_list) => {
          if (err) {
            return next(err);
          }
          res.render('sku_instance_create', {
            title: 'Create a new SKU Instance',
            instance: instance,
            sku_list: sku_list,
            errors: errors.array(),
          });
        });
      return;
    } else {
      SKUInstance.findByIdAndUpdate(
        req.params.id,
        instance,
        {},
        (err, theinstance) => {
          if (err) {
            return next(err);
          }
          res.redirect(theinstance.url);
        }
      );
    }
  },
];

// Display details page for individual SKU
exports.instance_details = async (req, res, next) => {
  function getSkuInstance() {
    return SKUInstance.findById(req.params.id);
  }

  function getSku(id) {
    return SKU.findById(id);
  }

  try {
    const sku_instance = await getSkuInstance();
    const sku = await getSku(sku_instance.sku);

    res.render('sku_instance_detail', {
      title: 'SKU Instance Detail',
      sku_instance: sku_instance,
      sku: sku,
    });
  } catch (err) {
    return next(err);
  }
};

// Display list of all SKUs
exports.instance_list = (req, res, next) => {};
