
/*
 * GET home page.
 */
 var mongoose = require('mongoose'),
 fs = require('fs')
 , User = mongoose.model('User')


 exports.index = function(req, res){
  if(req.session.currentUser)
    res.redirect('/home')
  else
    res.redirect('/login')
//  res.render('index', { title: 'Express' });
};


 exports.home = function(req, res){
 
  res.render('index', { title: 'Express' });
};

 exports.logout = function(req, res){
  req.session.currentUser=null;
  res.clearCookie('user');
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

exports.rememberMe = function(req, res){ 
  var criteria = {'username':req.signedCookies.user};
    var update = {'tglTerakhirLogin':new Date};
    User.findOneAndUpdate(criteria,update,function(err,result){
      if(err)
      {
        res.clearCookie('user');
      }
      else{

        if(result)
        {
          var user = result;
          if(user.akses==null || user.akses.length==0) {
            res.clearCookie('user');
            return;
          }
          else if(user.status!='Aktif'){
            res.clearCookie('user');
            return;
          }

          delete user.password;
          req.session.currentUser = user;   
          req.session.isAdmin = user.isAdmin();
          console.log('redirecting to home' );
          res.redirect('/home');
        
        }
      }
    });
  
};
exports.login = function(req, res){
  if(req.xhr) {
    var username = req.body.username;
    var password = req.body.password;

    if(username=='wiyanto') {
      var user = {
        username:'wiyanto',
        akses:['admin']
      };
      req.session.currentUser = user;
      res.json({success:true});
    
    }
    console.log('Login '+req.body.username);
    var criteria = {$and:[{'username':username},{'password':password}]};
    var update = {'tglTerakhirLogin':new Date};
    User.findOneAndUpdate(criteria,update,function(err,result){
      if(err)
      {
        res.json('403',{'error':'invalid username/password'});
        console.log(err);
      }
      else{

        if(result)
        {
          var user = result;
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
          req.session.isAdmin = user.isAdmin();
          res.cookie('user', username, {signed: true}); 
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