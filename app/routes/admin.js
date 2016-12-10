"use strict";

//module.exports = function(io, app, Global, db_produits, db_backup, fs) {
module.exports = function(app, express, jwt ) {
// get an instance of the router for api routes
var adminRoutes = express.Router(); 
//var validatorTool = require('../tools/validator.js');

var UserMongo  = require('./../models/user.mongo');
// =======================
// routes ================
// =======================
// basic route

// route to authenticate a user (POST http://localhost:8080/api/authenticate)

adminRoutes.post('/authenticate', function(req, res) {

  // find the user
  UserMongo.findOne({
    name: req.body.name
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        if (!user.admin) {
        res.json({ success: false, message: 'Authentication failed. You are not admin' });
        } else {
          // if user is found and password is right
          // create a token

          var token = jwt.sign(user, app.get('superSecretAdmin'), {
            expiresIn: 1440 // expires in 24 hours
          });

          // return the information including token as JSON
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          });
          }
      }   

    }

  });
});


// route middleware to verify a token
adminRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecretAdmin'), function(err, decoded) {      
      if (err) {
        return res.status(403).json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});

adminRoutes.get('/', function(req, res) {
    res.send('Hello! The API is admin only');
});

adminRoutes.get('/users', function(req, res) {

  UserMongo.find({  }, function (err, docs) {
    // docs is an array
    if (err) throw err;

    if (!docs) {
      res.status(204);
    } else if (docs) {
      res.json(docs);
    }   
  });

});


// show specific user
adminRoutes.get('/user/:username', function(req, res) {
  UserMongo.find({ 
    name : req.params.username
   }, function (err, user) {
    // docs is an array
    if (err) throw err;

    if (!user) {
      res.status(204);
    } else if (user) {
      res.json(user);
    }   
  });
});


// delete user
adminRoutes.delete('/user/:username', function(req, res) {
  // validate input format
 // validatorTool.validateDeleteUser(app, req, res);
  UserMongo.remove({
    name : req.params.username
  }, function(err){

    if (err) throw err;
  });
  
  res.status(204).send();

});

app.use('/admin', adminRoutes);
};