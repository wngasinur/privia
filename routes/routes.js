
/*
 * GET home page.
 */


module.exports = function (app) {

    var index = require('./index');
    app.get('/',index.index);

    var user = require('./userRoute');
    app.put('/user/:id',user.save);
    app.post('/user',user.save);

    app.put('/user/changePassword/:id',user.changePassword);

    app.get('/user/:id',user.get);

    app.get('/users',user.list);

    app.get('/users/search',user.search);


    app.post('/upload',index.upload);
	
	app.get('/thumbnail/:name',index.thumbnail);

    var karyawan = require('./karyawanRoute');

    app.post('/karyawan/save',karyawan.add);

    app.get('/karyawan',karyawan.list);

	var cabang = require('./cabangRoute');
    
    app.post('/cabang/add',cabang.add);

    app.get('/cabang',cabang.list);

}