import bodyParser from 'body-parser';
import jwtDecoder from 'jwt-decode';

var postDAO = require('../model/post');

export default (app) => {
// /////////////////////////////////////////
// // Search for a post by id
// ////////////////////////////////////////
  app.get('/post/:postId', (req, res) => {
    const postId = req.params.postId;
    console.log('returning only one post: ' + postId);
    postDAO.getPost(postId, (err, result) => {
      if (err) {
        res.statusCode = err.statusCode;
        res.json({ message: err.message });
      } else {
        res.statusCode = 200;
        res.json({ message: result });
      }
    });
  });

// /////////////////////////////////////////
// // Create a new post
// ////////////////////////////////////////

  app.post('/post', (req, res) => {
  /*  try{
      var result = jwtDecoder(req.body.token || req.query.token || req.headers['x-access-token']);
    }catch(err){
        if (result == null)
        res.statusCode = 400;
        res.json({message: "No token found. Please attach a valid token"});
        return;
    }*/

    console.log(`The post content is ${req.body.postContent}`);
    const postObj = req.body;
    postObj.userId = req.body.userId;
    postObj.postAuthor = req.body.postAuthor;
     /* postObj.userId = result._doc._id;
      postObj.postAuthor = result._doc.firstname+" "+result._doc.lastname;*/
    if (req.body._id != null) {
      console.log("Just imagine that I'm updating the post");
      res.end('got it, dude.');
      return;
    }
    postDAO.savePost(postObj, (err, result) => {
      if (err) {
        res.statusCode = err.statusCode;
        res.json({ message: err.message });
      } else {
        res.statusCode = 200;
        res.json({ result });
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
