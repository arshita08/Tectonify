const express = require('express');
const User = require('../../models').User;
const Admin = require('../../models').Admin;

const getAll = async (req, res, next) => {
    console.log('api data      ',req.apiData)
    const user = await User.findAll({
        where: {status:'active' },
        attributes: ['id', 'firstName','lastName','email','profile_pic'],
        // include: [{
        //   model: Admin,
        //   as: 'Admin'
        // }]
      });
    res.json({message: "Directory Fetched Successfuly", data: user}); // dummy function for now
};



module.exports = {
    getAll,
};