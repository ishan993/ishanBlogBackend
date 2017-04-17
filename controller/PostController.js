var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var jwtDecoder = require('jwt-decode');
var postDAO = require('../model/post');

module.exports = function(app){

   

///////////////////////////////////////////
//// Search for a post by id
//////////////////////////////////////////

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

///////////////////////////////////////////
//// Create a new post
//////////////////////////////////////////

    app.post('/post', function(req, res){
    
  /*  try{
      var result = jwtDecoder(req.body.token || req.query.token || req.headers['x-access-token']);
    }catch(err){
        if (result == null)
        res.statusCode = 400;
        res.json({message: "No token found. Please attach a valid token"});
        return;
    }*/

      console.log(`The post content is ${req.body.postContent}`);
      var postObj = req.body;
      postObj.userId = req.body.userId;
      postObj.postAuthor = req.body.postAuthor;
     /* postObj.userId = result._doc._id;
      postObj.postAuthor = result._doc.firstname+" "+result._doc.lastname;*/
      
      if(req.body._id != null){
          console.log("Just imagine that I'm updating the post");
          res.end("got it, dude.");
          return;
      }
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

///////////////////////////////////////////
//// Search for posts by tags
//////////////////////////////////////////

    app.get('/search', function(req, res){ 

        postDAO.searchPosts(req.query.tag, function(err, posts){

        if(err){
            res.statusCode = err.statusCode;
            res.json({message: err.message});
        }else{
            res.statusCode = 200;
            res.json({posts:posts});
        }
        });        
    });

};