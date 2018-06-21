# Exseq - Express + Sequelize

Exseq is skeleton project using Express.js and Sequelize.js ORM. Exseq designed for backend API server only, but you can modify it to accomplish your need.

## Requirements

* Node.js `8.11.1` or later

## Features

* Support ES6
* Use OOP approaches at controllers and models
* Support async/await and try/catch at route middlewares
* Generator for database model, migration and seeder via `sequelize-cli`
* Parse url query to sequelize query
* Response object wrapper

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

  1. `queryBuilder` => middleware to convert url query into sequelize query  
  2. `bodyValidation` => middleware to check json request body is empty or not
  3. `response` => middleware to wrap json response

  #### 1. `queryBuilder` Middleware
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
  1. GET http://localhost:7000/api/v1/users?join[model]=Role&join[Role][as]=role
    -> GET users and their role
  ```

