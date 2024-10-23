const jwt = require('jsonwebtoken');
var ApiKey = require('../models').Apikey;
const getApikey = async obj => {
    return await ApiKey.findOne({
        where: obj,
    });
};



// don't forget to add a secret KEY


module.exports = async (req, res, next) => {
    try {
        console.log(req.headers.apikey);
        const key = req.headers.apikey.split(" ")[0];
        
        if(key==='token'){
        const token = req.headers.apikey.split(" ")[1];
        let api_key = await getApikey({ apikey: token});
       
        const decoded = jwt.verify(token, api_key.apiSecret);
        req.apiData = decoded;
        next();
    }else{
        return res.status(401).json({
            message: 'Apikey Not valid 1'
        });
    }
    
    } catch (error) {
        return res.status(401).json({
            message: 'Apikey Not valid 2',
            error:error
        });
    }
};
