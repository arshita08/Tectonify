'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatReview extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
   
     
    }
  }
  ChatReview.init({
    chat_user: DataTypes.INTEGER,
    chat_last_id: DataTypes.INTEGER,
    review_message: DataTypes.STRING,
    review_ratings: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'chat_review',
  });
  return ChatReview;
};