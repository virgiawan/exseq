import fs from 'fs';
import path from 'path';
import express from 'express';

const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'development';
const router = express.Router();

/*
* created by virgiawan
* t: @sapi_mabur
*/

// populate internal api source code
fs
  .readdirSync(path.join(__dirname, '/api'))
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    let mPath = path.join(__dirname, '/api', file);
    let temp = require(mPath)['default'];
    if(temp){
      router.use(temp.path, temp.router);
    }
  });

export default router;