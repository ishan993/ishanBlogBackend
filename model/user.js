var mongoose = require('mongoose');
var postDAO = require('../model/post');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	_id: String,
	firstName: String,
	lastName: String,
    password: String
});


var User = mongoose.model('User', userSchema);

var error  = {
			statusCode:400,
			messsage: ''
		};

///////////////////////////////////////////
//// Register User
//////////////////////////////////////////

var registerUser = function(jsObj, callback){
	var temp = User(jsObj);
	temp._id = jsObj.email.toLowerCase();
	temp.save(function(err, savedUser){

		if(err){
			var error = {status:403,
			 message: err.message};
			callback(error);
		}else{
			callback(null, savedUser);
		}
	});
};

///////////////////////////////////////////
//// Login user
//////////////////////////////////////////

var loginUser = function(jsObj, callback){
	
	User.findById(jsObj.email, function(err, result){
		if(err){
			console.log(err);
			callback({statusCode: 400,
				message: err.message});
		}else{
			console.log("This is the result: "+JSON.stringify(jsObj));
			if(!result || jsObj.password != result.password){
				callback({statusCode:401,
					message: "Incorrect id/password combination"});
				console.log("Password incorrect");
			}else{
				callback(null, {message: jsObj._id+" Successfully logged in!", user: result});
			}
		}
	});
}

///////////////////////////////////////////
//// Retrieve User info and Blog posts
//////////////////////////////////////////

var getUserInfo = function(userId,callback){
	var response;
	var postInfo;
	var userInfo;

	User.findOne({_id:userId}, function(err, user){
		if(err){
			console.log(err);
			error.statusCode = 400;
			error.message = err.message;
			callback(error);
		}else{
			console.log(user);
			if(user._id == null){
				error.statusCode = 404;
				error.message = "User not found";
				callback(error);
			}else{
				postDAO.getPostsByAuthor(userId, function(err, posts){
					if(err){
						error.statusCode = 404;
						error.message = err.message;
						callback(err);						
					}else{
						var response = {
							userData: user,
							postData: posts
						}
					}
					callback(null, response);
				});
			}
		}
	})
}



var updateUser = function(jsObj){

	User.findById(jsObj._id, function(err, user){
		console.log(user);
		user.firstname = 'Ishan';
		user.save();
	})
};

module.exports = {
	getUserInfo,
	updateUser,
	User,
	registerUser,
	loginUser
};




