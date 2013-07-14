define(["jquery", "backbone"],

    function($, Backbone) {

        // Creates a new Backbone Model class object
        var Cabang = Backbone.Model.extend({
            urlRoot :'/api/cabang',
            // Model Constructor
            initialize: function() {
            },

            // Default values for all of the Model attributes
            defaults: {
                _id:'',
                kodeCabang:'',
                namaCabang:''
            },

            // Gets called automatically by Backbone when the set and/or save methods are called (Add your own logic)
            validate: function(attrs) {

            }

        });

        // Returns the Model class
        return Cabang;

    }

);
