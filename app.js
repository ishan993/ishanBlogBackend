var express = require('express');
var config = require('./config');
var app = express();

var apiController = require('./controller/apiController');
var userController = require('./controller/userController');
var postController = require('./controller/PostController');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
app.set('view engine', 'ejs');

console.log(`mongodb://${config.mongoConfig.username}:${config.mongoConfig.password}@${config.mongoConfig.dbAddress}`);
mongoose.connect(`mongodb://${config.mongoConfig.username}:${config.mongoConfig.password}@${config.mongoConfig.dbAddress}`, {
  server: {
    socketOptions: {
      socketTimeoutMS: 0,
      connectionTimeout: 0
}}});
app.use(bodyParser.json({limit: '50mb', parameterLimit: 1000000}));
app.use(bodyParser.urlencoded({limit: '50mb', parameterLimit: 1000000, extended: true}));

var responseJSON='';

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
})

app.get('/home', function(req, res, next){
    res.render('index',{Message:'Hello'});
});
app.get('/hello', (req, res)=>{
    res.statusCode = 200;
    res.end("Hello");
})


apiController(app);
userController(app);
postController(app);

app.listen(process.env.PORT || 3000)