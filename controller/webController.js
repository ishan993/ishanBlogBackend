var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var config = require('../config');
var userDAO = require('../model/user');
var jwt = require('jsonwebtoken');

module.exports = function(app){

   
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

///////////////////////////////////////////
//// Registeration
//////////////////////////////////////////

    app.post('/register', function(req, res){
        
        userDAO.registerUser(req.body, function(err, result){
            if (err){
                console.error(err);
                res.statusCode = 400;
                res.json(err.message);
            }
            else{
            
            res.json({status: "You're good."});
            res.statusCode = 200;
            console.log(result);
            }
        });    
    });



    app.post('/login', function(req, res){
        console.log("Trying to log in :"+req.body._id);

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

    app.get('/token', function(req, res){
        console.log(jwt.decode(req.body.token));

        res.statusCode = 200;
        res.end("heh?");
    });

   


app.post('/update', function(req, res){
        console.log(req.body);

        userDAO.updateUser(req.body);
        res.sendStatus(200);
    });


};