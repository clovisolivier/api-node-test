"use strict";

// Functions for format validation
module.exports = {

    // validate authenticate input format 
    validateAuthentificate : function(app, req, res) {
        
        req.checkBody( "name", "Required").notEmpty();

        req.checkBody( "password", "Required").notEmpty();

        var errors = req.validationErrors();
        if (errors) {
            res.status(400).send(errors);
            return;
        }
    },

    // validate add user input format
    validateAddUser : function(app, req, res) {
        
        req.checkBody( "name", "Required").notEmpty();

        req.checkBody( "password", "Required").notEmpty();

        req.checkBody( "admin", "Required").notEmpty();
        req.checkBody( "admin", "Should be boolean").isBoolean();

        var errors = req.validationErrors();
        if (errors) {
            res.status(400).send(errors);
            return;
        }
    }
};