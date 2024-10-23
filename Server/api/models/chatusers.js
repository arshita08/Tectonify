'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ChatUser.hasMany(models.user_chat, {
        foreignKey: 'userID',
        as: 'Chats',
      })
    }
  }
  ChatUser.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    ipaddress: DataTypes.STRING,
    reciepientid: DataTypes.STRING,
    status: DataTypes.ENUM('0','1'),
    verification_token: DataTypes.TEXT,
    is_verified: DataTypes.ENUM('0','1'),
    verified_at: DataTypes.DATE,
    last_active: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'chat_user',
  });
  return ChatUser;
};