
/*
 * GET users listing.
 */
 var mongoose = require('mongoose'),
 async = require('async'),
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
            var displayStart = req.query.iDisplayStart*1;
            var page = displayStart/perPage;
            User.list({perPage:perPage,page:page,criteria:criteria},function(err,result){
                console.log('a'+result);
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
   console.log(results);
   res.json(results);
                // results is now equal to: {one: 1, two: 2}
            });

}


};

exports.save = function(req, res){
     console.log(req.body);

     var user = new User(req.body);
     if(user._id) {
        console.log('edit');
     }
     else {
        console.log('add');
        delete req.body._id;
        user = new User(req.body);
     user.save(function (err) {
        if (err) {
           console.log(err)
           return res.json(500, err);
		  }// saved!
		  res.json( { success: 'true' });

		})
    }	
 
};