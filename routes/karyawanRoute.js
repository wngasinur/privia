
/*
 * GET users listing.
 */
 var mongoose = require('mongoose'),
 moment = require('moment'),
 async = require('async'),
 util = require('../util'),
 $ = require('jquery'),
 Karyawan = mongoose.model('Karyawan'),
 User = mongoose.model('User'),
 Cabang = mongoose.model('Cabang')

 exports.search = function(req, res){

  var searchUsername = req.query.q;
  console.log(searchUsername);
  var criteria = {username:new RegExp(searchUsername, "i")};
  var select = {username:true};

  User.list({perPage:10,page:1,criteria:criteria,select:select},function(err,result){
    res.json(result);
  });

};
exports.get = function(req, res){

  var id = req.params.id;
  console.log(id);
  Karyawan.load(id,function(err,result){

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

        var conditions = util.queryConditions(req);
         var criteria = {}, criteriaKaryawan= {};
                if(conditions.length!=0) {
                    for(i=0;i<conditions.length;i++) {
                       if(conditions[i].col=='username.username')

                           $.extend(criteriaKaryawan, {$and:[{'username':{'$ne':null}},{'username':new RegExp(conditions[i].val, "i")}]});
                       else if(conditions[i].col=='nama')
                           $.extend(criteria,{'nama':new RegExp(conditions[i].val, "i")});
                        else if(conditions[i].col=='namaCabang')
                           $.extend(criteria,{'namaCabang':new RegExp(conditions[i].val, "i")});
                   }
               }
        console.log(criteria);
        var displayStart = req.query.iDisplayStart*1;
        var page = displayStart/perPage;
        Karyawan.list({perPage:perPage,page:page,criteria:criteria,criteriaKaryawan:criteriaKaryawan},function(err,result){
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

exports.save = function(req, res){


 console.log(req.body);
 var json = req.body;
 if(json.tglLahir!='')
   json.tglLahir = moment(json.tglLahir,'DD-MMM-YYYY').toDate();

 var karyawan = new Karyawan(json);

 var editKaryawan = json;

 if(karyawan._id) {

  delete editKaryawan._id;
  delete editKaryawan.__v;

  console.log('edit %j',editKaryawan);


 async.series({
      one: function(callback){
          var conditions = { username: karyawan.username };
      Karyawan.update(conditions,  { $set: { username:null}}, { multi: true },function(err,result){
    if(err)
      console.log(err);
    else
      console.log('result '+result);
       callback(null);

  });
       
      },
      two: function(callback){
  var conditions = { _id: karyawan._id }
  , update = editKaryawan
  , options = { multi: false };
     Karyawan.update(conditions, update, options, function(err,result){
    if(err)
      console.log(err);
    else
       callback(null);

  });

        callback(null);
      }
    },
    function(err, results) {
      res.json( { success: 'true' });
    // results is now equal to: {one: 1, two: 2}
  });
  

     /*// an example using an object instead of an array
     async.series({
      one: function(callback){
      
        callback(null);
      },
      two: function(callback){

   

        callback(null);
      }
    },
    function(err, results) {
    // results is now equal to: {one: 1, two: 2}
  });*/

if(json.oldUsername!='' && json.oldUsername!=json.username) {

 User.update({_id:json.oldUsername}, { $set: { status:'Aktif', karyawan:null,cabang:null}}, { upsert: false },function(err,result){});      
}

Cabang.load(json.cabang,function(err,cabang1){
  var cabang = null;
  if(!err) {
    cabang={_id:cabang1._id,kodeCabang:cabang1.kodeCabang,namaCabang:cabang1.namaCabang};
  }
  karyawan={_id:karyawan._id,imgProfile:karyawan.imgProfile,nama:karyawan.nama}
  User.update({_id:json.username}, { $set:   { status:'Aktif',cabang:cabang,karyawan:karyawan}  }, { upsert : true},function(err,result){});

}); 

}
else {
  console.log('add');
  delete json._id;
  json.status='Aktif';
  karyawan = new Karyawan(json);
  karyawan.save(function (err,karyawan) {

    if (err) {
      console.log(err)
      return res.json(500, err);
    }// saved!
    res.json( { success: 'true' });

Cabang.load(json.cabang,function(err,cabang1){
  var cabang = null;
  if(!err) {
    cabang={_id:cabang1._id,kodeCabang:cabang1.kodeCabang,namaCabang:cabang1.namaCabang};
  }
  karyawan={_id:karyawan._id,imgProfile:karyawan.imgProfile,nama:karyawan.nama}
  User.update({_id:json.username}, { $set:   { status:'Aktif',cabang:cabang,karyawan:karyawan}  }, { upsert : true},function(err,result){});

}); 

          });
}

};