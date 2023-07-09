'use strict';


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {


    options.tableName = 'Groups';

    return queryInterface.bulkInsert(options, [
      {
        organizerId: 1,
        name: "Extreme Living",
        about: "group for extreme sports",
        type: "In person",
        private: false,
        city: "fairfax",
        state: "virginia"
      },
      {
        organizerId: 2,
        name: "apex legends fanclub",
        about: "group for playing apex legends",
        type: "Online",
        private: true,
        city: "springfield",
        state: "virginia"
      },
      {
        organizerId: 3,
        name: "knitting fanclub",
        about: "group that love knitting",
        type: "Hybrid",
        private: false,
        city: "Fairy",
        state: "virginia"
      },
      {
        organizerId: 4,
        name: "photogarphy fanclub",
        about: "group that love photos",
        type: "Hybrid",
        private: false,
        city: "Fairy",
        state: "virginia"
      }


    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Extreme Living', 'pex legends fanclub', 'knitting fanclub', "img fanclub"] }
    }, {});
  }
};
