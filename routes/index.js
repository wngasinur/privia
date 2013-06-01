
/*
 * GET home page.
 */
var mongoose = require('mongoose'),
  fs = require('fs')
  , Properti = mongoose.model('Properti')

exports.index = function(req, res){
	//app.set('layout', 'layoutx') ;
  console.log('test');
  var properti = new Properti({"tipe":"Rumah","harga":100});
  properti.save(function(err) {
  	if(err) {
  		console.log(err.errors);
  	}
  });
  res.render('index', { title: 'Express' });
};


exports.upload = function(req, res){
  //app.set('layout', 'layoutx') ;
  console.log('%j',req.files);
  fs.readFile(req.files.qqfile.path, function (err, data) {

  var fileName = new Date().getTime()+req.files.qqfile.name;
  var newPath = __dirname + "/../uploads/"+fileName;
  console.log('writing to '+newPath);
  fs.writeFile(newPath, data, function (err) {
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
  res.render('login', { title: 'Express' });
};