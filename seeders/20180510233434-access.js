'use strict';

/**
 * Created by virgiawan
 * t: @sapi_mabur
 *
 * seeder data access
 */

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('accesses', [
        {id: 1, name: 'created', description: 'Permission for add data', createdAt: new Date(), updatedAt: new Date()},
        {id: 2, name: 'read', description: 'Permission for read data', createdAt: new Date(), updatedAt: new Date()},
        {id: 3, name: 'update', description: 'Permission for change data', createdAt: new Date(), updatedAt: new Date()},
        {id: 4, name: 'delete', description: 'Permission for remove data', createdAt: new Date(), updatedAt: new Date()},
      ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
