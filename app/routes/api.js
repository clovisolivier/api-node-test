"use strict";

//module.exports = function(io, app, Global, db_produits, db_backup, fs) {
module.exports = function(app, express, jwt, db_users ) {

// get an instance of the router for api routes
var apiRoutes = express.Router(); 
// =======================
// routes ================
// =======================
// basic route

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {
 
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

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, app.get('superSecretUser'), {
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
  });
});


// route middleware to verify a token
apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp 
    // simple user  
    jwt.verify(token, app.get('superSecretUser'), function(err, decoded) {      
      if (err) {
        // admin user
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

apiRoutes.get('/', function(req, res) {
    res.send('Hello! You can access API endpoint!');
});

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

};