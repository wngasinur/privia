
/*
 * GET home page.
 */


module.exports = function (app) {

    var index = require('./index');
    app.all('/',index.index);
    app.all('/home',index.index);

    app.all('/login',index.login);
     app.all('/logout',index.logout);

    var user = require('./userRoute');
    app.put('/api/user/:id',user.save);
    app.post('/api/user',user.save);
    app.put('/api/user/changePassword/:id',user.changePassword);
    app.get('/api/user/:id',user.get);
    app.all('/api/users',user.list);

    app.get('/api/users/search',user.search);


    app.post('/api/upload',index.upload);
	
	app.get('/thumbnail/:name',index.thumbnail);

    var karyawan = require('./karyawanRoute');
    app.post('/api/karyawan',karyawan.save);
    app.put('/api/karyawan/:id',karyawan.save);
    app.all('/api/karyawan',karyawan.list);
    app.get('/api/karyawan/:id',karyawan.get);


	var cabang = require('./cabangRoute');
     app.post('/api/cabang',cabang.save);
    app.put('/api/cabang/:id',cabang.save);
    app.get('/api/cabangs/search',cabang.search);
    app.all('/api/cabangs',cabang.list);
    app.get('/api/cabang/:id',cabang.get);

    app.put('/api/cabang/:id',cabang.save);
    app.post('/api/cabang',cabang.save);

    var customer = require('./customerRoute');

    app.all('/api/customers',customer.list);
    app.get('/api/customers/search',customer.search);
    app.get('/api/customer/:id',customer.get);

    app.put('/api/customer/:id',customer.save);
    app.post('/api/customer',customer.save);


    var quote = require('./quoteRoute');
    app.post('/api/quote',quote.save);
    app.put('/api/quote/:id',quote.save);
    app.all('/api/quotes',quote.list);
     app.all('/api/quotes/latest',quote.latest);
    app.get('/api/quotes/search',quote.search);
    app.get('/api/quote/:id',quote.get);

}