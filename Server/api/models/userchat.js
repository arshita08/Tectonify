'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserChat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserChat.belongsTo(models.chat_user, {
        foreignKey: 'userID',
        as: 'ChatUser',
      });
     
    }
  }
  UserChat.init({
    question: DataTypes.STRING,
    answer: DataTypes.STRING,
    userID:DataTypes.INTEGER,
    answertype:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user_chat',
  });
  return UserChat;
};