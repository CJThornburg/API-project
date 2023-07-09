'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Venues';
    return queryInterface.bulkInsert(options, [
      {
        groupId: 2,
        address: "123 MadeUp St",
        city: "fakeville",
        state: "Virginia",
        "lat": 38.7645358,
        "lng": -122.4730327,
      },
      {
        "groupId": 1,
        "address": "123 Disney Lane",
        "city": "New York",
        "state": "NY",
        "lat": 37.7645358,
        "lng": -122.4730327,
      },
      {
        groupId: 3,
        address: "1234 MadeUp St",
        city: "madeupville",
        state: "Maryland",
        "lat": 39.7645358,
        "lng": 122.4730327,
      },
      {
        groupId: 2,
        address: "12347 MadeUp St",
        city: "madeUpville2",
        state: "Maryland",
        "lat": 40.7645358,
        "lng": 122.4730327,
      },
      {
        groupId: 1,
        address: "12347 MadeUp St",
        city: "liesville",
        state: "Maryland",
        "lat": 39.7645358,
        "lng": 122.4730327,
      },

    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
