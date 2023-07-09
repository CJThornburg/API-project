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
        "url": "https://cdn.britannica.com/17/83817-050-67C814CD/Mount-Everest.jpg",
        "eventId": 1,
        "preview": true
      },
      {
        "url": "https://assets.xboxservices.com/assets/20/86/208687a2-75e8-4b8e-8b13-2845ecc4ed95.jpg?n=Apex-Legends_GLP-Page-Hero-1084_Revelry_1920x1080_02.jpg",
        "eventId": 2,
        "preview": true
      },
      {
        "url": "https://ychef.files.bbci.co.uk/1280x720/p08jfwky.jpg",
        "eventId": 3,
        "preview": false
      },
      {
        "url": "https://ychef.files.bbci.co.uk/1280x720/p08jfwky.jpg",
        "eventId": 4,
        "preview": false
      },
      {
        "url": "https://m.media-amazon.com/images/I/61BKYlNqH6L._AC_UF894,1000_QL80_.jpg",
        "eventId": 5,
        "preview": true
      },

    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
