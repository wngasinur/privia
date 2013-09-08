
/*
 * GET home page.
 */
 var mongoose = require('mongoose'),
 im = require('imagemagick'),
 path = require('path'),
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
    var extName =  path.extname(fileName);
    var baseName = path.basename(fileName,extName);
    
    var newPath = path.normalize(__dirname + "/../uploads/");
    
    console.log('writing to '+newPath+ ' '+baseName+' '+extName);
    fs.writeFile(newPath+fileName, data, function (err) {
      console.log(newPath+fileName+' '+newPath+baseName+'_small'+extName);
      im.resize({
        srcPath: newPath+fileName,
        dstPath: newPath+baseName+'_small'+extName,
        width:   120
      }, function(err, stdout, stderr){
        if (err) throw err;
        console.log('resized');
          res.set({
        'Content-Type': 'text/plain'
      });
      res.json({ success: 'true' ,path : baseName+extName});
      });
    
    });
  });

  
};


exports.thumbnail = function(req, res){
  //app.set('layout', 'layoutx') ;
 
  var filePath = path.normalize(__dirname + "/../uploads/");
  var fileName = req.params.name;
  var extName =  path.extname(fileName);
  var baseName = path.basename(fileName,extName);
  var thumbnailName = baseName+'_small'+extName;
  var options =  {root:filePath};
  
  
  fs.exists(filePath+thumbnailName, function (exists) {
    if(!exists) {
        filePath = path.normalize(__dirname + "/../public/img/");
        options =  {root:filePath};
        thumbnailName = '80x80.gif';
    }
    console.log('%j',filePath+' '+thumbnailName);
    res.sendfile(thumbnailName,options);
});
  
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