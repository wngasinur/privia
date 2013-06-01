require.config({
  baseUrl: '/js',
  paths: {
    "dataTables" : "../lib/datatables/jquery.dataTables.min",
    "dataTables.sorting" :"../lib/datatables/jquery.dataTables.sorting",
    "dataTables.bootstrap" : "../lib/datatables/jquery.dataTables.bootstrap.min",
    "underscore" : "../lib/underscore",
    "backbone" :"../lib/backbone",
    "util" : "../util.nganterin",
    "bootstrap" : "../bootstrap/js/bootstrap.min",
    "jquery" : "jquery.min",
    "jquery.ui" : "../lib/jquery-ui/jquery-ui-1.10.0.custom.min",
    "jquery.validate" : "../lib/validation/jquery.validate.min",
    "antiscroll" : "../lib/antiscroll/antiscroll.min",
    "jquery.form" : "forms/jquery.form",
    "jquery.fineuploader" : "../lib/jquery.fineuploader-3.5.0.min",    
    "select2" : "../lib/select2.min",
    "stepy" : "../lib/stepy/js/jquery.stepy.min",
    "flot" : "../lib/flot/jquery.flot.min",
    "flot.categories" : "../lib/flot/jquery.flot.categories.min",    
    "flot.time" : "../lib/flot/jquery.flot.time.min",
    "flot.pie" : "../lib/flot/jquery.flot.pie.min",        
    "qtip2" : "../lib/qtip2/jquery.qtip.min",    
    "router" : "router.privia",
    "app" : "app.privia"
  },
  shim: {
    'backbone': {
      //These script dependencies should be loaded before loading
      //backbone.js
      deps: ['underscore', 'jquery'],
      //Once loaded, use the global 'Backbone' as the
      //module value.
      exports: 'Backbone'
    },
    'underscore': {
      exports: '_'
    },
    'antiscroll' : {
      deps : ['jquery']
    },
    'jquery.validate' : {
      deps : ['jquery']
    },
    'jquery.form' : {
      deps : ['jquery']
    },
    'jquery.ui' : {
      deps : ['jquery']
    },
    'dataTables': {
      exports: 'dataTable'
    },
    'dataTables.sorting' : {
      deps : ['dataTables']
    },
    'dataTables.bootstrap' : {
      deps : ['dataTables']
    },
    'bootstrap' : {
      deps : ['jquery']
    },
    'jquery.fineuploader' : {
      deps : ['jquery']
    },
    'select2' : {
      deps : ['jquery']
    },
    'stepy' : {
      deps : ['jquery']
    },
    'flot' : {
      deps : ['jquery']
    },
    'flot.categories' : {
      deps : ['flot']
    },
    'flot.time' : {
      deps : ['flot']
    },
    'flot.pie' : {
      deps : ['flot']
    },
    'qtip2' : {
      deps : ['jquery']
    }
  }
});

require([

'app','router','backbone','jquery.ui','jquery.validate','jquery.form','bootstrap',
'dataTables','dataTables.sorting','dataTables.bootstrap','antiscroll','jquery.fineuploader',
'select2','stepy','flot','flot.categories','flot.time','flot.pie','qtip2'], function(app,Router) {
 setTimeout('$("html").removeClass("js")',500);
 $('.antiScroll').antiscroll().data('antiscroll');

 app.router = new Router();
/* $(document).on("click", "a[data-parent]", function(evt) {
  var href = { prop: $(this).prop("href"), attr: $(this).attr("href") };
  var root = location.protocol + "//" + location.host + app.root;
  console.log('href'+href);
    evt.preventDefault();
  if (href.prop && href.prop.slice(0, root.length) === root) {
  
    Backbone.history.navigate(href.attr, true);
  }
});*/

  // Trigger the initial route and enable HTML5 History API support, set the
  // root folder to '/' by default. Change in app.js.
  Backbone.history.start();
 

});