'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'EventImages';
    return queryInterface.bulkInsert(options, [

      {
        "url": "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_16x9.jpg?w=1200",
        "eventId": 1,
        "preview": 0
      },
      {
        "url": "https://www.petfinder.com/sites/default/files/images/content/shelter-dog-cropped-1.jpeg",
        "eventId": 2,
        "preview": 1
      },
      {
        "url": "https://www.cdc.gov/healthypets/images/pets/cute-dog-headshot.jpg?_=42445",
        "eventId": 3,
        "preview": 0
      },

    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
