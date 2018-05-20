import express from 'express';
import BaseController from '../../base/BaseController';
import models from '../../models/sql';

class UserController extends BaseController {

  get actions(){
    return [
      {method: 'GET', endpoint: '/', flows: ['query', 'getUsers', 'response']},
      {method: 'GET', endpoint: '/:id', flows: ['getUser']},
      {method: 'POST', endpoint: '/', flows: ['addUser']},
      {method: 'PUT', endpoint: '/:id', flows: ['updateUser']},
      {method: 'DELETE', endpoint: '/:id', flows: ['removeUser']},
    ];
  }

  getUsers(req, res, next){
    models.User.findAll(req.where)
      .then(user => {
        res.results = user;
        res.status(200);
        next();
      })
      .catch(err => {
        res.status(500);
        res.err = err;
        next();
      });
  }

  getUser(req, res, next){

  }

  addUser(req, res, next){

  }

  updateUser(req, res, next){

  }

  removeUser(req, res, next){
    
  }

}

export default {path: '/users', router: new UserController().router};