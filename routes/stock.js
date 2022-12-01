const express = require('express');
const router = express.Router();

// Require the controller modules
const brand_controller = require('../controllers/brandController');

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

module.exports = router;
