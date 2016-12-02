var SchemaObject = require('node-schema-object');
var store        = require('jfs');

var db_users = new store("./ressources/users.json", {
    pretty: true
});  

// Create User schema 
var User = new SchemaObject({
  name: String,
  password: String,
  admin: Boolean
}, {
  // Add methods to User prototype
  methods: {
    getDisplayName: function() {
      return this.name ;
    }
  }
}
);

module.exports = User;
