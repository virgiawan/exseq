'use strict';

/**
 * Created by virgiawan
 * t: @sapi_mabur
 *
 * seeder data roles
 */

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('roles', [
        {id: 1, name: 'admin', description: "Super user on this system", createdAt: new Date(), updatedAt: new Date()},
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
