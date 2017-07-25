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
        res.statusCode = 201;
        res.json({ result });
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
        const token = jwt.sign(result, config.secret, {
          expiresIn: '7d',
        });
        result.token = token;
        res.json({ result });
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

  app.post('/token', (req, res) => {
    try {
      const user = jwtDecoder(req.body.token || req.query.token || req.headers['x-access-token']);
      console.log('token Okay!');
      res.json({ user });
    } catch (err) {
      console.log('I got this token error: ' + err);
      res.statusCode = 400;
      res.json({ message: 'No token found. Please attach a valid token' });
    }
  });
  app.post('/update', (req, res) => {
    console.log(req.body);

    userDAO.updateUser(req.body);
    res.sendStatus(200);
  });
};
