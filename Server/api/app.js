require('dotenv').config({
    path: `./env-files/${process.env.NODE_ENV || 'production'}.env`,
  });
  
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const strategy = require('./config/jwtOptions');
const passport = require('passport');
const ChatUser = require('./models').chat_user;
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// const httpsServer = https.createServer(app);

// console.log(httpsServer,'get https server');

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
  }
  next();
});

const checkAuth = require('./middleware/checkAuth');

// Database
const db = require('./models/index');
// Routes
const usersRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/question');
const chatsettingRoutes = require('./routes/chatsetting');
const dashboardRoutes = require('./routes/dashboard');

db.sequelize.sync();
// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('./public'))
global.__basedir = __dirname;
const upload = multer({ dest: path.join(__dirname,'/recordings') });

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
// use the strategy
passport.use("strategy" , strategy);

app.use('/auth',authRoutes);
// you need to be authenticated


app.use('/user',checkAuth,usersRoutes);
app.use('/dashboard',checkAuth,dashboardRoutes);
app.use('/questions', checkAuth,  questionRoutes);
app.use('/settings', checkAuth, chatsettingRoutes);
app.get('/', (req, res) => {
  res.send('Server is running and responding!');
});

app.get('/verify', async (req, res) => {
  const token = req.query.token;

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;

      const user = await ChatUser.findByPk(userId);
      if (user) {

          user.is_verified = '1';
          await user.save();

          res.send('<h1>Your email has been successfully verified!</h1>');
      } else {
          res.status(404).send('User not found');
      }
  } catch (error) {

      res.status(400).send('Invalid or expired token');
  }
});


module.exports = app;