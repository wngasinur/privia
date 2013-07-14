
/*
 * GET home page.
 */
 var mongoose = require('mongoose'),
 fs = require('fs')
 , User = mongoose.model('User')
 , Karyawan = mongoose.model('Karyawan')


 exports.index = function(req, res){

  res.render('index', { title: 'Express' });
};

 exports.logout = function(req, res){
  req.session.currentUser=null;
  res.redirect('/login');
};


exports.upload = function(req, res){
  //app.set('layout', 'layoutx') ;
  console.log('%j',req.files);
  fs.readFile(req.files.qqfile.path, function (err, data) {

    var fileName = new Date().getTime()+req.files.qqfile.name;
    var newPath = __dirname + "/../uploads/"+fileName;
    console.log('writing to '+newPath);
    fs.writeFile(newPath, data, function (err) {
      res.set({
        'Content-Type': 'text/plain'
      });
      res.json({ success: 'true' ,path : '/thumbnail/'+fileName});
    });
  });

  
};


exports.thumbnail = function(req, res){
  //app.set('layout', 'layoutx') ;
  console.log('%j',req.params.name);
  var options =  {root:__dirname + "/../uploads/"};

  res.sendfile(req.params.name,options);
};

exports.login = function(req, res){
  if(req.xhr) {
    var username = req.body.username;
    var password = req.body.password;


    console.log('Login '+req.body.username);
    var criteria = {$and:[{'username':username},{'password':password}]};
    
    User.list({perPage:10,page:0,criteria:criteria},function(err,result){
      if(err)
      {
        res.json('403',{'error':'invalid username/password'});
        console.log(err);
      }
      else{
        //console.log(result);

        if(result.length==1)
        {
          var user = result[0];
          if(user.akses==null || user.akses.length==0) {
            res.json('403',{'error':'akses'});
            return;
          }
          else if(user.status!='Aktif'){
            res.json('403',{'error':'status'});
            return;
          }

          delete user.password;
          req.session.currentUser = user;
          res.json({success:true});
         
        }
        else
        {
          res.json('403',{'error':'password'});
        }
      }
    });
  }
  else 
    res.render('login', { title: 'Login Page' , layout:'/layouts/plain'});
};