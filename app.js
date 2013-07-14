/**
 * Module dependencies.
 */

 var express = require('express')
 , http = require('http')
 , path = require('path')
  , fs = require('fs')
 , config = require('./config')['development'];

 var hbs = require('express-hbs');

 var mongoose = require('mongoose');

 mongoose.connect(config.db)

var models_path = __dirname + '/models'
fs.readdirSync(models_path).forEach(function (file) {
  require(models_path+'/'+file)
})


 var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');


app.engine('hbs', hbs.express3({

    defaultLayout: __dirname + '/views/layouts/default.hbs',
	partialsDir: __dirname + '/views/partials' }));
app.set('view engine', 'hbs');
app.set('layout', 'layouts') ;
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: 'secret'}));
app.use(express.methodOverride());
app.use(function(req, res, next){
if (req.session && req.session.currentUser) {
  var currentUser = req.session.currentUser;
  if(currentUser.karyawan && currentUser.karyawan.nama)
    res.locals.currentNama = currentUser.karyawan.nama;
  else
    res.locals.currentNama = currentUser.username;
 
  res.locals.currentUser = req.session.currentUser;
}
  next();
});
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.all('/api/*', restrict);
app.all('/home', restrict);

function restrict(req, res, next) {
  var restrictedPaths = ['/api/*','/home']	;
  for(var path in restrictedPaths) {
  	var re = new RegExp(restrictedPaths[path]);
  	//console.log(allowedPaths[path]+' '+re.exec(req.path)+' '+req.path);
  	if(re.exec(req.path)!=null)
  	{
      /*next();
      return;*/
  		 if (req.session && req.session.currentUser) {
          next();
        } else {
          if(req.xhr) {
              res.json(403,{'error':'no valid session'});
          }
          else 
          {
            req.session.error = 'Access denied!';
            res.redirect('/login');
          }  
          //
          //
        }
  	}
  }

 
}

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}


require('./routes/routes')(app) ;

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

Array.prototype.contains = function(k, callback) {
    var self = this;
    return (function check(i) {
        if (i >= self.length) {
            return callback(false);
        }

        if (self[i] === k) {
            return callback(true);
        }

        return process.nextTick(check.bind(null, i+1));
    }(0));
}
