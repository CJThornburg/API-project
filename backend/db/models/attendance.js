'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {

    static associate(models) {


      Attendance.belongsTo(models.User, {
        foreignKey: 'userId',

      })

      Attendance.belongsTo(models.Event, {
        foreignKey: 'eventId',

      })





    }
  }
  Attendance.init({
    eventId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM("pending", "waitlist", "attending", "co-host", "host"),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Attendance',
  });
  return Attendance;
};
