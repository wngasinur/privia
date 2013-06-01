
/*
 * GET users listing.
 */
 var mongoose = require('mongoose'),
 moment = require('moment'),
 async = require('async'),
 $ = require('jquery'),
 Cabang = mongoose.model('Cabang')

 exports.search = function(req, res){

  var searchCabang = req.query.q;
  console.log(searchCabang);
  var criteria = {kodeCabang:new RegExp(searchCabang, "i")};
  var select = {kodeCabang:true,namaCabang:true};

  User.list({perPage:10,page:1,criteria:criteria,select:select},function(err,result){
    res.json(result);
  });

};

exports.list = function(req, res){


  if(req.xhr) {

    async.parallel({
      data: function(callback){
        var searchStr = req.query.sSearch;
        var searchCabang ='';
        if(searchStr) {
          var sSearch = searchStr.split('|');
          searchCabang = sSearch[1];
        }
        var perPage = req.query.iDisplayLength*1;
        var criteria = {kodeCabang:new RegExp(searchCabang, 'i')};
        var displayStart = req.query.iDisplayStart*1;
        var page = displayStart/perPage;
        Cabang.list({perPage:perPage,page:page,criteria:criteria},function(err,result){
          callback(null, result);
        });

      }, iTotalRecords : function(callback){

        Cabang.counts({},function(err,result){
         callback(null, result);
       });


      }
    },
    function(err, results) {

     $.extend(results,{'iTotalDisplayRecords':results.iTotalRecords});
     res.json(results);

   });

  }


};

exports.add = function(req, res){

 var json = req.body;
 var cabang = new Cabang(json);
 cabang.save(function (err) {
  if (err) {
   return res.json(500, err);
	}// saved!
	
  res.json( { success: 'true' });

	})	
 
};