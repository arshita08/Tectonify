const express = require('express');
const Industry = require('../../../models').Industry;
const College = require('../../../models').College;
const Company = require('../../../models').Company;
const Interest = require('../../../models').Interest;
const Jobtitle = require('../../../models').Jobtitle;
const Admin = require('../../../models').Admin;
const User = require('../../../models').User;
var NetworkUser = require("../../../models").NetworkUser;
const fs = require('fs')
const path = require('path')
const csv = require('fast-csv')

async function csvToDb(csvUrl,type,adminUserID) {
    let stream = fs.createReadStream(csvUrl)
    let collectionCsv = []
    let csvFileStream = await csv
      .parse()
      .on('data', async function (data) {
        var newarray={'name':data[0],'description':data[1],'userId':adminUserID}
        await collectionCsv.push(newarray)
      })
      .on('end', async function () {
        collectionCsv.shift();
          
            
            await collectionCsv.forEach(async function (item, index) {
             // await console.log(item.name);
             if (type=="insustry") {
              await  Industry.findOne({ where: {name: item.name.trim()} }).
                  then(function(industry){
                    if (!industry){
                      // Author does not exist...
                      Industry.create(item)
                    }
                  })
                } else if (type=="college") {
                  await  College.findOne({ where: {name: item.name.trim()} }).
                  then(function(college){
                    if (!college){
                      // Author does not exist...
                      College.create(item)
                    }
                  })
                } else if (type=="company") {
                  await  Company.findOne({ where: {name: item.name.trim()} }).
                  then(function(company){
                    if (!company){
                      // Author does not exist...
                      Company.create(item)
                    }
                  })
                }else if (type=="interest") {
                  await  Interest.findOne({ where: {name: item.name.trim()} }).
                  then(function(interest){
                    if (!interest){
                      // Author does not exist...
                      Interest.create(item)
                    }
                  })
                }
                else if (type=="jobtitle") {
                  await  Jobtitle.findOne({ where: {name: item.name.trim()} }).
                  then(function(jobtitle){
                    if (!jobtitle){
                      // Author does not exist...
                      Jobtitle.create(item)
                    }
                  })
                }
            });
     
       
        
          // fs.unlinkSync(csvUrl);
      })
    stream.pipe(csvFileStream)
  }

const uploadAutoCompleteCSV = async (req, res, next) => {
    const uploadType = req.body.type;
    const rootDir = path.resolve('./');
    console.log("dir path ----   ",rootDir);
    console.log("file data ----   ",req.file);
    
     var test = await csvToDb(rootDir + '/uploads/' + req.file.filename,uploadType,req.userData.user.id)
    //  fs.unlinkSync(rootDir + '/uploads/' + req.file.filename);
    // req.body.userId = req.userData.user.id;
    // const isExist = await Industry.findOne(
    //     { 
    //         where: { name: req.body.name},
        
    // });
    // if(isExist){
    //     res.json({message: "Industry Name Already Exist", data: req.body.name});
    // }
    // const industry = await Industry.create(req.body);

    // console.log(industry);
    res.json({message: uploadType+" CSV Data"}); // dummy function for now
};


async function csvToDbuser(csvUrl,type,adminUserID) {
  let stream = fs.createReadStream(csvUrl)
  let collectionCsv = []
  let csvFileStream = await csv
    .parse()
    .on('data', async function (data) {

      var password = data[0]+'_'+Date.now().toString(36);
      var newarray={
        'firstName':data[0],
        'lastName':data[1],
        'email':data[2],
        'password':password,
        'profile_pic':data[3],
        'status':'active',
        'user_from':'CSV',
      }
      await collectionCsv.push(newarray)
    })
    .on('end', async function () {
      collectionCsv.shift();
        
          
          await collectionCsv.forEach(async function (item, index) {
           // await console.log(item.name);
           
                await  User.findOne({ where: {email: item.email.trim()} }).
                then(function(user){
                  if (!user){
                    // Author does not exist...
                    User.create(item)
                  }
                })
             
          });
   
     
      
        // fs.unlinkSync(csvUrl);
    })
  stream.pipe(csvFileStream)
}

const uploadCsv = async (req, res, next) => {
  const rootDir = path.resolve('./');
  
   var test = await csvToDbuser(rootDir + '/uploads/' + req.file.filename)
  
  res.json({message: " CSV User Data"}); // dummy function for now
};

async function imgToDbuser(image,userId) {
  console.log(userId,'get userid');
  return await NetworkUser.update(
    { profile_pic: image },
    {
      where: { id: userId },
    }
  );
}

const uploadImage = async (req, res, next) => {
  const rootDir = path.resolve('./');
  console.log(req.body.userId,'get file ');
   var test = await imgToDbuser(req.file.filename,req.body.userId)
  console.log(test,'get response');
  res.json({test,message: " User Image Data"}); // dummy function for now
};
module.exports = {
    uploadAutoCompleteCSV,
    uploadCsv,
    uploadImage
};