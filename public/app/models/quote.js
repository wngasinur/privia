define(["jquery", "backbone"],

    function($, Backbone) {

        // Creates a new Backbone Model class object
        var Quote = Backbone.Model.extend({
            urlRoot :'/api/quote',
            // Model Constructor
            initialize: function() {
            },

            // Default values for all of the Model attributes
            defaults: {
                _id:'',
                imgProfile :'',
                kodeCustomer : '',
                namaCustomer:'',
                kendaraanRoda:'',
                jenisKendaraan:'',
                namaKendaraan:'',
                tahunBuat:'',
                hargaOTR:'',
                perusahaanKredit:'',
                lamaPinjaman:1,
                sukuBunga:'',
                asstTlo:'',
                cashBack:'',
                carDepreciation:'',
                pengurangTerakhir:'',
                provisi:'',
                bungaDibayar:'',
                admInsurance :''
            },

            // Gets called automatically by Backbone when the set and/or save methods are called (Add your own logic)
            validate: function(attrs) {

            }

        });

        // Returns the Model class
        return Quote;

    }

);
