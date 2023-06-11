'use strict';
let options = {};

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Attendances', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      eventId: {
        type: Sequelize.INTEGER,
           references: {
            model: 'Events'
          },
           onDelete: 'CASCADE'
      },
      userId: {
        type: Sequelize.INTEGER,
          references: {
           model: 'Users'
         },
          onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM("present", "absent"),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = 'Attendances';
    await queryInterface.dropTable(options);

  }
};
