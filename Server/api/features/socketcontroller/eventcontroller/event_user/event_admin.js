const AdminUser = require('../../../../models').user;

//check user verified
const adminsocketidupdate = async (socket) => {
    const usercheck=await AdminUser.findOne({
        where:{
            id:1,
         
        }
    });

    if(usercheck){
        usercheck.set('socket_id',socket);
        usercheck.save();
        return true;
    }else{
        return false;
    }

}

const adminsocketid = async () => {
    const usercheck=await AdminUser.findOne({
        where:{
            id:1,
         
        }
    });

    if(usercheck){
      
        return usercheck.socket_id;
    }else{
        return false;
    }

}




module.exports = {
    adminsocketidupdate,
    adminsocketid
};