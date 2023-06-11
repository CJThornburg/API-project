'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {


    static associate(models) {

      // user to group "owner"
      Group.belongsTo(models.User, {
        foreignKey: 'organizerId',

      })

      // group to their memberships
      Group.hasMany(models.Membership, {
        foreignKey: 'groupId',
        onDelete: 'CASCADE',
        hooks: true

      })


      // group to image collection
      Group.hasMany(models.GroupImage, {
        foreignKey: 'groupId',
        onDelete: 'CASCADE',
        hooks: true

      })


      // group to venues
      Group.hasMany(models.Venue, {
        foreignKey: 'groupId',
        onDelete: 'CASCADE',
        hooks: true

      })


      Group.hasMany(models.Event, {
        foreignKey: 'groupId',
        onDelete: 'CASCADE',
        hooks: true

      })


    }
  }
  Group.init({
    organizerId: {

      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    about: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    type: {
      allowNull: false,
      type: DataTypes.ENUM("1", "two")
    },
    private: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    },
    city: {

      type: DataTypes.STRING
    },
    state: {

      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
