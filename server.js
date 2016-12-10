// =======================
// get the packages we need ============
// =======================
var express     = require('express');
var app         = express();
var fileSystem  = require('fs');
var bodyParser  = require('body-parser');
var expressValidator = require('express-validator');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var UserMongo  = require('./app/models/user.mongo');

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database

app.set('superSecretAdmin', config.secretAdmin); // secret variable
app.set('superSecretUser', config.secretUser); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());

// use morgan to log requests to the console
app.use(morgan('dev'));

require('./app/routes/api.js')(app, express, jwt) ;
require('./app/routes/admin.js')(app, express, jwt) ;
// apply the routes to our application with the prefix /api


app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/');
});

app.get('/setup', function(req, res) {

  // create a sample user
  var nick = new UserMongo({ 
    name: 'jick', 
    password: 'password',
    admin: true 
  });

  // save the sample user
  nick.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ success: true });
  });
});

app.get('/setupUser', function(req, res) {

  // create a sample user
  var nick = new UserMongo({ 
    name: 'jean', 
    password: 'password',
    admin: false 
  });

  // save the sample user
  nick.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ success: true });
  });
});
// API ROUTES -------------------
// we'll get to these in a second

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);