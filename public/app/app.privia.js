define([ 'jquery',
  'underscore',
  'backbone'], function($, _, Backbone) {
  console.log('Initialize App'); 
  
  // Provide a global location to place configuration settings and module
  // creation.
  var app = {
  // The root path to run the application.
   root: '/'
  };
  var compiledTemplate = _.template( $('#sidebarsMenuSection').html(), {'akses':arrAkses} );
  $('#sidebarsMenu').html(compiledTemplate);


  Number.prototype.formatPrice = function() {
      var p = this.toFixed(2).split(".");
      return "Rp. " + p[0].split("").reverse().reduce(function(acc, num, i, orig) {
          return  num + (i && !(i % 3) ? "," : "") + acc;
      }, "") ;
     // return this+"".replace(/(\d)(?=(\d{3})+)/g, "$1,");
  };

  return _.extend(app,{});

});