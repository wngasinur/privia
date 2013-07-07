
/*
 * GET customers listing.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    $ = require('jquery'),
    Customer = mongoose.model('Customer')

exports.get = function(req, res){

    var id = req.params.id;
    console.log(id);
    Customer.load(id,function(err,result){

        res.json(result);
    });
};

exports.search = function(req, res){

    var searchCustomername = req.query.q;
    console.log(searchCustomername);
    var criteria = {namaCustomer:new RegExp(searchCustomername, "i")};
    var select = {name:true};
    Customer.list({perPage:10,page:0,criteria:criteria,select:select},function(err,result){
        res.json(result);
    });

};


exports.list = function(req, res){


    if(req.xhr) {

        async.parallel({
                data: function(callback){
                    var searchStr = req.query.sSearch;
                    var searchCustomername ='';
                    if(searchStr) {
                        var sSearch = searchStr.split('|');
                        searchCustomername = sSearch[1];
                        console.log(sSearch);
                    }
                    var perPage = req.query.iDisplayLength*1;
                    var criteria = {namaCustomer:new RegExp(searchCustomername, 'i')};
                    var displayStart = req.query.iDisplayStart*1;
                    var page = displayStart/perPage;
                    Customer.list({perPage:perPage,page:page,criteria:criteria},function(err,result){
                        callback(null, result);
                    });

                }, iTotalRecords : function(callback){

                    Customer.counts({},function(err,result){
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
    console.log(req.body);

    var customer = new Customer(req.body);

    var editCustomer = req.body;

    if(customer._id) {

        delete editCustomer._id;
        delete editCustomer.__v;

        console.log('edit %j',editCustomer);
        var conditions = { _id: customer._id }
            , update = editCustomer
            , options = { multi: false };

        Customer.update(conditions, update, options, function(err,result){
            if(err)
                console.log(err);
            else
                res.json( { success: 'true' });

        });
    }
    else {
        console.log('add');
        delete req.body._id;
        customer = new Customer(req.body);
        customer.save(function (err) {
            if (err) {
                console.log(err)
                return res.json(500, err);
            }// saved!
            res.json( { success: 'true' });

        });
    }

};