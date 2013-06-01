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

  return _.extend(app,{});

});