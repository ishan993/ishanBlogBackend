var express = require('express');
var config = require('./config');
var app = express();

var apiController = require('./controller/apiController');
var userController = require('./controller/userController');
var postController = require('./controller/PostController');

var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');


app.set('view engine', 'ejs');
console.log(`mongodb://${config.mongoConfig.username}:${config.mongoConfig.password}@${config.mongoConfig.dbAddress}`);
mongoose.connect(`mongodb://${config.mongoConfig.username}:${config.mongoConfig.password}@${config.mongoConfig.dbAddress}`);


app.get('/home', function(req, res){
    res.render('index',{Message:'Hello'});
});

app.get('/test', function(req, res){
    console.log("I got hit!");
    res.json([
        {
            statusCode: 200,
            message: "You're good!"
        }, 
        {
            statusCode: 404,
            message: "Resourse not found"
    }]
    );
});

apiController(app);
userController(app);
postController(app);

app.listen(3000);