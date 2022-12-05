const SKU = require('../models/sku');
const SKUInstance = require('../models/skuInstance');
const async = require('async');
const { body, validationResult } = require('express-validator');
const { response } = require('../app');

// Form for new SKU on get
exports.sku_instance_create_get = (req, res, next) => {};

// Form for new SKU on POST
exports.sku_instance_create_post = [];

// Form for delete SKU on GET
exports.sku_instance_delete_get = (req, res, next) => {};

// Form for delete SKU on POST
exports.sku_instance_delete_post = (req, res, next) => {};

// Form for updating SKU on GET
exports.sku_instance_update_get = (req, res, next) => {};

// Form for updating SKU on POST
exports.sku_instance_update_post = [];

// Display details page for individual SKU
exports.instance_details = async (req, res, next) => {
  // const sku_instance = await SKUInstance.findById(req.params.id);
  // const sku = await SKU.findById(sku_instance.sku);

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
