import express from 'express';
import jwtDecoder from 'jwt-decode';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import { dbConfig } from './config';
import { apiController } from './controller/apiController';
import { userController } from './controller/userController';
import { postController } from './controller/postController';

const app = express();
app.set('view engine', 'ejs');

console.log(`mongodb://${dbConfig.username}:${dbConfig.password}@${dbConfig.dbAddress}`);

mongoose.connect(`mongodb://${dbConfig.username}:${dbConfig.password}@${dbConfig.dbAddress}`, {
  server: {
    socketOptions: {
      socketTimeoutMS: 0,
      connectionTimeout: 0,
    },
  },
});
app.use(bodyParser.json({ limit: '50mb', parameterLimit: 1000000 }));
app.use(bodyParser.urlencoded({ limit: '50mb', parameterLimit: 1000000, extended: true }));

app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/hello', (req, res) => {
  try {
    const result = jwtDecoder(req.body.token || req.query.token || req.headers['x-access-token']);
    console.log('Here\'s your token: ' + JSON.stringify(result));
    if (result === undefined) {
      res.statusCode = 400;
    }
    /* postObj.userId = result._doc._id;
    postObj.postAuthor = result._doc.firstname+" "+result._doc.lastname;*/
  } catch (err) {
    console.log('I got this error: ' + err);
    res.json({ message: 'No token found. Please attach a valid token' });
  }
});


apiController(app);
userController(app);
postController(app);

app.listen(process.env.PORT || 3000);
