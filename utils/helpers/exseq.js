'use strict';

import moment from 'moment';
import config from '../../config/config.json';
import setting from '../../config/setting.json';

const dateFormat = setting.dateFormat;

export default {
  name: 'exseq',
  exseq: {
    buildJson: function(resultName, res){
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
    sanitizeQuery: function (paramName, paramValue){
      const santizeParam = {};
      santizeParam[paramName] = paramValue;
      if(paramName === 'range'){
        paramName = Object.keys(paramValue)[0];
        const start = paramValue[paramName]['start'];
        const end = paramValue[paramName]['end'];

        santizeParam[paramName] = {
          $and: [
            {$gte: moment(start, dateFormat).toDate()},
            {$lte: moment(end, dateFormat).toDate()},
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
            santizeParam[paramName] = {$gte: moment(paramValue, dateFormat).toDate()};
          }
          else{
            if(paramValue === 'true' || paramValue === 'false')
              santizeParam[paramName] = (paramValue === 'true') ? true : false;
            else if(paramValue === 'NULL' || paramValue === 'null'){
              santizeParam[paramName] = null;
            }
            else{
              santizeParam[paramName] = {$like: '%' + paramValue + '%'};
            }
          }
        }
      }
      else if(typeof(paramValue) === 'object'){
        const tempValue = {};
        Object.keys(paramValue).forEach(function(key){
          tempValue[key] = paramValue[key];
          if(typeof(paramValue[key]) === 'object'){
            const valueObject = paramValue[key];
            Object.keys(valueObject).forEach(function(key){
              valueObject[key] = valueObject[key];
              if(valueObject[key] === 'NULL' || valueObject[key] === 'null')
                valueObject[key] = null
            });
          }
          else if(paramValue[key] === 'NULL' || paramValue[key] === 'null'){
            tempValue[key] = null;
          }
        });
        // console.log(tempValue);
        santizeParam[paramName] = tempValue;
      }

      return santizeParam[paramName];
    }
  }
};