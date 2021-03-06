
/*
 * GET users listing.
 */
 var mongoose = require('mongoose'),
 async = require('async'),
 util = require('../util'),
 $ = require('jquery'),
 User = mongoose.model('User')

 exports.get = function(req, res){

  var id = req.params.id;
  console.log(id);
  User.load(id,function(err,result){
    console.log(result);
    res.json(result);
  });
};

exports.search = function(req, res){

  var searchUsername = req.query.q;
  console.log(searchUsername);

  if(searchUsername.length!=24)
    var objId = '99d92f8be2c2f8a842000003';
  else 
    var objId = searchUsername;

  var criteria = {$or:[{username:new RegExp(searchUsername, "i")},{_id:objId}]};
  

  var select = {_id:true,username:true};
  User.list({perPage:10,page:0,criteria:criteria,select:select},function(err,result){
    res.json(result);
  });

};


exports.changePassword = function(req, res){

  var id = req.params.id;
  var password = req.body.password;
  console.log(req.params);
  var conditions = { _id: id }
  , update = { password: password }
  , options = { multi: true };

  User.update(conditions, update, options, function(err,result){
    if(err)
      console.log(err);
  });



};

exports.list = function(req, res){


  if(req.xhr) {

    async.parallel({
      data: function(callback){
        var searchStr = req.query.sSearch;
        
        var perPage = req.query.iDisplayLength*1;
         var conditions = util.queryConditions(req);
        
         var criteria = {};
          if(conditions.length!=0) {
              for(i=0;i<conditions.length;i++) {
                 if(conditions[i].col=='username')
                    $.extend(criteria,{'username':new RegExp(conditions[i].val, "i")});
                 else if(conditions[i].col=='karyawan')
                     $.extend(criteria,{'karyawan.nama':new RegExp(conditions[i].val, "i")});
               
             }
         }
        console.log(criteria);
        var displayStart = req.query.iDisplayStart*1;
        var page = displayStart/perPage;
        User.list({perPage:perPage,page:page,criteria:criteria},function(err,result){
          callback(null, result);
        });

      }, iTotalRecords : function(callback){

        User.counts({},function(err,result){
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

 var user = new User(req.body);
 if(user._id) {
  console.log('edit %j',user);
  var conditions = { _id: user._id }
  , update = { akses: user.akses }
  , options = { multi: false };

  User.update(conditions, update, options, function(err,result){
    if(err)
      console.log(err);
    else
      res.json( { success: 'true' });

  });
}
else {
  console.log('add');
  delete req.body._id;
  user = new User(req.body);
  user.set('status','Aktif');
  user.save(function (err) {
    if (err) {
     console.log(err)
     return res.json(500, err);
		  }// saved!
		  res.json( { success: 'true' });

		});
}	

};