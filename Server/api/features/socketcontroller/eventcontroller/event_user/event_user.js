const ChatUser = require('../../../../models').chat_user;
const UserChat = require('../../../../models').user_chat;
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const chatusers = require('../../../../models/chatusers');
const { use } = require('passport');
const { where } = require('sequelize');

const usercreate = async (userdata, ipv4Address, socketId) => {

    userdata.ipaddress = ipv4Address;
    userdata.reciepientid = socketId;
    const usercheck = await ChatUser.findOne({
        where: {
            email: userdata.email
        },
        include: [{
            model: UserChat,
            as: 'Chats'
        }]
    });
    if (usercheck) {
        /* return 1 if already user */

        return { user: usercheck, already: 1 };
    } else {
        const createuser = await ChatUser.create(userdata);
        const otp = generateOTP(createuser.id);

        // const verificationLink = process.env.HTTP_HOST?`https://${process.env.HTTP_HOST}:3001/verify?token=${token}`:`http://localhost:3001/verify?token=${token}`;


        await sendVerificationEmail(createuser.email, otp);


        return { user: createuser, already: 0 };
    }

};

const userotpcheck = async (userdata, ipv4Address, socketId) => {

    userdata.ipaddress = ipv4Address;
    // userdata.reciepientid=socketId;
    const usercheck = await ChatUser.findOne({
        where: {
            email: userdata.email
        }
    });


    if (usercheck && usercheck.verification_token && userdata.otp == usercheck.verification_token) {
        /* return 1 if already user */
        console.log(userdata.otp, "chec")
        console.log(usercheck.verification_token, "chec")
        usercheck.set('verification_token', null);
        usercheck.set('is_verified', '1');
        usercheck.set('status', '1');
        await usercheck.save();
        console
        return { user: usercheck };

    } else {
        console.log("not verify")
        return null;
    }

};

const sendVerificationEmail = async (email, verificationLink) => {
    try {

        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_PORT == 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });


        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Verify your email address',
            text: `Text Email Verification`,
            html: `<p>Please use this otp to verify<h1>${verificationLink}</h1></p>`
        };

        await transporter.sendMail(mailOptions);
        console.log('Verification email sent to:', email);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
};

function generateOTP(userid) {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const updateuser = ChatUser.update({ verification_token: otp.toString() }, { where: { id: userid } });
    return otp.toString();
}
const generateVerificationToken = (userId) => {
    const payload = {
        userId: userId
    };
    const secret = process.env.JWT_SECRET;
    const options = {
        expiresIn: '1h'
    };
    return jwt.sign(payload, secret, options);
};

//check user verified
const usercheck = async (email) => {
    const usercheck = await ChatUser.findOne({
        where: {
            email: email,
            is_verified: '1'
        }
    });
    if (usercheck) {
        return usercheck;
    } else {
        return 0;
    }

}

const usersocketid = async (id, socketId) => {
    const usercheck = await ChatUser.findOne({
        where: {
            id: id
        }
    });

    if (usercheck) {
        usercheck.set('reciepientid', socketId);
        await usercheck.save();
        return usercheck;
    } else {
        return 0;
    }

}

const savemessage = async (id, message, type) => {
    if (type == 'user') {
        const userchat = await UserChat.create({ question: message, answertype: type, userID: id });
    } else {
        const userchat = await UserChat.create({ answer: message, answertype: type, userID: id });
    }
    return true;

}

const getUsersocketid = async (id) => {

    const users = await ChatUser.findOne(
        {
            where: { id: id },
            attributes: ['reciepientid']
        });
    return users.reciepientid;
};

const getuserdata = async (id) => {
    
    const usercheck = await ChatUser.findOne({
        where: {
            id: id
        },
        attributes: ['status']
    });
    return usercheck.status;

}


module.exports = {
    usercreate,
    usercheck,
    usersocketid,
    savemessage,
    getUsersocketid,
    userotpcheck,
    getuserdata
};