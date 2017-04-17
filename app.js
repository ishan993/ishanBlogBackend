var express = require('express');
var config = require('./config');
var app = express();
var multer = require('multer');

var apiController = require('./controller/apiController');
var userController = require('./controller/userController');
var postController = require('./controller/PostController');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
app.set('view engine', 'ejs');

var upload = multer({ dest: 'public/images' })
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

app.post('/createpost', function(req, res, next){
    console.log("Here's your response: "+JSON.stringify(req.body.postContent));
    responseJSON = req.body;
    res.end("Here you go, you dumbfuck");
});

app.get('/fetchpost/:postId', function(req, res, next){
    console.log("I got hit! Post Id:"+req.params.postId);
    res.statusCode = 200;
    res.json(responseJSON);
});
app.get('/hello', (req, res)=>{
    res.statusCode = 200;
    res.end("Hello");
})
app.post('/store',upload.single(), function(req, res, next){
    //storage._handleFile(req.file);
    console.log("Here's the file"+req.file);
})

apiController(app);
userController(app);
postController(app);

app.listen(process.env.PORT || 3000)