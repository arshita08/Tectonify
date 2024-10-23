'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    name: DataTypes.STRING,
    Username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    type: DataTypes.STRING,
    status: DataTypes.ENUM('0','1'),
    User_from: DataTypes.STRING,
    verification_token: DataTypes.TEXT,
    is_verified: DataTypes.ENUM('0','1'),
    verified_at: DataTypes.DATE,
    last_active: DataTypes.DATE,
    socket_id: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'user',
  });
  return User;
};