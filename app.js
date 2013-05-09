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
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}


require('./routes/routes')(app) ;

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
