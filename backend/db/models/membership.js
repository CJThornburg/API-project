'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {

    static associate(models) {



      Membership.belongsTo(models.User, {
        foreignKey: 'userId',

      })


      Membership.belongsTo(models.Group, {
        foreignKey: 'groupId',

      })



    }
  }
  Membership.init({
    userId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM("pending", "member", "cohost"),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Membership',
  });
  return Membership;
};
