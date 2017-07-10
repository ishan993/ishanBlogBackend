import mongoose from 'mongoose';

const postDAO = require('../model/post');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  _id: String,
  firstName: String,
  lastName: String,
  password: String,
});

export const User = mongoose.model('User', userSchema);

const error = {
  statusCode: 400,
  messsage: '',
};

// /////////////////////////////////////////
// // Register User
// ////////////////////////////////////////
export const registerUser = (jsObj, callback) => {
  const user = User(jsObj);
  user._id = jsObj.email.toLowerCase();
  user.save((err, result) => {
    const savedUser = result.toJSON();
    let message = '';
    if (err) {
      if (err.code === 11000) {
        message = 'A user with that email is already registered';
      } else {
        message = err.message;
      }
      const error = {
        statusCode: 400,
        message,
      };
      callback(error);
    } else {
      savedUser.password = undefined;
      callback(null, savedUser);
    }
  });
};

// /////////////////////////////////////////
// // Login user
// ////////////////////////////////////////
export const loginUser = (jsObj, callback) => {
  User.findById(jsObj.email, (err, result) => {
    if (err) {
      console.log(err);
      callback({
        statusCode: 400,
        message: err.message,
      });
    } else if (!result || jsObj.password !== result.password) {
      callback({
        statusCode: 401,
        message: 'Incorrect id/password combination',
      });
      console.log('Password incorrect');
    } else {
      const user = result.toJSON();
      user.password = undefined;
      console.log('I got this user: ' + JSON.stringify(user));
      callback(null, { user });
    }
  });
};

// /////////////////////////////////////////
// // Retrieve User info and Blog posts
// ////////////////////////////////////////
export const getUserInfo = (userId, callback) => {
  User.findOne({ _id: userId }, (err, user) => {
    if (err) {
      console.log(err);
      error.statusCode = 400;
      error.message = err.message;
      callback(error);
    } else if (user._id === undefined) {
      error.statusCode = 404;
      error.message = 'User not found';
      callback(error);
    } else {
      postDAO.getPostsByAuthor(userId, (err, posts) => {
        if (err) {
          error.statusCode = 404;
          error.message = err.message;
          callback(err);
        } else {
          const response = {
            userData: user,
            postData: posts,
          };
          callback(null, response);
        }
      });
    }
  });
};

export const updateUser = (jsObj) => {
  User.findById(jsObj._id, (err, user) => {
    console.log(user);
    user.firstname = 'Ishan';
    user.save();
  });
};


