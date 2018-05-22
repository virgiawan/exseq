import express from 'express';
import _ from 'lodash';
import middlewares from '../utils/middlewares';
import helpers from '../utils/helpers';

/**
 * Created by virgiawan
 * t: @sapi_mabur
 *
 * @class BaseController
 * inspired by b3ntly/express-class-router 
 */
class BaseController {

  /*
    return [
      {method: 'GET', endpoint: '/home', flow: ['firstMiddleware', 'mainFunc']},
      {method: 'GET', endpoint: '/home', flow: ['firstMiddleware', 'mainFunc']},
      ...
    ]
  */
  get actions(){
    return [];
  }

  constructor(options={}){
    this.router = express.Router(options);
    this.register(this.actions);
  }

  // middleware for wrap json response
  response(req, res, next){
    return middlewares.exseq.response(req, res, next);
  }

  // middleware for build query from url
  query(req, res, next){
    return middlewares.exseq.queryBuilder(req, res, next);
  }

  // middleware for request body validation
  bodyValidation(req, res, next){
    return middlewares.exseq.bodyValidation(req, res, next);
  }

  /**
   * @param {any} handlers 
   * [{method: HTTP_METHOD, endpoint: URL_ENDPOINT, flows: [func1, func2, func3]}]
   */
  register(handlers){
    _.each(handlers, ({ method, endpoint, flows }) => {
      const verb = method.toLowerCase();
      _.each(flows, (flow) => {
        this.router[verb](endpoint, helpers.exseq.asyncMiddleware(this[flow]));
      });
    });
  }

}

export default BaseController;