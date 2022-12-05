const express = require('express');
const router = express.Router();

// Require the controller modules
const brand_controller = require('../controllers/brandController');
const discipline_controller = require('../controllers/disciplineController');
const sku_controller = require('../controllers/skuController');

// GET home page
router.get('/', brand_controller.index);

// BRAND ROUTES //

// GET request for creating a new brand
router.get('/brand/create', brand_controller.brand_create_get);

// POST request for creating a new brand
router.post('/brand/create', brand_controller.brand_create_post);

// GET request for deleting a brand
router.get('/brand/:id/delete', brand_controller.brand_delete_get);

// POST request for deleting a brand
router.post('/brand/:id/delete', brand_controller.brand_delete_post);

// GET request for updating a brand
router.get('/brand/:id/update', brand_controller.brand_update_get);

// POST request for updating a brand
router.post('/brand/:id/update', brand_controller.brand_update_post);

// GET request for individual brand page
router.get('/brand/:id', brand_controller.brand_detail);

// GET request for all brands page
router.get('/all_brands', brand_controller.brand_list);

// DISCIPLINE ROUTES

// GET request for creating a new discipline
router.get('/discipline/create', discipline_controller.discipline_create_get);

// POST request for creating a new discipline
router.post('/discipline/create', discipline_controller.discipline_create_post);

// GET request for deleting a discipline
router.get(
  '/discipline/:id/delete',
  discipline_controller.discipline_delete_get
);

// POST request for deleting a discipline
router.post(
  '/discipline/:id/delete',
  discipline_controller.discipline_delete_post
);

// GET request for updating a discipline
router.get(
  '/discipline/:id/update',
  discipline_controller.discipline_update_get
);

// POST request for updating a discipline
router.post(
  '/discipline/:id/update',
  discipline_controller.discipline_update_post
);

// GET request for individual discipline
router.get('/discipline/:id', discipline_controller.discipline_detail);

// GET request for all disciplines page
router.get('/all_disciplines', discipline_controller.disciplines_list);

// SKU ROUTES

// GET request for creating a new SKU
router.get('/sku/create', sku_controller.sku_create_get);

// POST request for creating a new SKU
router.post('/sku/create', sku_controller.sku_create_post);

// GET request for deleting a SKU
router.get('/sku/:id/delete', sku_controller.sku_delete_get);

// POST request for deleting a SKU
router.post('/sku/:id/delete', sku_controller.sku_delete_post);

// GET request for updating a SKU
router.get('/sku/:id/update', sku_controller.sku_update_get);

// POST request for updating a SKU
router.post('/sku/:id/update', sku_controller.sku_update_post);

// GET request for viewing an individual SKU
router.get('/sku/:id', sku_controller.sku_details);

// GET request for viewing all SKUs
router.get('/skus_list', sku_controller.skus_list);

module.exports = router;
