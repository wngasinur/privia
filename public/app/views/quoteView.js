define([
    'jquery',
    'underscore',
    'backbone',
    'text!../templates/quoteList.html',
    'text!../templates/quoteForm.html',
    'text!../templates/quoteForm.html',
    'text!../templates/quotePrintSection.html',
    '../models/quote'
], function($, _, Backbone, listTemplate,formTemplate,formEditTemplate,print1SectionTemplate,Model){

    var QuoteView = Backbone.View.extend({
        el: $('#container'),
        events: {
            "click .save"   : "save",
            "click .print"   : "print",
            "click .cancel"   : "cancel",
            "click #tambahCustomer"   : "tambahCustomer",
            "change #lamaPinjaman": "updateSukuBunga"
        },
         print:function(){
            window.print();
         },
        updateSukuBunga:function(){
            var lamaPinjaman = this.$el.find('#lamaPinjaman').val()*1;
            var sukuBunga = 0;
            if(lamaPinjaman) {
                if(lamaPinjaman==1)
                    sukuBunga = this.sukuBunga.thn1;
                else if(lamaPinjaman==2)
                    sukuBunga = this.sukuBunga.thn2;
                else if(lamaPinjaman==3)
                    sukuBunga = this.sukuBunga.thn3;
                else if(lamaPinjaman==4)
                    sukuBunga = this.sukuBunga.thn4;
            console.log('update suku bunga '+ sukuBunga);
            if(this.$el.find('#kreditProtectionSection:visible'))
              this.$el.find('#kreditProtection').val((0.3*lamaPinjaman).toFixed(1));
            this.$el.find('#sukuBunga').val(sukuBunga);
            }
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
                if(!that.options.id)
                   this.model.set(new Model().toJSON());
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
                this.model.set('perusahaanKredit',that.perusahaanKredit);
                this.quoteForm.find('.save').button('loading');
                this.model.save();
            }
        },
        tambahCustomer:function(e) {

            app.router.addCustomerModal();
        },
        cancel:function() {
            app.router.navigate('/quote',{trigger:true});
        },
        calculateQuote:function(f) {
            var cashBack = $('#cashBackMask').inputmask('unmaskedvalue')*1;
            var carDepreciation = $('#carDepreciationMask').inputmask('unmaskedvalue')*1;
            var pengurangTerakhir = $('#pengurangTerakhirMask').inputmask('unmaskedvalue')*1;
            var provisi = $('#provisiMask').inputmask('unmaskedvalue')*1;
            var admInsurance = $('#admInsuranceMask').inputmask('unmaskedvalue')*1;
            var hargaOTR = $('#hargaOTRMask').inputmask('unmaskedvalue')*1;
                

            $('#cashBack').val(cashBack);
            $('#carDepreciation').val(carDepreciation);
            $('#pengurangTerakhir').val(pengurangTerakhir);
            $('#provisi').val(provisi);

            var loanPrincipal = 0;
            loanPrincipal = hargaOTR-(f.percentDP*1/100*hargaOTR)-loanPrincipal;
            var kreditProtection = 0;
            if(f.kreditProtection!=0) 
            kreditProtection = loanPrincipal * (f.kreditProtection*1/100);
            var bungaDibayar = (f.sukuBunga*1/100)*loanPrincipal*f.lamaPinjaman;
            var bungaAssDibayar = (f.asstTlo*1/100)*hargaOTR;
            var maxRevenue = loanPrincipal - pengurangTerakhir - carDepreciation;
            var totalMaxRevenue = maxRevenue + cashBack;
            var payPerMonth = (bungaDibayar + loanPrincipal) / (f.lamaPinjaman*12);
            var cashNCarry = totalMaxRevenue - admInsurance - bungaAssDibayar - provisi - payPerMonth - kreditProtection;
            $('#payPerMonth').val(payPerMonth);
            $('#cashNCarry').val(cashNCarry);

            var ext = {
                cashBack: cashBack.formatPrice(),
                carDepreciation: carDepreciation.formatPrice(),
                pengurangTerakhir: pengurangTerakhir.formatPrice(),
                provisi: provisi.formatPrice(),
                bungaDibayar: bungaDibayar.formatPrice(),
                bungaAssDibayar: bungaAssDibayar.formatPrice(),
                admInsurance : admInsurance.formatPrice(),  
                hargaOTR : hargaOTR.formatPrice(),
                maxRevenue : maxRevenue.formatPrice(),
                totalMaxRevenue : totalMaxRevenue.formatPrice(),
                loanPrincipal : loanPrincipal.formatPrice(),
                payPerMonth : payPerMonth.formatPrice(),
                cashNCarry : cashNCarry.formatPrice(),
                kreditProtection : kreditProtection.formatPrice()
            };
            return $.extend(f,ext);
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
                        that.initializeForm();

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
                that.initializeForm();

                if(cb) cb();
            }

            

          

    },
    initializeForm:function(){
        that=this;
        this.$el.find('#kodeCustomer').select2({  
            ajax: {
                url: "/api/customers/search",
                quietMillis: 100,
                data: function (term, page) { 
                    return {
                        q:term
                    }
                },
                results : function(data) {
                    return {
                        results : $.map(data, function(item) {
                            return {
                                id : item._id,
                                text : item.namaCustomer,
                                obj : item
                            };
                        })
                    };
                }
            },

            formatSelection:function(object,container) {
                //console.log(object.obj);
                if(typeof object.obj!=='undefined') {

                    $('#thumbnail-profile').attr('src',object.obj.imgProfile);
                    $('#imgProfile').val(object.obj.imgProfile);
                    $('#namaCustomer').val(object.obj.namaCustomer);
                    $('#quoteAlamat').html(_.template( $("#alamatSection").html(),object.obj.alamat));
                    $('#quoteTelepon').html(_.template( $("#teleponSection").html(),object.obj.telepon));
                    $('#alamat').val($('#quoteAlamat').html());
                    
                }
                return object.text;
            },
            initSelection: function(element, callback) {
                var id=$(element).val();
                if (id!=="") {
                    $.ajax("/api/customers/search?q="+id).done(function(data) { 
                        if(data.length!=0) {
                        data[0].id=data[0]._id;
                        data[0].text=data[0].namaCustomer;
                        data[0].obj=data[0];
                        var obj =data[0];
                        callback(obj); 
                        }
                    });

                }
            }
            });

          
          this.$el.find('#perusahaanKredit').select2({  
            ajax: {
                url: "/api/perusahaanKredit/search",
                quietMillis: 100,
                data: function (term, page) { 
                    return {
                        q:term
                    }
                },
                results : function(data) {
                    return {
                        results : $.map(data, function(item) {
                            return {
                                id : item._id,
                                text : item.inisial,
                                obj : item
                            };
                        })
                    };
                }
            },

            formatSelection:function(object,container) {
                //console.log(object.obj);
                if(typeof object.obj!=='undefined') {
/*
                    $('#thumbnail-profile').attr('src',object.obj.imgProfile);
                    $('#imgProfile').val(object.obj.imgProfile);
                    $('#namaCustomer').val(object.obj.namaCustomer);
                    $('#quoteAlamat').html(_.template( $("#alamatSection").html(),object.obj.alamat));
                    $('#quoteTelepon').html(_.template( $("#teleponSection").html(),object.obj.telepon));
                    $('#alamat').val($('#quoteAlamat').html());*/
                    console.log('format %j',object.obj);
                    that.sukuBunga = object.obj.sukuBunga;
                    that.perusahaanKredit = object.obj;
                    that.$el.find('#lamaPinjaman').trigger('change');
                    if(object.obj.kreditProtection) {
                        that.$el.find('#kreditProtectionSection').show();
                    }
                    else {
                        that.$el.find('#kreditProtection').val(0);
                        that.$el.find('#kreditProtectionSection').hide();
                    }

                }

                return object.text;
            },
            initSelection: function(element, callback) {
                var id=$(element).val();
                if (id!=="") {
                    $.ajax("/api/perusahaanKredit/search?q="+id).done(function(data) { 
                        if(data.length!=0) {
                        data[0].id=data[0]._id;
                        data[0].text=data[0].inisial;
                        data[0].obj=data[0];
                        var obj =data[0];
                        callback(obj); 
                        }
                    });

                }
            }
            });
        this.quoteForm.stepy({
            nextLabel:      'Forward <i class="icon-chevron-right icon-white"></i>',
            backLabel:      '<i class="icon-chevron-left"></i> Backward',
            block       : true,
            errorImage  : true,
            titleClick  : true,
            validate    : true,
            finish : function(){

                var cashBack = $('#cashBackMask').inputmask('unmaskedvalue');
                var carDepreciation = $('#carDepreciationMask').inputmask('unmaskedvalue');
                var pengurangTerakhir = $('#pengurangTerakhirMask').inputmask('unmaskedvalue');
                var provisi = $('#provisiMask').inputmask('unmaskedvalue');
                var admInsurance = $('#admInsuranceMask').inputmask('unmaskedvalue');
                var hargaOTR = $('#hargaOTRMask').inputmask('unmaskedvalue');
                
                $('#cashBack').val(cashBack);
                $('#carDepreciation').val(carDepreciation);
                $('#pengurangTerakhir').val(pengurangTerakhir);
                $('#provisi').val(provisi);
                $('#admInsurance').val(admInsurance);
                $('#hargaOTR').val(hargaOTR);
                return false;
            },
             next: function(index) {
                if(index==3) {
                  var formData = that.quoteForm.serializeObject();
                  formData = that.calculateQuote(formData);
                  var tglTambah = that.model.get('tglTambah');
                  if(!tglTambah)
                    tglTambah = new Date();

                  //console.log('perusahaan kredit %j',that.perusahaanKredit);
                  formData = $.extend(formData,{tglTambah:tglTambah,inisial:that.perusahaanKredit.inisial});
                
                  var quotePrint = _.template( print1SectionTemplate ,formData);
                  that.$el.find('#quotePrint').html(quotePrint);
                }
             }
        });

        this.$el.find('.stepy-titles').each(function(){
            $(this).children('li').each(function(index){
                var myIndex = index + 1
                $(this).append('<span class="stepNb">'+myIndex+'</span>');
            })
        });

        this.quoteForm.find('.numeric').inputmask("integer");

        this.quoteForm.find('.percentage').inputmask("decimal");
        this.quoteForm.find('.price').inputmask('Rp. 999.999.999.999', { numericInput: true });
    }
                      
    });
    // Our module now returns our view
    return  QuoteView;
});