define(["jquery", "backbone"],

    function($, Backbone) {

        // Creates a new Backbone Model class object
        var ChangePassword = Backbone.Model.extend({
            urlRoot :'/user/changePassword',
            // Model Constructor
            initialize: function() {
            },

            // Default values for all of the Model attributes
            defaults: {
                _id:'',
                password:''
            },

            // Gets called automatically by Backbone when the set and/or save methods are called (Add your own logic)
            validate: function(attrs) {

            }

        });

        // Returns the Model class
        return ChangePassword;

    }

);
