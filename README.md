# Exseq - Express + Sequelize

Exseq is skeleton project using Express.js and Sequelize.js ORM. Exseq designed for backend API server only, but you can modify it to accomplish your need.

## Requirements

* Node.js `>=8.11.1`

## Features

* Support ES6
* Use OOP approaches at controllers and models
* Support async/await and try/catch at route middlewares
* Generator for database model, migration and seeder via `sequelize-cli`
* Clean routing
* Parse url query to sequelize query
* Response object wrapper
* Jade (Pug) template engine installed

## Getting Started

* Clone this repo. 
```
$ git clone https://github.com/virgiawan/exseq.git
```

* Install dependencies.
```
$ cd exseq
$ npm install
```

* Configure your database at `./config/config.json`. Exseq by default uses MySQL/MariaDB but you can choose your own database.
```
# Choose one of the following:
$ npm install --save pg pg-hstore
$ npm install --save sqlite3
$ npm install --save tedious // MSSQL
```
* Exseq provides example how to create rest API using MySQL database. You can try by following steps :

  1. Create database `exseq_development` at your MySQL
  2. Init table 
  ```
  $ npm run initdatabase
  ```
  3. Run database seeder uses `sequelize-cli`
  ```
  $ ./node_modules/.bin/sequelize db:seed:all
  ```
* Start server
```
$ npm run start
```
* Open your browser and access `localhost:3000`

## Middlewares

* Exseq contains some middlewares :

  1. `query` => middleware to convert url query into sequelize query  
  2. `bodyValidation` => middleware to check json request body is empty or not
  3. `response` => middleware to wrap json response

  #### 1. `query` Middleware

  * Example how to use url query ***where*** and ***limit-offset*** at url :

  ```
  1. GET localhost:3000/users?q[name]=administrator
    -> Get user with name=administrator
      
  2. GET localhost:3000/users?q[name]=administrator&q[email]=dummy@gmail.com
    -> Get user with name=administrator and email=dummy@gmail.com
      
  3. GET localhost:3000/users?q[name]=administrator&q[email]=dummy@gmail.com&mode=or
    -> Get user with name=administrator or email=dummy@gmail.com
      
  4. GET localhost:3000/users?q[createdAt]=2015-01-01_00:00:00
    -> Get user that is created after 2015-01-01_00:00:00
      
  5. GET localhost:3000/users?q[name]=administrator&offset=5&limit=10
    -> Get 10 users with name=administrator from offset 5

  ```

  * Example how to use url query ***range*** and ***date range*** query at url :

  ```
  - Range query :
  1. GET localhost:3000/users?q[id][$and][$gte]=1&q[id][$and][$lte]=5
    -> Get users with ids 1, 2, 3, 4, and 5
    
  - Date range query :
  1. GET localhost:3000/users?q[range][createdAt][start]=2018-06-06_12:00:00&q[range][createdAt][end]=2018-06-08_12:00:00
    -> Get users that are created between 2018-06-06 12:00:00 until 2018-06-08 12:00:00 
    
  - If date without range :
  1. GET localhost:3000/users?q[createdAt]=2018-06-06_12:00:00
    -> GET users that are created after 2018-06-06 11:59:59
  ```
	
  * Example how to ***join resources*** :

  ```
  1. GET localhost:3000/users?join[model]=Role&join[Role][as]=role
    -> GET users and their role
  ```
  * For more details see [Example Code](##-Example-Code) (see comment `#query`)

  #### 2. `bodyValidation` Middleware

  * For more details see [Example Code](##-Example-Code) (see comment `#bodyValidation`)

  #### 3. `response` Middleware

  * POST and GET response body will be wrapped into this format :

  ``` 
  {
    <resourceName> : [
      <resource1>,
      <resource2>,
      ...
    ],
    count: integer,
    error: {
      name: string,
      message: string,
      details: [
        {
          message: string,
          type: string,
          path: string,
          value: string|null	        
        },
        ...
      ]
    }
  }
  ```

  * PUT and DELETE response body will be wrapped into this format :

  ``` 
  {
    rowsAffected : integer,
    count: 0,
    error: {
      name: string,
      message: string,
      details: [
        {
          message: string,
          type: string,
          path: string,
          value: string|null	        
        },
        ...
      ]
    }
  }
  ```

  * For more details see [Example Code](##-Example-Code) (see comment `#response`)

## Example Code

  * `./controllers/UserController.js`

  ```javascript
  import BaseController from '../../base/BaseController';
  import models from '../../models/sql';

  class UserController extends BaseController {

    /**
     * Define your routes in this action.
     * The middlewares can be defined inside `flows`
    */
    get actions(){
      return [
        /** 
         * GET /users
         * #query 
         * Add query middleware at this route. 
         * Url will be converted into sequelize query that can be accessed via `req.dbQuery`
         * If query error the error value can be accesed via `req.err`
         * 
         * #respose
         * Wrap response object into exseq's response format
        */
        {method: 'GET', endpoint: '/', 
          flows: ['query', 'getUsers', 'response']},

        /** 
         * GET /users/:id
         * #respose
         * Wrap response object into exseq's response format
        */
        {method: 'GET', endpoint: '/:id', 
          flows: ['getUser', 'response']},
        
        /** 
         * POST /users
         * #bodyValidation
         * Check request json body is empty or not. If empty return error message that can be accessed via `req.err`
         * 
         * #respose
         * Wrap response object into exseq's response format
        */
        {method: 'POST', endpoint: '/', 
          flows: ['bodyValidation', 'addUser', 'response']},

        /** 
           * PUT /users/:id
           * #bodyValidation
           * Check request json body is empty or not. If empty return error message that can be accessed via `req.err`
           * 
           * #respose
           * Wrap response object into exseq's response format
          */
        {method: 'PUT', endpoint: '/:id', 
          flows: ['bodyValidation', 'updateUser', 'response']},
        /** 
         * DELETE /users/:id
         * #respose
         * Wrap response object into exseq's response format
        */
        {method: 'DELETE', endpoint: '/:id', 
          flows: ['removeUser', 'response']},
      ];
    }

    async getUsers(req, res, next){
      if(res.err) // if error show the error message
        return next();

      /**
       * #query 
       * You can use sequelize query here via `req.dbQuery`
      */
      const users = await models.User.findAll(req.dbQuery);
      /**
       * #response
       * Wrap your json response into exseq's json format by pass data value into `res.results`
      */
      res.results = users; 
      res.status(200);
      next();
    }

    async getUser(req, res, next){
      if(res.err) // if error show the error message
        return next();

      const user = await models.User.findById(req.params.id);
      if(!user){
        /** 
         * #response
         * If you want throw error, you should overwrite error response at `response middleware` by pass value into `res.errorCode`
         * default value set on `./config/setting.json`
        */
        res.errorCode = 404; 
        throw Error('Not found'); // throw error, show error message
      }
      /**
       * #response
       * Wrap your json response into exseq's json format by pass data value into `res.results`
      */
      res.results = user;
      res.status(200);
      next();
    }

    async addUser(req, res, next){
      if(res.err) // if error show the error message
        return next();

      const [data, isCreated] = await models.User.findOrCreate({
        where: req.body,
        default: req.body
      });
      /**
       * #response
       * Wrap your json response into exseq's json format by pass data value into `res.results`
      */
      res.results = data,
      res.status(200);
      if(isCreated)
        res.status(201);
      next();
    }

    async updateUser(req, res, next){
      if(res.err) // if error show the error message
        return next();

      const affected = await models.User.update(
        req.body,
        {where: {id: req.params.id}}
      );
      /**
       * #response
       * Wrap your json response into exseq's json format by pass data value into `res.results`
       * `affected` is integer
      */
      res.results = affected;
      res.status(200);
      next();
    }

    async removeUser(req, res, next){
      if(res.err) // if error show the error message
        return next();
      
      const affected = await models.User.destroy({
        where: {id: req.params.id}
      });
      /**
       * #response
       * Wrap your json response into exseq's json format by pass data value into `res.results`
       * `affected` is integer
      */
      res.results = affected;
      res.status(200);
      next();
    }

  }

  export default {path: '/users', router: new UserController().router};
  ```

  * `./config/setting.json`

  ```javascript
  {
    // format for date range query at query url
    "dateFormatUrl": "YYYY-MM-DD_HH:mm:ss",
    "dateFormat": "YYYY-MM-DD HH:mm:ss",
    
    // resource path index is used by `response` middleware
    // eg: localhost:3000/<<resource>> => resourcePath: 1
    // if you want to change your endpoint to: 
    // eg: localhost:3000/api/v1/<<resource>> => change resourcePath to `resourcePath: 3`
    "resourcePath": 1,
    "defaultErrorCode": 500
  }
  ```

## Reference
  
  * [Sequelize](http://docs.sequelizejs.com/)
  * [seqeulize-cli](https://github.com/sequelize/cli)

## Contributing

Contributors are welcome, please fork and send pull requests! If you have any ideas on how to make this project better then please submit an issue.

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
