
/*
 * GET quotes listing.
 */
 var mongoose = require('mongoose'),
 async = require('async'),
 util = require('../util'),
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
    console.log (req.query.sSearch_0+' '+req.query.mDataProp_0);
    var criteria = {'req.query.mDataProp_0':new RegExp(req.query.sSearch_0, "i")};
    var select = {namaCustomer:true,alamat:true,lamaPinjaman:true};
    Quote.list({perPage:10,page:0,criteria:criteria,select:select},function(err,result){
        res.json(result);
    });

};

exports.latest = function(req, res){


     var currentUser = req.session.currentUser;
     var criteria = {};
    if(!req.session.isAdmin)
        $.extend(criteria,{'cabang._id':currentUser.cabang._id});
    console.log(criteria+ ' '+req.session.isAdmin);       
    Quote.list({perPage:10,page:0,criteria:criteria},function(err,result){
     res.json(result);

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
                }
                var perPage = req.query.iDisplayLength*1;
                var conditions = util.queryConditions(req);
                var criteria = {};
                if(conditions.length!=0) {
                    for(i=0;i<conditions.length;i++) {
                       if(conditions[i].col=='cabang.namaCabang')
                           $.extend(criteria,{'cabang.namaCabang':new RegExp(conditions[i].val, "i")});
                       else if(conditions[i].col=='namaCustomer')
                           $.extend(criteria,{'namaCustomer':new RegExp(conditions[i].val, "i")});
                        else if(conditions[i].col=='ditambahOleh.nama')
                           $.extend(criteria,{'ditambahOleh.nama':new RegExp(conditions[i].val, "i")});
                   }
               }
                 if(!req.session.isAdmin)
                    $.extend(criteria,{'cabang._id':req.session.currentUser.cabang._id});
                    //var criteria = {namaCustomer:new RegExp(searchQuotename, 'i')};
                    console.log(criteria);
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
                //console.log(results);
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
    if(req.session.currentUser.cabang)
        quote.set('cabang',req.session.currentUser.cabang);
    quote.save(function (err) {
        if (err) {
            console.log(err)
            return res.json(500, err);
            }// saved!
            res.json( { success: 'true' });

        });
}

};