"use strict";

//module.exports = function(io, app, Global, db_produits, db_backup, fs) {
module.exports = function(app, express, jwt, db_users ) {
// get an instance of the router for api routes
var adminRoutes = express.Router(); 
var validatorTool = require('../tools/validator.js');
// =======================
// routes ================
// =======================
// basic route

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
adminRoutes.post('/authenticate', function(req, res) {
  
  // validate input format
  validatorTool.validateAuthentificate(app, req, res);
  
  db_users.get(req.body.name, function(err, user){

    if ( err || !user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        if (user.admin != true) {
          res.json({ success: false, message: 'You are not admin.' });
        } else {

            // if user is found and password is right
            // create a token
            var token = jwt.sign(user, app.get('superSecretAdmin'), {
            expiresIn: '36h' // expires in 24 hours
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

// show all users
adminRoutes.get('/users', function(req, res) {
    res.send(db_users.allSync());
});

// show specific user
adminRoutes.get('/user/:username', function(req, res) {
    res.send(db_users.getSync(req.params.username));
});

// add new user
adminRoutes.post('/user', function(req, res) {
  // validate input format
  validatorTool.validateAddUser(app, req, res);
  req.body.undeletable = false;
  db_users.save(req.body.name,req.body, function(err,id) {
    if (err)
    return res.status(500).json({ success: false, message: 'Failed to save user' });    
  });
  
  res.send(req.body);
});

// delete user
adminRoutes.delete('/user', function(req, res) {
  // validate input format
  validatorTool.validateDeleteUser(app, req, res);
 var user ;
  db_users.get(req.body.name, function(err, obj){
      user =obj;
      if (err)
        res.send(req.body);
      });

  if (!(user.undeletable)){
  db_users.delete(req.body.name, function(err){
    if (err)
    return res.status(500).json({ success: false, message: 'Failed to delete user' });   
  });
  } else {
    return res.status(200).json({ success: false, message: 'Not allowed to delete this user' });  
  }
  
  res.send(req.body);

});

app.use('/admin', adminRoutes);
};