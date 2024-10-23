const User = require('../../../models').chat_user;
const UserChat = require('../../../models').user_chat;
const questiontable = require('../../../models').questions;
const { Op, where } = require('sequelize');
var Sequelize = require('sequelize');

const getdashboarddata = async (req, res, next) => {

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 30);


    const userCount = await User.count({
        where: {
            is_verified: '1',
            createdAt: {
                [Op.gte]: lastWeek
            }
        }
    });


    const chatCount = await UserChat.count({
        where: {
            createdAt: {
                [Op.gte]: lastWeek
            }
        }
    });

    const question = await questiontable.count({

    });

    const questionsdata = await UserChat.findAll({
        where: { answertype: 'user' },
        limit: 10,
        order: Sequelize.literal('RAND()'),
        attributes:['question']
    });
    const questions=questionsdata.map(item=>item.question);
    const answersdata = await UserChat.findAll({
        where: { answertype: 'admin' },
        order: Sequelize.literal('RAND()'),
        limit: 10
    });
    
    const answers=answersdata.map(item=>item.answer);

    res.json({ message: "Users Fetched Successfuly", data: { userCount, chatCount, question, questions, answers } });

}

module.exports = {
    getdashboarddata
}