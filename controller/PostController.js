var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var jwtDecoder = require('jwt-decode');
var postDAO = require('../model/post');

module.exports = function(app){

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

    app.get('/post/:postId', function(req, res){
        var postId = req.params.postId;
        console.log('returning only one post: '+postId);

        postDAO.getPost(postId, function(err, result){
            if(err){
                res.statusCode = err.statusCode;
                res.json({message : err.message});
            }else{
                res.statusCode = 200;
                res.json({message: result});
            }
        })
    });

    app.post('/post', function(req, res){

      var result = jwtDecoder(req.body.token || req.query.token || req.headers['x-access-token']);
      console.log(`This post is by ${result._doc._id}`);

      var postObj = {
          userId: result._doc._id,
          postAuthor: result._doc.firstname+" "+result._doc.lastname,
          postDate: req.body.date,
          postTitle: req.body.title,
          postContent: req.body.content
      };

      postDAO.savePost(postObj, function(err, result){
          if(err){
              res.statusCode = err.statusCode;
              res.json({message: err.message});
          }else{
              res.statusCode = 200;
              res.json({ result : result});
          }
      });
    });

};