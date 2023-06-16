'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {

    static associate(models) {


      Event.belongsTo(models.Venue, {
        foreignKey: 'venueId',

      })



      Event.belongsTo(models.Group, {
        foreignKey: 'groupId',

      })




      Event.hasMany(models.Attendance, {
        foreignKey: 'eventId',
        onDelete: 'CASCADE',
        hooks: true

      })


      //!need to go in 'ONE' side model
      Event.hasMany(models.EventImage, {
        foreignKey: 'eventId',
        onDelete: 'CASCADE',
        hooks: true

      })

    }
  }
  Event.init({
    venueId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    type: {
      type: DataTypes.ENUM("Online", "In person"),
      allowNull: false
    },
    capacity: DataTypes.INTEGER,
    price: DataTypes.DECIMAL(10, 2),
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    startNum: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE
    },
    endNum: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
