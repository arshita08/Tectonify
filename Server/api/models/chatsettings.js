'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatSettings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
   
     
    }
  }
  ChatSettings.init({
    chaticon: DataTypes.STRING,
    chattitle: DataTypes.STRING,
    supporticon:DataTypes.STRING,
    welcomemessage:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'chat_setting',
  });
  return ChatSettings;
};