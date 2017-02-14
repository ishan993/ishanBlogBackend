var mongoose = require('mongoose');
var user = require('../model/user');

var Schema = mongoose.Schema;

var postSchema = new Schema({
    tags: [String],
    userId: String,
    postDate: Date,
    postTitle: String,
    postAuthor: String,
    postContent: String
});

var Post = mongoose.model('Post', postSchema);

var error = {
    statusCode: 400,
    message: ''
};

var getPost = function(jsObj, callback){
    Post.findById(jsObj, function(err, result){
        if(err){
            error.statusCode = 400;
            error.message = err.message;
            callback(error);
        }else{
            if(!result){
                error.statusCode = 404;
                error.message = "The requested post could not be found";
                callback(error);
            }else{
                callback(null, {result});
            }
        }
    });
};

var savePost = function(jsObj, callback){

    var post = Post(jsObj);
    post.save(function(err, result){
        if(err){
            error.statusCode = 400;
            error.message = err.message;
            callback(error);
        }else{
            callback(null, result);
        }
    })
}


var updatePost = function(jsObj, callback){
    
    Post.findById({postTitle:jsObj._id}, function(err, result){
        if(!err)
        Post.save(result)
        callback(null, result);
    });
};

var getPostsByAuthor =  function(userId, callback){

    Post.find({userId:userId}, function(err, result){
        if(err){
            console.log("I got this error: "+err.message);
            var error = {
                statusCode: 404,
                message: err.message
                };
            callback(error);
        }
        if(result){
            console.log("Returning this:" + result[0] );
            callback(null, result);
        }
    });
}
var searchPosts = function(searchString, callback){
    
    Post.find({tags:searchString}, function(err, posts){
        console.log(searchString);
        if(err){
            console.log("Error while searching for posts in the DAO layer: "+err);
            error.statusCode = 400;
            error.message = err.message;
            callback(error);
        }else
            callback(null, posts);
    });
};

module.exports = {
    searchPosts,
    getPostsByAuthor,
    savePost,
    getPost    
};