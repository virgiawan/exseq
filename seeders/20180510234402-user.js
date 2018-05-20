'use strict';

/**
 * Created by virgiawan
 * t: @sapi_mabur
 *
 * seeder data roleaccess
 */

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('users', [
        {id: 1, email: 'virgiawan.huda.akbar@gmail.com', password: '123456', fullname: 'Virgiawan Huda', roleId: 1, createdAt: new Date(), updatedAt: new Date()},
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
