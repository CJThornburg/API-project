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
        status: "waitlist"
      },
      {
        eventId: 2,
        userId: 1,
        status: "pending"
      },

    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Attendances';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
