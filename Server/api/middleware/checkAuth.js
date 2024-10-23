const jwt = require('jsonwebtoken');


// don't forget to add a secret KEY
const secretKey = process.env.SECRET_KEY || 'secret' ;

module.exports = (req, res, next) => {
    try {
        const chatRegex = /^\/chat\//;
 
        if (chatRegex.test(req.path) || req.path=='/chat') {
          return next(); 
        }
        else{
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, secretKey);
            req.userData = decoded;
            next();
          }
        
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};
