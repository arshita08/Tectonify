const express = require('express');
var User = require("../../../models").user;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtOptions } = require("../../../config/jwtOptions");

// don't forget to add a secret KEY
const secretKey = process.env.SECRET_KEY || "secretEmailVerify";

const createUser = async ({
    name,
    username,
    email,
    password,
    verify_token,
  }) => {
    return await User.create({
      name,
      username,
      email,
      password,
      type: "user",
      verify_token,
    });
  };
// find user
const getUser = async (obj) => {
    return await User.findOne({
      where: obj,
    });
  };


  const register = async (req, res, next) => {
    const user = await getUser({ email: req.body.email });

    // console.log(user,'get user here');return false;
    if (user) return res.status(409).json({ message: "email already exists" });
    const salt = await bcrypt.genSalt(10);
    bcrypt.hash(req.body.password, salt, (err, hash) => {

  
      createUser({
        name: req.body.firstName,
        username: req.body.username,
        email: req.body.email,
        password: hash,
      }).then((user) => {
        // console.log(user.toJSON(),'get me here');
        let token = jwt.sign(user.toJSON(), jwtOptions.secretOrKey);
    
  
        res.status(200).json({ user, msg: "account created successfully" });
      });
    });
};


module.exports = {
    register,
};