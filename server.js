// =======================
// get the packages we need ============
// =======================
var express     = require('express');
var app         = express();
var store       = require('jfs');
var fileSystem  = require('fs');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
//var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./app/models/user'); // get our user model


var db_users = new store("./ressources/users.json", {
    pretty: true
});  
// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
//mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));



require('./app/routes/api.js')(app, express, jwt, db_users) ;
require('./app/routes/admin.js')(app, express, jwt, db_users) ;
// apply the routes to our application with the prefix /api




app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/');
});
// API ROUTES -------------------
// we'll get to these in a second

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);