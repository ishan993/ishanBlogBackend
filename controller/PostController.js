import jwtDecoder from 'jwt-decode';
import moment from 'moment';

const postDAO = require('../model/post');

export const postController = (app) => {
// /////////////////////////////////////////
// // Search for a post by id
// ////////////////////////////////////////
  app.get('/post/:postId', (req, res) => {
    const postId = req.params.postId;
    console.log('returning only one post: ' + postId);
    postDAO.getPost(postId, (err, post) => {
      if (err) {
        res.statusCode = err.statusCode;
        res.json({ message: err.message });
      } else {
        res.statusCode = 200;
        res.json({ result: post });
      }
    });
  });


// /////////////////////////////////////////
// // Create a new post
// ////////////////////////////////////////
  app.post('/post', (req, res) => {
    try {
      const user = jwtDecoder(req.body.token || req.query.token || req.headers['x-access-token']);
      if (req.body._id != null) {
        console.log("Just imagine that I'm updating the post");
        res.end('got it, dude.');
      }
      const postObj = req.body;
      postObj.postAuthorId = user._id;
      postObj.postAuthorName = user.firstName + ' ' + user.lastName;
      postDAO.savePost(postObj, (err, result) => {
        if (err) {
          res.statusCode = err.statusCode;
          res.json({ message: err.message });
          console.log('I got this error: ' + err.message);
        } else {
          console.log('Here\'s the newly saved Post:' + JSON.stringify(result));
          res.statusCode = 200;
          res.json({ result });
        }
      });
    } catch (err) {
      res.statusCode = 400;
      console.log('I got this error in \post' + err);
      res.json({ message: 'No token found. Please attach a valid token before trying to post.' });
    }
  });


// /////////////////////////////////////////
// // return all posts
// ////////////////////////////////////////
  app.get('/posts', (req, res) => {
    postDAO.getAllPosts((err, posts) => {
      if (err) {
        console.log('Hitting error controller');
        res.statusCode = 400;
        res.json({ message: err.message });
      } else {
        res.statusCode = 200;
        res.json({ result: posts });
      }
    });
  });

// /////////////////////////////////////////
// // Search for posts by tags
// ////////////////////////////////////////
  app.get('/search', (req, res) => {
    postDAO.searchPosts(req.query.tag, (err, posts) => {
      if (err) {
        res.statusCode = err.statusCode;
        res.json({ message: err.message });
      } else {
        res.statusCode = 200;
        res.json({ posts });
      }
    });
  });
};
