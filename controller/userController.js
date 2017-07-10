import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import jwtDecoder from 'jwt-decode';
import config from '../config';


var userDAO = require('../model/user');

export default (app) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

// /////////////////////////////////////////
// // Registeration
// ////////////////////////////////////////

  app.post('/signup', (req, res) => {
    console.log('trying to sign up:' + JSON.stringify(req.body.password));

    userDAO.registerUser(req.body, (err, result) => {
      if (err) {
        console.error(err);
        res.statusCode = err.statusCode;
        res.json({ message: err.message });
      } else {
        res.statusCode = 201;
        res.json(result);
        console.log(result);
      }
    });
  });

// /////////////////////////////////////////
// // Login
// ////////////////////////////////////////

  app.post('/login', (req, res) => {
    console.log('Login controller' + JSON.stringify(req.body));
    userDAO.loginUser(req.body, (err, result) => {
      if (err) {
        res.statusCode = (err.statusCode || 400);
        res.json({ message: err.message });
      } else {
        res.statusCode = 200;
        const token = jwt.sign(result.user, config.configJSON.secret, {
          expiresIn: 1440, // expires in 24 hours
        });

        res.json({
          status: "You're good.",
          token,
        });
      }
    });
  });


  app.post('/token', (req, res) => {
    const result = jwtDecoder(req.body.token || req.query.token || req.headers['x-access-token']);
    console.log(result);
    res.statusCode = 200;
    res.end('heh?');
  });

// /////////////////////////////////////////
// // Retrieve User info and blog posts
// ////////////////////////////////////////

  app.get('/user/:userId', (req, res) => {
    userDAO.getUserInfo(req.params.userId, (err, result) => {
      if (err) {
        res.statusCode = err.statusCode;
        res.json({ message: err.message });
      } else {
        console.log('Else1');
        res.statusCode = 200;
        res.json(result);
      }
    });
  });

  app.post('/update', (req, res) => {
    console.log(req.body);

    userDAO.updateUser(req.body);
    res.sendStatus(200);
  });
};
