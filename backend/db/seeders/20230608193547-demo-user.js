'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password'),
        firstName: 'chris',
        lastName: "Thornburg"
      },
      {
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2')
        ,
        firstName: 'Jenny',
        lastName: "Lee"
      },
      {
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3')
        ,
        firstName: 'Seabass',
        lastName: "Minh"
      },
      {
        email: 'user3@user.io',
        username: 'FakeUser4',
        hashedPassword: bcrypt.hashSync('password4')
        ,
        firstName: 'Seabass2',
        lastName: "Minh2"
      },
      {
        email: 'user5@user.io',
        username: 'FakeUser5',
        hashedPassword: bcrypt.hashSync('password5')
        ,
        firstName: 'Seabass5',
        lastName: "Minh5"
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
