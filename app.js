/**
 * Module dependencies.
 */

 var express = require('express')
 , routes = require('./routes')
 , user = require('./routes/user')
 , http = require('http')
 , path = require('path');

 var hbs = require('express-hbs');

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

app.get('/', routes.index);
app.all('/login', routes.login);
app.get('/users', user.list);

app.get('/users/add', user.add);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
