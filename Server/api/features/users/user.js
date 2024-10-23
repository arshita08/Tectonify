const express = require('express');
const User = require('../../models').chat_user;
const UserAdmin = require('../../models').user;
const UserChat = require('../../models').user_chat;
const bcrypt = require("bcrypt");

const getAll = async (req, res, next) => {
    const user = await User.findAll({
        where: { is_verified: '1' },

    });
    res.json({ message: "Users Fetched Successfuly", data: user });
};
const create = async (req, res, next) => {
    console.log(req.body);
    // req.body.userId = req.userData.user.id;
    const isExist = await User.findOne(
        {
            where: { email: req.body.email },

        });
    if (isExist) {
        res.json({ message: "Email Already Exist", data: req.body.name });
    }
    const user = await User.create(req.body);
    res.json({ message: "User Created Successfully", data: user });
};
const getById = async (req, res, next) => {

    const id = Number(req.params.userId);
    const user = await User.findOne(
        {
            where: { id: id },
            include: [
                { model: UserChat, as: 'Chats' }
            ]

        });

    if (!user) {
        return res.status(404).send('User not found')
    }
    res.json({ message: "User Fetched Successfully", data: user })
};

const getUserChat = async (req, res, next) => {

    const id = Number(req.params.userId);
    const user = await User.findOne(
        {
            where: { id: id },
            include: [
                { model: UserChat, as: 'Chats' }
            ]
        });

    if (!user) {
        return res.status(404).send('User not found')
    }
    const userchats = user.Chats;
    if(req.query.admin==1){
        const userchatobject = userchats.map(item => {
            if (item.question) {
                return {
                    text: item.question,
                    sender: 'user',
                    date:item.createdAt
                }
            } else {
                return {
                    text: item.answer,
                    sender: 'Admin',
                    date:item.createdAt
                }
            }
        })
    
        res.json({ message: "User Chats Fetched Successfully", data: userchatobject});
        
    }else{
      
        const userchatobject = userchats.map(item => {
            if (item.question) {
                return {
                    text: item.question,
                    sender: 'sent',
                    date:item.createdAt
                }
            } else {
                return {
                    text: item.answer,
                    sender: 'received',
                    date:item.createdAt
                }
            }
        })
    
      return res.json({ message: "User Chats Fetched Successfully", data: userchatobject});
    }
    
};

const UpdateUserstatus = async (req, res, next) => {
    try {
        const id = Number(req.params.userId);
        const user = await User.findOne({
            where: { id: id },
            
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log(user, "user");

        // Toggling the user's status
        if (user.status != 1) {
            console.log(user.status, "user data - unblocking");
            user.set('status', '1'); // Unblock user
            
        } else {
            console.log(user.status, "user data - blocking");
            user.set('status', '0'); // Block user
        }

        await user.save();
        res.json({
            message: user.status != 1 ? "User blocked Successfully" : "User  unblocked Successfully",
            data: user
        });

    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

const getChatuserslist = async (req, res, next) => {

    const id = Number(req.params.userId);
    const users = await User.findAll(
        {
            include: [
                { model: UserChat, as: 'Chats' }
            ],
            
        });

        const usersWithActivity = users.map((user, index) => {
            let firstActive = null;
            let lastActive = null;
        
            if (user.Chats.length > 0) {
                // Sort the chats by createdAt
                const sortedChats = user.Chats.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        
                // Get the first and last chat createdAt dates
                firstActive = new Date(sortedChats[0].createdAt).toLocaleString(); // Format date and time
                lastActive = new Date(sortedChats[sortedChats.length - 1].createdAt).toLocaleString(); // Format date and time
            }
        
            return {
                Srno: index + 1, 
                name: user.name,
                email: user.email,
                firstActive,
                lastActive,
                status: user.status==1?'Active':'Blocked'
            };
        });

   
   

    res.json({ message: "Chats Users Fetched Successfully", data: usersWithActivity});
};

const changePassword = async (req, res,next) => {
    try {
      
      const userId = req.body.userid; 
      const { oldPassword, newPassword } = req.body;
  
      
      const user = await getUserById(userId); 
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }
  
      
      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);
  
      
      await updateUserPassword(userId, hashedNewPassword); 
  
      return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };

  const updateUserPassword = async (userId, newPassword) => {
  
    return await UserAdmin.update(
      { password: newPassword },
      { where: { id: userId } }
    );
  };  

const getUserById = async (userId) => {
  return await UserAdmin.findByPk(userId); 
};

module.exports = {
    getAll,
    create,
    getById,
    getUserChat,
    UpdateUserstatus,
    getChatuserslist,
    changePassword
};