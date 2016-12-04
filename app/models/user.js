"use strict";
// Constructor
function User(name, password, admin) {
    this.name = name;
    this.password = password;
    this.admin = false;
}

// class methods
User.prototype.log = function() {
    console.log(JSON.stringify(this));
};

User.prototype.getName = function() {
  return this.name;
};

User.prototype.getPassword = function() {
  return this.password;
};

User.prototype.getAdmin = function() {
  return this.admin;
};

module.exports = User;
