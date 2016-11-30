var SchemaObject = require('node-schema-object');
 
// Create User schema 
var User = new SchemaObject({
  name: String,
  password: String,
  admin: Boolean
}

);

// Initialize instance of user 
var user = new User({name: 'Scott', password: 'Hovestadt', admin: true});
console.log(user); 