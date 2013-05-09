
/*
 * GET home page.
 */
var mongoose = require('mongoose')
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

exports.login = function(req, res){
  res.render('login', { title: 'Express' });
};