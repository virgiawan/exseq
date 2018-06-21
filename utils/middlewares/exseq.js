import models from '../../models/sql';
import helpers from '../helpers';
import _ from 'lodash';
import setting from '../../config/setting.json';
import Sequelize, {Op} from 'sequelize';

export default {
  name: 'exseq',
  exseq: {
    /* ======================== */
    /*   BEFORE MAIN FUNCTION   */
    /* ======================== */
    queryBuilder: function(req, res, next){
      const query = {}, tempKeys = {};

      // validation offset and limit
      req.checkQuery('offset', 'offset must be integer').optional().isInt();
      req.checkQuery('limit', 'limit must be integer').optional().isInt();

      const errors = req.validationErrors();
      if(errors){
        res.err = {};
        res.err['name'] = 'Error';
        res.err['message'] = 'Error query!';
        res.err['errors'] = errors;
        return next();
      }

      const tempQuery = req.query.q;
      if(tempQuery){
        if(Object.keys(tempQuery).length > 1){
          Object.keys(tempQuery).forEach(function(key){
            if(key === 'range'){
              let temp = Object.keys(tempQuery[key])[0];
              tempKeys[temp] = helpers.exseq.sanitizeQuery(key, tempQuery[key]);
            }
            else{
              tempKeys[key] = helpers.exseq.sanitizeQuery(key, tempQuery[key]);
            }
          });
          const mode = (req.query.mode === 'and' || req.query.mode === undefined)?{[Op.and]:tempKeys}:{[Op.or]:tempKeys};
          query['where'] = mode;
        }
        else if(Object.keys(tempQuery).length == 1){
          Object.keys(tempQuery).forEach(function(key){
            if(key === 'range'){
              let temp = Object.keys(tempQuery[key])[0];
              tempKeys[temp] = helpers.exseq.sanitizeQuery(key, tempQuery[key]);
            }
            else{
              tempKeys[key] = helpers.exseq.sanitizeQuery(key, tempQuery[key]);
            }
          });
          query['where'] = tempKeys;
        }
      }

      query['offset'] = Number((req.query.offset)?req.query.offset:0);
      query['limit'] = Number((req.query.limit)?req.query.limit:10);

      const defaultOrder = [
        ['createdAt','DESC']
      ];
      const queryOrder = req.query.order;
      if(queryOrder){
        const order = [];
        Object.keys(queryOrder).forEach(function(key){
          let temp = [];
          temp.push(key);
          temp.push(queryOrder[key]);
          order.push(temp);
        });
      }
      query['order'] = (req.query.order)?order:defaultOrder;

      let arrModel;
      let arrAs;
      if(req.query.join){
        let arrInclude = [];
        arrModel = req.query.join.model;
        if(!Array.isArray(arrModel)){
          arrModel = [arrModel];
        }
        arrAs = req.query.join;
        arrModel.forEach(function(mdl){
          let tempAs = arrAs[mdl];
          if(tempAs){
            let tempObj = {
              model: models[mdl],
              as: tempAs.as
            }
            arrInclude.push(tempObj);
          }
          else{
            arrInclude.push(models[mdl]);
          }
        });
        // console.log('arrInclude', arrInclude);
        query['include'] = arrInclude;
      }

      // console.log(query);

      req.dbQuery = query;

      next();
    },
    bodyValidation: function(req, res, next){
      if(Object.keys(req.body).length == 0){
        res.err = {};
        res.err['name'] = 'Error';
        res.err['message'] = 'Error request content body!';
        res.err['errors'] = [
          {
            message: "Content body can not be null",
            type: "notNull Violation",
            path: "content body",
            value: null
          }
        ];
      }
      next();
    },
    /* ======================= */
    /*   AFTER MAIN FUNCTION   */
    /* ======================= */
    response: function(req, res, next){
      if(req.method === 'PUT' || req.method === 'DELETE'){
        res.json(helpers.exseq.buildJson('rowsAffected', res));
      }
      else{
        const arrPath = req.baseUrl.split("/");
        // console.log(arrPath);
        res.json(helpers.exseq.buildJson(_.camelCase(arrPath[setting.resourcePath]), res));
      }
    }
  }
};