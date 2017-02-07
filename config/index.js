var configJSON = require('./config');
var mongoConfig = require('./dbConfig');

var loginInfoConfig = function(){
    return "httpLink"+configJSON.username+"withPass:"+configJSON.password;
}

module.exports ={
    loginInfoConfig,
    configJSON,
    mongoConfig
};