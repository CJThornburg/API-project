'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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
