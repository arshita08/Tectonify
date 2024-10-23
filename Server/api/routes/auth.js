const router = require("express").Router();
var User = require("../models").user;
const Student = require('../models').Student;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtOptions } = require("../config/jwtOptions");
const sgMail = require("@sendgrid/mail");
const { token } = require("morgan");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// don't forget to add a secret KEY
const secretKey = process.env.SECRET_KEY || "secretEmailVerify";
const RegisterController = require('../features/controllers/register/index');

// find user
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const getUser = async (obj) => {
  console.log("i am in   ", obj);
  return await User.findOne({
    where: obj,
  });
};

const getStudent = async (userid) => {
  
  return await Student.findOne({
    where: {user_id:userid},
  });
};

// update token info in user table
const updateTokenInfo = async (obj) => {
  return await User.update(
    { verification_token: obj.token, verified_at: Date.now(), is_verified: 1 },
    {
      where: { id: obj.id },
    }
  );
};
// login
router.post("/login", async function (req, res, next) {
  const { email, password } = req.body;
  if (email && password) {
    if (isValidEmail(email)) {
    let getuser = await getUser({ email: email });

    if (!getuser) {
      return res.status(401).json({ message: "No such user found" });
    } 

       let user=getuser.toJSON();
    

  
  
    
    bcrypt.compare(password, user.password, async(err, result) => {
      if (err) {
        res.status(403).json({ message: "incorrect password" });
      }
      if (result) {
        let payload = { user };
        let token = jwt.sign(payload, jwtOptions.secretOrKey);
        
        console.log(user,"user1");
        return res.status(200).json({ message: "success", token, user });
      } else {
        return res.status(403).json({ message: "incorrect password" });
      }
    });
  }else{
   
    let user = await getUser({ username: email });

    if (!user) {
      return res.status(401).json({ message: "No such user found" });
    }

     try{
       if(user.student_id != null){
       const student=await getStudent(user.id);
       user.Student=await student;
       console.log(user.Student,"user1")
       }
    }catch(err){
      console.log(err);
    }

    console.log(user.Student,"user2")

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        res.status(403).json({ message: "incorrect password" });
      }
      if (result) {
        let payload = { user };
        let token = jwt.sign(payload, jwtOptions.secretOrKey);
        return res.status(200).json({ message: "success", token, user });
      } else {
        return res.status(403).json({ message: "incorrect password" });
      }
    });
  
  }
  }
   
});

//register a new user
router.post("/register",RegisterController.register);
// verify email by jwt token
router.get("/verify-email/:token", async function (req, res, next) {
  //const { email, password } = req.body;
  //console.log(req.params);return false;
  var token = req.params.token;
  console.log(token);
  //const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, jwtOptions.secretOrKey);

  const user = await getUser({ id: decoded.id, email: decoded.email });
  //console.log(user.toJSON(),'get user data');return false;
  var userFind = user.toJSON();
  if (userFind.id && userFind.email) {
    let user = await updateTokenInfo({ id: userFind.id, token: token });
    if (!user) {
      return res.status(401).json({ message: "No such user found" });
    } else {
      return res.status(200).json({ message: "user updated", step: 2 });
    }
  }
});

module.exports = router;
