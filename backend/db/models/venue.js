'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {

    static associate(models) {



      Venue.belongsTo(models.Group, {
        foreignKey: 'groupId',

      })


      Venue.hasMany(models.Event, {
        foreignKey: 'venueId',
        onDelete: 'CASCADE',
        hooks: true

      })

    }
  }
  Venue.init({
    groupId: DataTypes.INTEGER,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    lat: DataTypes.NUMBER,
    lng: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'Venue',
  });
  return Venue;
};
