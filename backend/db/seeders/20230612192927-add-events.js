'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Events';
    return queryInterface.bulkInsert(options, [
      {
        "groupId": 1,
        "venueId": 3,
        "name": "Xtreme Group First Meet and Greet",
        "type": "In person",
        "capacity": 10,
        "price": 18.50,
        "description": "The first meet and greet for our group! Come say hello!",
        "startDate": "2021-11-19 20:00:00",
        "startNum": new Date("2021-11-19 20:00:00").getTime(),
        "endNum": new Date("2021-11-19 22:00:00").getTime(),
        "endDate": "2021-11-19 22:00:00",
      },
      {
        "groupId": 2,
        "venueId": null,
        "name": "apex tryouts",
        "type": "Online",
        "capacity": 20,
        "price": .50,
        "description": "come compete for for a spot on the three man",
        "startDate": "2023-11-19 03:00:00",
        "endDate": "2023-11-19 03:00:00",
        "startNum": new Date("2023-11-19 03:00:00").getTime(),
        "endNum": new Date("2023-11-19 03:00:00").getTime(),
      },
      {
        "groupId": 3,
        "venueId": 3,
        "name": "knit4lyfe",
        "type": "In person",
        "capacity": 50,
        "price": 1.50,
        "description": "come make blankets for the homeless",
        "startDate": "2023-12-19 03:00:00",
        "endDate": "2023-12-19 08:00:00",
        "startNum": new Date("2023-12-19 03:00:00").getTime(),
        "endNum": new Date("2023-12-19 08:00:00").getTime(),
      },
      {
        "groupId": 3,
        "venueId": 3,
        "name": "knit4lyfe2",
        "type": "In person",
        "capacity": 50,
        "price": 1.50,
        "description": "come make blankets for the homeless",
        "startDate": "2024-12-19 03:00:00",
        "endDate": "2024-12-19 08:00:00",
        "startNum": new Date("2024-12-19 03:00:00").getTime(),
        "endNum": new Date("2024-12-19 08:00:00").getTime(),
      },
      {
        "groupId": 4,
        "venueId": 3,
        "name": "photos4lyfe2",
        "type": "In person",
        "capacity": 50,
        "price": 1.50,
        "description": "come make blankets for the homeless",
        "startDate": "2024-12-19 03:00:00",
        "endDate": "2024-12-19 08:00:00",
        "startNum": new Date("2024-12-19 03:00:00").getTime(),
        "endNum": new Date("2024-12-19 08:00:00").getTime(),
      }



    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
