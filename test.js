/**
 * Created with JetBrains WebStorm.
 * User: lala
 * Date: 5/5/13
 * Time: 12:04 PM
 * To change this template use File | Settings | File Templates.
 */

jQuery = require('jquery');
require('node.io').scrape(function() {
    this.getHtml('http://www.rumah.com/property-jual/2?&sort=date&order=desc', function(err, $) {
        var stories = [];
        //console.log('length '+ $('.listing_item').length);
        $('#listinglist .listing_item').each(function(record) {

            var jRecord = jQuery(record.innerHTML);
            var title= jQuery('.infotitle',jRecord).text();
            var jns = jQuery('.info1 div:eq(0)',jRecord).text();
            //console.log(jns);
            if(jns.indexOf('Tanah')!== -1) {
                jns='Tanah';
            }
            else if (jns.indexOf('Rumah')!== -1) {
                jns='Rumah';

            }
            else {
                jns='Alien';
            }
            var id = jQuery('.info1 .left10 b',jRecord).text();

            console.log(title);
            console.log(jns);
            console.log(id);

            /*$('img',title).each(function(img){
                //console.log('img '+img);
            });*/
            //console.log($('img',title));
            //stories.push($('.infotitle a',title).text);
        });


        //this.emit(stories);
    });
});