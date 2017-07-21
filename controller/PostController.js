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
  /*  try{
      var result = jwtDecoder(req.body.token || req.query.token || req.headers['x-access-token']);
    }catch(err){
        if (result == null)
        res.statusCode = 400;
        res.json({message: "No token found. Please attach a valid token"});
        return;
    }*/
    console.log(`The post content is ${req.body.postContent}`);
    if (req.body._id != null) {
      console.log("Just imagine that I'm updating the post");
      res.end('got it, dude.');
      return;
    }
    const postObj = req.body;
    postObj.userId = req.body.userId;
    postObj.postAuthor = req.body.postAuthor;
     /* postObj.userId = result._doc._id;
      postObj.postAuthor = result._doc.firstname+" "+result._doc.lastname;*/
    postDAO.savePost(postObj, (err, result) => {
      if (err) {
        res.statusCode = err.statusCode;
        res.json({ message: err.message });
      } else {
        console.log('Here\'s the newly saved Post:' + JSON.stringify(result));
        res.statusCode = 200;
        res.json({ result });
      }
    });
  });


// /////////////////////////////////////////
// // return all posts
// ////////////////////////////////////////
app.get('/posts/:pageNumber', (req, res) => {
  const pageNumber = req.params.pageNumber;
  postDAO.getAllPosts(pageNumber, (err, posts) => {
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
