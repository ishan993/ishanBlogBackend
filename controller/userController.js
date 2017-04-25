var bodyParser = require('body-parser');
var config = require('../config');
var userDAO = require('../model/user');
var jwt = require('jsonwebtoken');
var jwtDecoder = require('jwt-decode');

module.exports = function(app){

   
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

///////////////////////////////////////////
//// Registeration
//////////////////////////////////////////

    app.post('/signup', function(req, res){
        console.log("Trying to sign up:"+JSON.stringify(req.body.password));
      
        userDAO.registerUser(req.body, function(err, result){
            if (err){
                console.error(err);
                res.statusCode = 400;
                res.json(err.message);
            }
            else{
            res.statusCode = 201;
            res.json(result);
            console.log(result);
            }
        });    
    });

///////////////////////////////////////////
//// Login
//////////////////////////////////////////

    app.post('/login', function(req, res){    
        console.log("Login controller"+JSON.stringify(req.body));    
        userDAO.loginUser(req.body, function(err, result){
            if(err){
                res.statusCode = (err.statusCode || 400);
                res.json({message: err.message});
            }else{
                res.statusCode = 200;
                var token = jwt.sign(result.user, config.configJSON.secret, {
                expiresIn: 1440 // expires in 24 hours
                   });

                res.json({status: "You're good.", 
                token: token});
                }

        });
    });
   
   
    app.post('/token', function(req, res){
        var result = jwtDecoder(req.body.token || req.query.token || req.headers['x-access-token']);
        console.log(result);        
        res.statusCode = 200;
        res.end("heh?");
    });

///////////////////////////////////////////
//// Retrieve User info and blog posts
//////////////////////////////////////////

    app.get('/user/:userId', function(req, res){
        userDAO.getUserInfo(req.params.userId, function(err, result){
            if(err){
                res.statusCode = err.statusCode;
                res.json({message: err.message});
            }else{
                console.log("Else1");
                res.statusCode = 200;
                res.json(result);
            }
        });
    });



    app.post('/update', function(req, res){
           console.log(req.body);

            userDAO.updateUser(req.body);
           res.sendStatus(200);
     });
};