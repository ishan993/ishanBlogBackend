import mongoose from 'mongoose';
import moment from 'moment';

const Schema = mongoose.Schema;

export const postSchema = new Schema({
  categories: [String],
  userId: String,
  postTitleImageURL: String,
  postDate: Number,
  postTitle: String,
  postAuthorId: String,
  postAuthorName: String,
  postContent: String,
  postDescription: String,
});

export const Post = mongoose.model('Post', postSchema);

let error = {
  statusCode: 400,
  message: '',
};

// will implement pagination later!
export const getAllPosts = (callback) => {
  Post.find({}, (err, result) => {
    if (err) {
      console.log('Error getting all posts' + err.message);
      error.statusCode = 400;
      error.message = err.message;
      callback(error);
    } else {
      callback(null, result);
    }
  });
};

export const getPost = (jsObj, callback) => {
  Post.findById(jsObj, (err, result) => {
    if (err) {
      error.statusCode = 400;
      error.message = err.message;
      callback(error);
    } else if (!result) {
      error.statusCode = 404;
      error.message = 'The requested post could not be found';
      callback(error);
    } else {
      callback(null, result);
    }
  });
};

export const savePost = (jsObj, callback) => {
  jsObj.postDate = moment();
  const post = Post(jsObj);
  post.save((err, result) => {
    if (err) {
      error.statusCode = 400;
      error.message = err.message;
      callback(error);
    } else {
      callback(null, result);
    }
  });
};

export const updatePost = (jsObj, callback) => {
  Post.findById({ postTitle: jsObj._id }, (err, result) => {
    if (!err) {
      Post.save(result);
    }
    callback(null, result);
  });
};

export const getPostsByAuthor = (userId, callback) => {
  Post.find({ userId: userId }, (err, result) => {
    if (err) {
      console.log('I got this error: ' + err.message);
      const error = {
        statusCode: 404,
        message: err.message,
      };
      callback(error);
    }
    if (result) {
      console.log('Returning this:' + result[0]);
      callback(null, result);
    }
  });
};

export const searchPosts = (searchString, callback) => {
  Post.find({ tags: searchString }, (err, posts) => {
    console.log(searchString);
    if (err) {
      console.log('Error while searching for posts in the DAO layer: ' + err);
      error.statusCode = 400;
      error.message = err.message;
      callback(error);
    } else {
      callback(null, posts);
    }
  });
};
