
/*
 * GET users listing.
 */
 var mongoose = require('mongoose'),
 User = mongoose.model('User')

 exports.list = function(req, res){
 	res.render('userList', { title: 'Express' });
 };

 exports.add = function(req, res){
 	if(req.method=='POST') {
 		console.log(req.body);
 		var user = new User(req.body);
 		user.save(function (err) {
		  if (err) {
		  	console.log(err)
		  	return res.json(500, err);
		  }// saved!
		  res.json( { success: 'true' });

		})	
 	}
 	else 
 		res.render('userForm', { success: 'Express' });
 };