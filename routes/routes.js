
/*
 * GET home page.
 */


module.exports = function (app) {

    var index = require('./index');
    app.get('/',index.index);

    var user = require('./userRoute');
    app.all('/users/save',user.save);


    app.get('/users/get/:id',user.get);

    app.get('/users',user.list);

    app.get('/users/search',user.search);


    app.post('/upload',index.upload);
	
	app.get('/thumbnail/:name',index.thumbnail);

    var karyawan = require('./karyawanRoute');

    app.post('/karyawan/add',karyawan.add);

    app.get('/karyawan',karyawan.list);

	var cabang = require('./cabangRoute');
    
    app.post('/cabang/add',cabang.add);

    app.get('/cabang',cabang.list);

}