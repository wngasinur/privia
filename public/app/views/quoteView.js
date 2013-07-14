define([
    'jquery',
    'underscore',
    'backbone',
    'text!../templates/quoteList.html',
    'text!../templates/quoteForm.html',
    'text!../templates/quoteForm.html',
    '../models/quote'
], function($, _, Backbone, listTemplate,formTemplate,formEditTemplate,Model){

    var QuoteView = Backbone.View.extend({
        el: $('#container'),
        events: {
            "click .save"   : "save",
            "click .cancel"   : "cancel",
            "click #tambahCustomer"   : "tambahCustomer"
        },
        initialize:function(options){
            console.log('initialize quote view ');
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
                that.quoteForm.find('.save').button('reset');


            });
            this.listenTo(this.model,'sync', function(e) {
                console.log('sukses');
                this.model.set(new Model().toJSON() );
                that.render('form',function(){
                    var alertInfo = $('#alertInfo').clone();
                    $('span',alertInfo).html('Sukses menyimpan Proposal');
                    alertInfo.show().appendTo('.formMessage');
                    that.quoteForm.find('.save').button('reset');
                });

            });

        },
        save:function(e) {
            this.quoteForm = this.$el.find('#quoteForm');
            console.log(this.quoteForm.serializeObject());

            if(this.quoteForm.valid()) {
                this.model.set(this.quoteForm.serializeObject());
                this.quoteForm.find('.save').button('loading');
                this.model.save();
            }
        },
        tambahCustomer:function(e) {
            app.router.navigate('/customer/add',{trigger:true});
        },
        cancel:function() {
            app.router.navigate('/quote',{trigger:true});
        },
        render: function(page,cb){
            console.log('render quote view');
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
                var quote = new Model({id:id});
                quote.fetch({
                    success: function (quote) {
                        var data = quote.toJSON();
                        that.model.set (data);
                        var compiledTemplate = _.template( template, data );
                        that.$el.html( compiledTemplate );
                        that.quoteForm = that.$el.find('#quoteForm');
                    

                        if(cb) cb();

                    }
                });
            }
            else {
                console.log(this.model.toJSON());
                var compiledTemplate = _.template( template, this.model.toJSON() );
                // Append our compiled template to this Views "el"
                this.$el.html( compiledTemplate );

                this.quoteForm = this.$el.find('#quoteForm');
               // console.log(this.$el.find('#quoteForm'));


                if(cb) cb();
            }
        }
    });
    // Our module now returns our view
    return  QuoteView;
});