
/*
 * GET quotes listing.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    $ = require('jquery'),
    Quote = mongoose.model('Quote')

exports.get = function(req, res){

    var id = req.params.id;
    console.log(id);
    Quote.load(id,function(err,result){

        res.json(result);
    });
};

exports.search = function(req, res){

    var searchQuotename = req.query.q;
    console.log(searchQuotename);
    var criteria = {namaCustomer:new RegExp(searchQuotename, "i")};
    var select = {namaCustomer:true,alamat:true,lamaPinjaman:true};
    Quote.list({perPage:10,page:0,criteria:criteria,select:select},function(err,result){
        res.json(result);
    });

};

exports.latest = function(req, res){

   
    var currentUser = req.session.currentUser;
    currentUser.akses.contains('admin',function(found){
        if(!found)
             var criteria = {'ditambahOleh._id':currentUser.karyawan._id};
        else
            var criteria = {};
        Quote.list({perPage:10,page:0,criteria:criteria},function(err,result){
           res.json(result);
        });
    });
   

};

exports.list = function(req, res){

    if(req.xhr) {
        async.parallel({
                data: function(callback){
                    var searchStr = req.query.sSearch;
                    var searchQuotename ='';
                    if(searchStr) {
                        var sSearch = searchStr.split('|');
                        searchQuotename = sSearch[1];
                        console.log(sSearch);
                    }
                    var perPage = req.query.iDisplayLength*1;
                    var criteria = {namaCustomer:new RegExp(searchQuotename, 'i')};
                    var displayStart = req.query.iDisplayStart*1;
                    var page = displayStart/perPage;
                    Quote.list({perPage:perPage,page:page,criteria:criteria},function(err,result){
                        callback(null, result);
                    });

                }, iTotalRecords : function(callback){

                    Quote.counts({},function(err,result){
                        callback(null, result);
                    });


                }
            },
            function(err, results) {
                $.extend(results,{'iTotalDisplayRecords':results.iTotalRecords});
                console.log(results);
                res.json(results);
            });
    }


};

exports.save = function(req, res){
   
   var quote = new Quote(req.body);

   var editQuote = req.body;

   var currentUser = req.session.currentUser;

    if(quote._id) {

        delete editQuote._id;
        delete editQuote.__v;

        var conditions = { _id: quote._id }
            , update = editQuote
            , options = { multi: false };

     
        var diubahOleh = {
            nama : currentUser.karyawan.nama,
            imgProfile : currentUser.karyawan.imgProfile,
            _id : currentUser.karyawan._id
        }
        $.extend(update,{'diubahOleh':diubahOleh});

        console.log('edit %j',update);
        Quote.update(conditions, update, options, function(err,result){
            if(err)
                console.log(err);
            else
                res.json( { success: 'true' });

        });
    }
    else {
        console.log('add');
        delete req.body._id;
        quote = new Quote(req.body);
        var ditambahOleh = {
            nama : currentUser.karyawan.nama,
            imgProfile : currentUser.karyawan.imgProfile,
            _id : currentUser.karyawan._id
        }
        quote.set('ditambahOleh',ditambahOleh);

        quote.save(function (err) {
            if (err) {
                console.log(err)
                return res.json(500, err);
            }// saved!
            res.json( { success: 'true' });

        });
    }

};