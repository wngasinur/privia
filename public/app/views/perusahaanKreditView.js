define([
    'jquery',
    'underscore',
    'backbone',
    'text!../templates/perusahaanKreditList.html',
    'text!../templates/perusahaanKreditForm.html',
    'text!../templates/perusahaanKreditForm.html',
    '../models/perusahaanKredit'
], function($, _, Backbone, listTemplate,formTemplate,formEditTemplate,Model){

    var PerusahaanKreditView = Backbone.View.extend({
        el: $('#container'),
        events: {
            "click .save"   : "save",
            "click .cancel"   : "cancel"
        },
        initialize:function(options){
            console.log('initialize perusahaanKredit view ');
            this.$el.undelegate();

            var that = this;
            this.model = new Model();

            this.listenTo(this.model,'error', function(model,e) {
                var err;
                try {
                    var response = JSON.parse(e.responseText);
                    err = response.err;
                }catch(ex) {
                    err =  e.responseText;
                }
                var alertError = $('#alertError').clone();
                $('span',alertError).html('Terjadi masalah : '+err);
                alertError.show().appendTo('.formMessage');
                that.perusahaanKreditForm.find('.save').button('reset');

            });
            this.listenTo(this.model,'sync', function(e) {
                if(!that.options.id)
                   this.model.set(new Model().toJSON());
                that.render('form',function(){
                    var alertInfo = $('#alertInfo').clone();
                    $('span',alertInfo).html('Sukses menyimpan Perusahaan Kredit');
                    alertInfo.show().appendTo('.formMessage');
                    that.perusahaanKreditForm.find('.save').button('reset');
                });

            });

        },
        initializeForm:function(){

        },
        save:function() {
            this.perusahaanKreditForm = this.$el.find('#perusahaanKreditForm');
            //console.log(this.userForm.serializeObject());
            if(this.perusahaanKreditForm.valid()) {
                this.model.set(this.perusahaanKreditForm.serializeObject());
                this.perusahaanKreditForm.find('.save').button('loading');
                this.model.save();
            }
        },
        cancel:function() {
            app.router.navigate('perusahaanKredit',true);
        },
        render: function(page,cb){
            console.log('render perusahaanKredit view');
            var that = this;
            var id = this.options.id;
            var data = {};
            var template;

            if(page=='form') {
                template=formTemplate;
            }
            else
                template=listTemplate;

            if(id) {
                template=formEditTemplate;

                console.log('load '+id);
                var perusahaanKredit = new Model({id:id});
                perusahaanKredit.fetch({
                    success: function (perusahaanKredit) {
                        var data = perusahaanKredit.toJSON();
                        that.model.set (data);
                        var compiledTemplate = _.template( template, data );
                        that.$el.html( compiledTemplate );
                        that.perusahaanKreditForm = that.$el.find('#perusahaanKreditForm');

                        if(cb) cb();

                    }
                });
            }
            else {
                console.log(this.model.toJSON());
                var compiledTemplate = _.template( template, this.model.toJSON() );
                // Append our compiled template to this Views "el"
                this.$el.html( compiledTemplate );

                this.perusahaanKreditForm = this.$el.find('#perusahaanKreditForm');

                this.perusahaanKreditForm.validate({
                    onkeyup: false,
                    errorClass: 'error',
                    validClass: 'valid',
                    highlight: function(element) {
                        $(element).closest('div').addClass("f_error");
                    },
                    unhighlight: function(element) {
                        $(element).closest('div').removeClass("f_error");
                    },
                    errorPlacement: function(error, element) {
                        $(element).closest('div').append(error);
                    },
                    rules: {
                        namaPerusahaanKredit: "required",
                        inisial : "required",
                        "sukuBunga[thn1]":"required",
                        "sukuBunga[thn2]":"required",
                        "sukuBunga[thn3]":"required",
                        "sukuBunga[thn4]":"required"
                    },
                    messages: {

                    }
                });

                if(cb) cb();
            }
        }
    });
    // Our module now returns our view
    return  PerusahaanKreditView;
});