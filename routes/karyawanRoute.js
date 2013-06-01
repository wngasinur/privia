
/*
 * GET users listing.
 */
 var mongoose = require('mongoose'),
 moment = require('moment'),
 async = require('async'),
 $ = require('jquery'),
 Karyawan = mongoose.model('Karyawan')

 exports.search = function(req, res){

  var searchUsername = req.query.q;
  console.log(searchUsername);
  var criteria = {username:new RegExp(searchUsername, "i")};
  var select = {username:true};

  User.list({perPage:10,page:1,criteria:criteria,select:select},function(err,result){
    res.json(result);
  });

};

exports.list = function(req, res){


  if(req.xhr) {

    async.parallel({
      data: function(callback){
        var searchStr = req.query.sSearch;
        var searchUsername ='';
        if(searchStr) {
          var sSearch = searchStr.split('|');
          searchUsername = sSearch[1];
          console.log(sSearch);
        }
        var perPage = req.query.iDisplayLength*1;
        var criteria = {username:new RegExp(searchUsername, 'i')};
        console.log(searchUsername);
        var displayStart = req.query.iDisplayStart*1;
        var page = displayStart/perPage;
        console.log(page+' '+perPage)
        Karyawan.list({perPage:perPage,page:page,criteria:criteria},function(err,result){
          callback(null, result);
        });

      }, iTotalRecords : function(callback){

        Karyawan.counts({},function(err,result){
         callback(null, result);
       });


      }
    },
    function(err, results) {
     $.extend(results,{'iTotalDisplayRecords':results.iTotalRecords});
     res.json(results);
                // results is now equal to: {one: 1, two: 2}
              });

}


};

exports.add = function(req, res){
  
 var json = req.body;
 console.log(json.tglLahir+'aaa');
 json.tglLahir = moment(json.tglLahir,'MM-DD-YYYY');
 console.log(json);
 var karyawan = new Karyawan(json);
 karyawan.save(function (err) {
  if (err) {
   console.log(err)
   return res.json(500, err);
		  }// saved!
		  res.json( { success: 'true' });

		})	
 
};