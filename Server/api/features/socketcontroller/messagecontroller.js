const { extractIPv4 } = require('../../util/ipUtils');
const ChatUserController = require('./eventcontroller/event_user/event_user');
const ChatAdminController = require('./eventcontroller/event_user/event_admin');
const { getanswer } = require('./aianswer');
const chatusers = require('../../models/chatusers');


const userssocketid = {};

const handleConnection = async (socket) => {
  if (!socket) {
    console.error('Socket is undefined');
    return;
  }
  const userId = socket.handshake.auth.userId;
  const admin = socket.handshake.auth.admin;
  console.log(`A user connected: ${socket.id}`, admin);

  userssocketid[socket.id] = socket;
  var user;
  if (userId) {
    const upadteuser = await ChatUserController.usersocketid(userId, socket.id);
    const statususer=await ChatUserController.getuserdata(userId);
    if(statususer !=1){
      return socket.emit('receiveuserblocked', { socketId: socket.id , message: "You are blocked"});
    }
   
  }
  if (admin) {
    console.log(admin, "admin socket connected ");
    const upadteadmin = await ChatAdminController.adminsocketidupdate(socket.id);
  }
  
  socket.emit('connected', { socketId: socket.id });
  socket.on("otpsubmit", async ({ recipientId, message }) => {
    const recipientSocket = userssocketid[recipientId];
    if (recipientSocket) {

      const userdata = JSON.parse(message);
      console.log(recipientId, "recc")
      const chatUser = await ChatUserController.userotpcheck(userdata, 'ipv4Address', recipientId);
      if (chatUser) {
        recipientSocket.emit("receiveOtpsuccess", {
          senderId: socket.id,
          message: "OTP verified successfully"
        });
      } else {
        recipientSocket.emit("receiveOtperror", {
          senderId: socket.id,
          message: "OTP verification failed"
        });
      }
    }
  });
  socket.on("userInfo", async ({ recipientId, message }) => {
    const recipientSocket = userssocketid[recipientId];
    if (recipientSocket) {
      const userdata = JSON.parse(message);
      const chatUser = await ChatUserController.usercreate(userdata, 'ipv4Address', recipientId);
      const dataStringify = JSON.stringify(chatUser.user);
      if (chatUser.already == 0 || chatUser.user.is_verified == null) {
        // recipientSocket.emit("receivePrivateMessage", {
        //   senderId: socket.id,
        //   message: 'Verification email sent .Please verify your mail first '
        // });

      } else {
        recipientSocket.emit("recieveuserinfo", {
          senderId: socket.id,
          message: dataStringify
        });

      }

      // console.log(`Private message sent to ${recipientId} from ${socket.id}: ${message}`);
    } else {
      console.log(`User ${recipientId} is not connected`);
    }


  })

  socket.on("privateMessage", async ({ recipientId, userid, message }) => {
    const recipientSocket = userssocketid[recipientId];
    console.log(userid,"usrid-------")
    const statususer=await ChatUserController.getuserdata(userid);
    console.log(statususer,"user-----")
    if(statususer !=1){
      return socket.emit('receiveuserblocked', { socketId: recipientId , message: "You are blocked"});
    }
    const savemessagedetails = ChatUserController.savemessage(userid, message, 'user');
    const getadminsocket = await ChatAdminController.adminsocketid();
    console.log(getadminsocket, "admin skt id --")
    const checkadminsocket = userssocketid[getadminsocket];
    if (checkadminsocket) {
      console.log(getadminsocket, "admin msg recieved---")
      checkadminsocket.emit("receiveuserMessage", {
        senderId: getadminsocket,
        id:userid,
        message: message,
      });
    } else if (recipientSocket) {
      const answer = await getanswer(message);
      if (answer) {
        console.log(answer, "answer")
        const savemessageanswer = savemessage(userid, answer, 'ai');
        recipientSocket.emit("receivePrivateMessage", {
          senderId: socket.id,
          message: answer
        });
      } else {
        const staticanswer = 'Sorry ,No answer found';
        const savemessageanswer = ChatUserController.savemessage(userid, staticanswer, 'server');
        recipientSocket.emit("receivePrivateMessage", {
          senderId: socket.id,
          message: staticanswer
        });
      }

      console.log(`Private message sent to ${recipientId} from ${socket.id}: ${message}`);
    } else {

      console.log(`User ${recipientId} is not connected`);
    }
  });

  socket.on("adminmessage", async ({ id, sender, text }) => {
    console.log(text, "-admin message ");
    const getsocketid = await ChatUserController.getUsersocketid(id);
    console.log(getsocketid, "socketid");
    const savemessagedetails = ChatUserController.savemessage(id, text, 'admin');

    const checkuserscoket = userssocketid[getsocketid];
    if (checkuserscoket) {
      checkuserscoket.emit("receivePrivateMessage", {
        senderId: socket.id,
        message: text
      });
    } else {
      console.log("User not connected")
    }

  })

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
    delete userssocketid[socket.id];
  });
};

module.exports = { handleConnection };

