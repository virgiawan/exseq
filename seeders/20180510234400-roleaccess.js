'use strict';

/**
 * Created by virgiawan
 * t: @sapi_mabur
 *
 * seeder data roleaccess
 */

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('roleaccess', [
        {roleId: 1, accessId: 1, createdAt: new Date(), updatedAt: new Date()},
        {roleId: 1, accessId: 2, createdAt: new Date(), updatedAt: new Date()},
        {roleId: 1, accessId: 3, createdAt: new Date(), updatedAt: new Date()},
        {roleId: 1, accessId: 4, createdAt: new Date(), updatedAt: new Date()},
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
