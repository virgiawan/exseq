'use strict';

import moment from 'moment';
import _ from 'lodash';
import config from '../../config/config.json';
import setting from '../../config/setting.json';
import Sequelize, {Op} from 'sequelize';

const dateFormat = setting.dateFormatUrl;
const mapOp = {
  '$and': Op.and,
  '$or': Op.or,
  '$gte': Op.gte,
  '$lte': Op.lte,
  '$gt': Op.gt,
  '$lt': Op.lt,
};

export default {
  name: 'exseq',
  exseq: {
    buildJson: (resultName, res) => {
      let error;
      if(res.err === undefined){
        error = {}
      }
      else {
        error = {
          name: res.err.name,
          message: res.err.message,
          details: (res.err.errors == undefined) ? [] : res.err.errors
        };
        // if error unauthorized
        // error unauthorized is more priority than other errors
        // replace error message
        if(res.unauthorized)
          if(res.unauthorized.code==401){
            error = {
              name: 'Forbidden',
              message: 'Request Unauthorized',
              details: []
            };
            res.status(401);
          }
      }

      const data = {};
      data[resultName]  = [];
      data['count'] = 0;
      if (res.results != undefined && res.results != null) {
        if(!Array.isArray(res.results)){
          res.results = [ res.results ];
        }
        data[resultName] = res.results;
        data['count'] = res.results.length;
      }
      if(resultName === 'rowsAffected'){
        data[resultName] = res.results;
        if(Array.isArray(res.results)){
          data[resultName]  = res.results[0];
        }
        data['count'] = 0;
        if(error ==  {}){
          data[resultName] = 0;
        }
      }

      data['error'] = error;

      return data;
    },
    sanitizeQuery: (paramName, paramValue) => {
      const santizeParam = {};
      santizeParam[paramName] = paramValue;
      if(paramName === 'range'){
        paramName = Object.keys(paramValue)[0];
        const start = paramValue[paramName]['start'];
        const end = paramValue[paramName]['end'];

        santizeParam[paramName] = {
          [Op.and]: [
            {[Op.gte]: moment(start, dateFormat).toDate()},
            {[Op.lte]: moment(end, dateFormat).toDate()},
          ]
        }
      }
      else if(typeof(paramValue) === 'string'){
        const isIntParam = parseInt(paramValue);
        const isDateValid = moment(paramValue, dateFormat, true).isValid();
        if(typeof(isIntParam) === 'number' && isIntParam > 0 && isDateValid==false){
          santizeParam[paramName] = paramValue;
        }
        else{
          if(isDateValid){
            santizeParam[paramName] = {[Op.gte]: moment(paramValue, dateFormat).toDate()};
          }
          else{
            if(paramValue === 'true' || paramValue === 'false')
              santizeParam[paramName] = (paramValue === 'true') ? true : false;
            else if(paramValue === 'NULL' || paramValue === 'null'){
              santizeParam[paramName] = null;
            }
            else{
              santizeParam[paramName] = {[Op.like]: '%' + paramValue + '%'};
            }
          }
        }
      }
      else if(typeof(paramValue) === 'object'){
        const tempValue = {};
        let _outerKey = null;

        Object.keys(paramValue).forEach(function(key){
          _outerKey = (key.includes('$')) ? mapOp[key] : key;
          tempValue[_outerKey] = paramValue[key];
          if(typeof(paramValue[key]) === 'object'){
            let valueObject = paramValue[key];
            let _key = null;

            Object.keys(valueObject).forEach(function(key){
              _key = (key.includes('$')) ? mapOp[key] : key;
              valueObject[_key] = valueObject[key];
              valueObject = _.omit(valueObject, [key]);
              if(valueObject[_key] === 'NULL' || valueObject[_key] === 'null'){
                valueObject[_key] = null;
              }
            });
            tempValue[_outerKey] = valueObject;                          
          }
          else if(paramValue[key] === 'NULL' || paramValue[key] === 'null'){
            tempValue[_key] = null;
          }
        });
        santizeParam[paramName] = tempValue;
      }

      return santizeParam[paramName];
    },
    asyncMiddleware: (fn) => (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(err => {
        res.status(res.errorCode || setting.defaultErrorCode);
        res.err = err;
        next();
      });
    },
    convertOperator: (key) => {
      return mapOp[key];
    },
  }
};