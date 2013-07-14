
/*
 * GET cabangs listing.
 */
 var mongoose = require('mongoose'),
 moment = require('moment'),
 async = require('async'),
 $ = require('jquery'),
 Cabang = mongoose.model('Cabang')

exports.get = function(req, res){

    var id = req.params.id;
    console.log(id);
    Cabang.load(id,function(err,result){

        res.json(result);
    });
};

 exports.search = function(req, res){

  var searchCabang = req.query.q;
  if(searchCabang.length!=24)
      var objId = '99d92f8be2c2f8a842000003';
  else 
      var objId = searchCabang;

  var criteria = {$or:[{kodeCabang:new RegExp(searchCabang, "i")},{_id:objId}]};
  

  Cabang.list({perPage:10,page:0,criteria:criteria},function(err,result){
    console.log(result);
        if(err)
            console.log(err);
        else
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

exports.save = function(req, res){

 console.log(req.body);

 var cabang = new Cabang(req.body);
 if(cabang._id) {
  console.log('edit %j',cabang);
  var conditions = { _id: cabang._id }
  , update = { akses: cabang.akses }
  , options = { multi: false };

  Cabang.update(conditions, update, options, function(err,result){
    if(err)
      console.log(err);
    else
      res.json( { success: 'true' });

  });
}
else {
  console.log('add');
  delete req.body._id;
  cabang = new Cabang(req.body);
  cabang.set('status','Aktif');
  cabang.save(function (err) {
    if (err) {
     console.log(err)
     return res.json(500, err);
      }// saved!
      res.json( { success: 'true' });

    });
} 
 
};