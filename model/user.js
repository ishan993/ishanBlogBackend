var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
	_id: String,
	firstname: String,
	lastname: String,
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
	
	User.findById(jsObj._id, function(err, result){
		if(err){
			console.log(err);
			callback({statusCode: 400,
				message: err.message});
		}else{
			if(jsObj.password != result.password){
				callback({statusCode:403,
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
	User.findById(userId,
	 function(err, result){
		if(err){
		error.statusCode = 400;
		error.message = err.message;
		callback(error);
	 	}else{
		 if(!result){
			error.statusCode = 403;
			error.message = "User not found"
			callback(error);
		 }else{
			 callback(null, result);
		 }}
	});
};

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




