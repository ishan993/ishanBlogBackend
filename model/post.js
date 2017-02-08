var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var postSchema = new Schema({
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

module.exports = {

    savePost,
    getPost    
};