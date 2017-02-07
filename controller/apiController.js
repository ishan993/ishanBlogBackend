var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var config = require('../config');
var userDAO = require('../model/user');

module.exports = function(app){

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    app.get('/api/user', function(req, res){
        console.log(req.body);

        userDAO.getUser({firstname:'Khandelwal'});
        res.sendStatus(200);
        res.end("heh?");
    });


    app.post('/api/register', function(req, res){        

        userDAO.saveUser(req.body);
        res.sendStatus(200);
    });


};