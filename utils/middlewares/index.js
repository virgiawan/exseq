'use strict';

var fs          = require('fs');
var path        = require('path');
var basename    = path.basename(module.filename);
var env         = process.env.NODE_ENV || 'development';
var middlewares = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename);
  })
  .forEach(function(file) {
    let mPath = path.join(__dirname, file);
    let temp = require(mPath)['default'];
    middlewares[temp.name] = temp[temp.name];
  });


export default middlewares;
