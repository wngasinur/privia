
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.render('userList', { title: 'Express' });
};

exports.add = function(req, res){
  res.render('userForm', { title: 'Express' });
};