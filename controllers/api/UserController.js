import BaseController from '../../base/BaseController';
import models from '../../models/sql';

class UserController extends BaseController {

  get actions(){
    return [
      {method: 'GET', endpoint: '/', 
        flows: ['query', 'getUsers', 'response']},
      {method: 'GET', endpoint: '/:id', 
        flows: ['getUser', 'response']},
      {method: 'POST', endpoint: '/', 
        flows: ['bodyValidation', 'addUser', 'response']},
      {method: 'PUT', endpoint: '/:id', 
        flows: ['bodyValidation', 'updateUser', 'response']},
      {method: 'DELETE', endpoint: '/:id', 
        flows: ['removeUser', 'response']},
    ];
  }

  async getUsers(req, res, next){
    if(res.err)
      return next();

    const users = await models.User.findAll(req.dbQuery);
    res.results = users;
    res.status(200);
    next();
  }

  async getUser(req, res, next){
    if(res.err)
      return next();

    const user = await models.User.findById(req.params.id);
    if(!user){
      res.errorCode = 404;
      throw Error('Not found');
    }
    res.results = user;
    res.status(200);
    next();
  }

  async addUser(req, res, next){
    if(res.err)
      return next();

    const [data, isCreated] = await models.User.findOrCreate({
      where: req.body,
      default: req.body
    });
    res.results = data,
    res.status(200);
    if(isCreated)
      res.status(201);
    next();
  }

  async updateUser(req, res, next){
    if(res.err)
      return next();

    const affected = await models.User.update(
      req.body,
      {where: {id: req.params.id}}
    );
    res.results = affected;
    res.status(200);
    next();
  }

  async removeUser(req, res, next){
    if(res.err)
      return next();
    
    const affected = await models.User.destroy({
      where: {id: req.params.id}
    });
    res.results = affected;
    res.status(200);
    next();
  }

}

export default {path: '/users', router: new UserController().router};