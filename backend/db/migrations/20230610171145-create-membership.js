'use strict';
let options = {};

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Memberships', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users'
        },
        //  so if a user is deleted, the membership record is also deleted? maybe not cause their is a status col ???
        onDelete: 'CASCADE'
      },
      groupId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Groups'
        },
        //  if a group is deleted all their membership records should be deleted
        onDelete: 'CASCADE'
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM("pending", "member", "cohost")
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = 'Memberships';
    await queryInterface.dropTable(options);

  }
};
