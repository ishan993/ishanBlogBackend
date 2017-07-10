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
  const temp = User(jsObj);
  temp._id = jsObj.email.toLowerCase();
  temp.save((err, savedUser) => {
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
        message: err.message});
    } else {
      console.log('This is the result: ' + JSON.stringify(jsObj));
      if (!result || jsObj.password != result.password) {
        callback({
          statusCode: 401,
          message: 'Incorrect id/password combination',
        });
        console.log('Password incorrect');
      } else {
        callback(null, {
          message: jsObj._id + 'Successfully logged in!',
          user: result,
        });
      }
    }
  });
};

// /////////////////////////////////////////
// // Retrieve User info and Blog posts
// ////////////////////////////////////////

export const getUserInfo = (userId, callback) => {
  User.findOne({ _id:userId }, (err, user) => {
    if (err) {
      console.log(err);
      error.statusCode = 400;
      error.message = err.message;
      callback(error);
    } else {
      console.log(user);
      if (user._id == null) {
        error.statusCode = 404;
        error.message = 'User not found';
        callback(error);
      } else {
        postDAO.getPostsByAuthor(userId, function(err, posts){
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


