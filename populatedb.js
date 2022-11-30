#! /usr/bin/env node

console.log('Loading Sample Data...');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async');
var SKU = require('./models/sku');
var Brand = require('./models/brand');
var Discipline = require('./models/discipline');
var SKUInstance = require('./models/skuInstance');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var brands = [];
var disciplines = [];
var skus = [];
var skuinstances = [];

function brandCreate(name, about, cb) {
  // Make temp object mirroring model schema
  brandDetail = { name: name, about: about };

  var brand = new Brand(brandDetail);

  brand.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Brand: ' + brand);
    brands.push(brand);
    cb(null, brand);
  });
}

function disciplineCreate(name, cb) {
  var discipline = new Discipline({ name: name });

  discipline.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Discipline: ' + discipline);
    disciplines.push(discipline);
    cb(null, discipline);
  });
}

function skuCreate(category, brand, model, discipline, price, cb) {
  skudetail = {
    category: category,
    brand: brand,
    model: model,
    discipline: discipline,
    price: price,
  };
  if (discipline != false) bookdetail.skudetail = discipline;

  var sku = new SKU(SKUDetail);
  sku.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New SKU: ' + sku);
    skus.push(sku);
    cb(null, sku);
  });
}

function skuInstanceCreate(sku, size, unit, quality, cb) {
  skuinstancedetail = {
    sku: sku,
    size: size,
    unit: unit,
    quality: quality,
  };

  var skuinstance = new SKUInstance(SKUInstanceDetail);
  skuinstance.save(function (err) {
    if (err) {
      console.log('ERROR CREATING SKUInstance: ' + skuinstance);
      cb(err, null);
      return;
    }
    console.log('New SKUInstance: ' + skuinstance);
    skuinstances.push(skuinstance);
    cb(null, skuinstance);
  });
}

function createDisciplineBrands(cb) {
  async.series(
    [
      function (callback) {
        brandCreate(
          'North Sails',
          `North Sails was founded in 1957, in San Diego, California by Lowell North who gave up rocket science to become a sailmaker. 
          Lowell North (an Olympic gold & bronze medallist) built his company based on science, using constant testing and rigorous 
          scientific methodology to build better sails changing sail making forever. Fast forward to 2018 and North Sails have applied 
          all their scientific know-how along with Norths clear purpose, creativity and competitive spirit, to produce some of the most 
          technologically advanced products to grace the water. Along with Sails, North offer some of the lightest windsurfing hardware 
          on earth including carbon booms and masts.`,
          callback
        );
      },
      function (callback) {
        brandCreate(
          'Ezzy Sails',
          `We use the beautiful beaches of Maui as our testing grounds for Ezzy products, and it is in our Maui sail 
          loft that most of our ideas are conceived.After perfecting the latest designs in Hawaii, we then need to put our manufacturing skills
          into over drive, and our factory in Sri Lanka steps in and puts the same development and pride into the sails that we do stateside.`,
          callback
        );
      },
      function (callback) {
        brandCreate(
          'JP Australia',
          `The brand name stands for Jason Polakow (“JP”) from Australia.
          The No. 1 big wave sailor in the world and two times Wave World Champion is a legend in the sport of windsurfing. Jasons impressive power and 
          speed in wave sailing influenced the riding style for decades with major effects on todays wave board shapes. The brand has been established 
          in spring 1997. In the beginning, JP was a pure windsurfing brand, positioned on the market with an exclusive touch and a radical, hardcore 
          wave and freestyle image. Today, JP covers all aspects of windsurfing, is a big player also in SUP and now focusses on foiling, too.`,
          callback
        );
      },
      function (callback) {
        disciplineCreate('Wave', callback);
      },
      function (callback) {
        disciplineCreate('Freestyle', callback);
      },
      function (callback) {
        disciplineCreate('Freeride', callback);
      },
      function (callback) {
        disciplineCreate('Kids', callback);
      },
    ],
    // optional callback
    cb
  );
}

function createSKUS(cb) {
  async.parallel(
    [
      function (callback) {
        skuCreate(
          'Sail',
          brands[0],
          'Super Hero HD',
          disciplines[0],
          1499,
          callback
        );
      },
      function (callback) {
        skuCreate(
          'Board',
          brands[1],
          'Ultimate Wave Pro',
          disciplines[2],
          499,
          callback
        );
      },
      function (callback) {
        skuCreate(
          'Mast',
          brands[2],
          'RDM Legacy C60%',
          disciplines[0],
          256,
          callback
        );
      },
      function (callback) {
        skuCreate(
          'Boom',
          brands[0],
          'Platinum Series',
          disciplines[2],
          689,
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

function createSKUInstances(cb) {
  async.parallel(
    [
      function (callback) {
        skuInstanceCreate(skus[0], 5.7, 'm2', 'New', callback);
      },
      function (callback) {
        skuInstanceCreate(skus[1], 83, 'litres', 'Used - Immaculate', callback);
      },
      function (callback) {
        skuInstanceCreate(skus[2], 400, 'cm', 'Used - Good', callback);
      },
      function (callback) {
        skuInstanceCreate(skus[3], 220, 'cm', 'Used - Worn', callback);
      },
    ],
    // Optional callback
    cb
  );
}

async.series(
  [createDisciplineBrands, createSKUS, createSKUInstances],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    } else {
      console.log('SKUInstances: ' + skuinstances);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
