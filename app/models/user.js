var SchemaObject = require('node-schema-object');
 
// Create User schema 
var User = new SchemaObject({
  name: String,
  password: String,
  admin: Boolean
}
);



module.exports = User;