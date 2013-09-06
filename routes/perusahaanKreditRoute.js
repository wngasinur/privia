
/*
 * GET perusahaanKredits listing.
 */
 var mongoose = require('mongoose'),
 moment = require('moment'),
 async = require('async'),
 $ = require('jquery'),
 PerusahaanKredit = mongoose.model('PerusahaanKredit')

exports.get = function(req, res){

    var id = req.params.id;
    console.log(id);
    PerusahaanKredit.load(id,function(err,result){

        res.json(result);
    });
};

 exports.search = function(req, res){

  var searchPerusahaanKredit = req.query.q;
  if(searchPerusahaanKredit.length!=24)
      var objId = '99d92f8be2c2f8a842000003';
  else 
      var objId = searchPerusahaanKredit;

  var criteria = {$or:[{inisial:new RegExp(searchPerusahaanKredit, "i")},{_id:objId}]};
  

  PerusahaanKredit.list({perPage:10,page:0,criteria:criteria},function(err,result){
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
        var searchPerusahaanKredit ='';
        if(searchStr) {
          var sSearch = searchStr.split('|');
          searchPerusahaanKredit = sSearch[1];
        }
        var perPage = req.query.iDisplayLength*1;
        var criteria = {inisial:new RegExp(searchPerusahaanKredit, 'i')};
        var displayStart = req.query.iDisplayStart*1;
        var page = displayStart/perPage;
        PerusahaanKredit.list({perPage:perPage,page:page,criteria:criteria},function(err,result){
          callback(null, result);
        });

      }, iTotalRecords : function(callback){

        PerusahaanKredit.counts({},function(err,result){
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

 var perusahaanKredit = new PerusahaanKredit(req.body);
 if(perusahaanKredit._id) {
  var editPerusahaanKredit = req.body;

  delete editPerusahaanKredit._id;
  delete editPerusahaanKredit.__v;

  console.log('edit %j',editPerusahaanKredit);
        var conditions = { _id: perusahaanKredit._id }
            , update = editPerusahaanKredit
            , options = { multi: false };

  PerusahaanKredit.update(conditions, update, options, function(err,result){
    if(err)
      console.log(err);
    else
      res.json( { success: 'true' });

  });
}
else {
  console.log('add');
  delete req.body._id;
  perusahaanKredit = new PerusahaanKredit(req.body);
  //perusahaanKredit.set('status','Aktif');
  perusahaanKredit.save(function (err) {
    if (err) {
     console.log(err)
     return res.json(500, err);
      }// saved!
      res.json( { success: 'true' });

    });
} 
 
};