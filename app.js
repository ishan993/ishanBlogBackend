var express = require('express');
var config = require('./config');
var app = express();
var apiController = require('./controller/apiController');
var webController = require('./controller/webController');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');


app.set('view engine', 'ejs');
console.log(`mongodb://${config.mongoConfig.username}:${config.mongoConfig.password}@${config.mongoConfig.dbAddress}`);
mongoose.connect(`mongodb://${config.mongoConfig.username}:${config.mongoConfig.password}@${config.mongoConfig.dbAddress}`);

app.get('/login',function(req, res){
    console.log('Trying to login user'+req.body.id);
   // userDAO.loginUser(req.body);
    res.sendStatus(200);
});

app.get('/user/:userName', function(req, res){
    console.log("The username is:"+req.params.userName+" with password: "+req.query.password);
    res.end("Pearl Jam!");
});




app.get('/home', function(req, res){
    res.render('index',{Message:'Hello'});
});

apiController(app);
webController(app);

app.listen(3000);