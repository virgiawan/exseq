import express from 'express';
import BaseController from '../../base/BaseController';

class HomeController extends BaseController {

  get actions(){
    return [
      {method: 'GET', endpoint: '/', flows: ['index']}
    ];
  }

  index(req, res, next){
    res.send({greeting: 'Hello i\'m virgiawan'});
  }

}

export default {path: '/', router: new HomeController().router};