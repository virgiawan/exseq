import fs from 'fs';
import path from 'path';

const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'development';
const helpers = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename);
  })
  .forEach(function(file) {
    let mPath = path.join(__dirname, file);
    let temp = require(mPath)['default'];
    helpers[temp.name] = temp[temp.name];
  });


export default helpers;
