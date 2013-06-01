var schedule = require('node-schedule');
var date = new Date(2013, 11, 21, 5, 30, 0);

var j = schedule.scheduleJob('*/1 * * * *', function(){
    console.log('The answer to life, the universe, and everything!');
});