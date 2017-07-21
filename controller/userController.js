import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import jwtDecoder from 'jwt-decode';
import { config } from '../config';
import { sendRegistrationConfirmation } from '../service/EmailService';

const userDAO = require('../model/user');

export const userController = (app) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

// /////////////////////////////////////////
// // Registeration
// ////////////////////////////////////////
  app.post('/user', (req, res) => {
    userDAO.registerUser(req.body, (err, result) => {
      if (err) {
        console.error(err);
        res.statusCode = err.statusCode;
        res.json({ message: err.message });
      } else {
        const token = jwt.sign(result, config.secret, {
          expiresIn: '2 days', // expires in 24 hours
        });
        result.token = token;
        console.log('I got this token: ' + JSON.stringify(result));
        res.statusCode = 201;
        res.json({ data: result });
        // sendRegistrationConfirmation(result);
        console.log(result);
      }
    });
  });

// /////////////////////////////////////////
// // Login
// ////////////////////////////////////////
  app.post('/login', (req, res) => {
    userDAO.loginUser(req.body, (err, result) => {
      if (err) {
        res.statusCode = (err.statusCode || 400);
        res.json({ message: err.message });
      } else {
        res.statusCode = 200;
        const token = jwt.sign(result.user, config.secret, {
          expiresIn: 1440, // expires in 24 hours
        });
        res.json({
          status: "You're good.",
          data: result,
          token,
        });
      }
    });
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
