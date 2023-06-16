'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Attendances';
    return queryInterface.bulkInsert(options, [
      {
        eventId: 1,
        userId: 1,
        status: "attending"
      },
      {
        eventId: 3,
        userId: 1,
        status: "pending"
      },
      {
        eventId: 2,
        userId: 1,
        status: "pending"
      },
      {
        eventId: 4,
        userId: 1,
        status: "co-host"
      },

      {
        eventId: 2,
        userId: 1,
        status: "host"
      },
      {
        eventId: 1,
        userId: 2,
        status: "attending"
      }, {
        eventId: 1,
        userId: 3,
        status: "attending"
      },

    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Attendances';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4, 5, 6, 7] }
    }, {});
  }
};
