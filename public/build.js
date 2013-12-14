({
    baseUrl: './app',
    out: './makarel.js',
    optimizeCss: 'standard',
  
    name: 'main.privia',
    removeCombined: true,
    paths: {
        "dataTables" : "../lib/datatables/jquery.dataTables.min",
        "dataTables.sorting" :"../lib/datatables/jquery.dataTables.sorting",
        "dataTables.bootstrap" : "../lib/datatables/jquery.dataTables.bootstrap.min",
        "underscore" : "../lib/underscore",
        "backbone" :"../lib/backbone-min",
        "backbone.syphon" :"../lib/backbone.syphon",
        "util" : "../util.nganterin",
        "bootstrap" : "../bootstrap/js/bootstrap.min",
        "jquery" : "../js/jquery.min",
        "jquery.ui" : "../lib/jquery-ui/jquery-ui-1.10.2.custom.min",
        "jquery.inputmask" : "../js/forms/jquery.inputmask.min",
        "jquery.validate" : "../lib/validation/jquery.validate.min",    
        "jquery.serializeObject" : "../js/jquery.serializeObject",
        "antiscroll" : "../lib/antiscroll/antiscroll.min",
        "jquery.form" : "../js/forms/jquery.form",
        "jquery.actual" : "../js/jquery.actual.min",
        "jquery.fineuploader" : "../lib/jquery.fineuploader-3.5.0.min",    
        "select2" : "../lib/select2.min",
        "stepy" : "../lib/stepy/js/jquery.stepy.min",
        "flot" : "../lib/flot/jquery.flot.min",
        "flot.categories" : "../lib/flot/jquery.flot.categories.min",
        "flot.time" : "../lib/flot/jquery.flot.time.min",
        "flot.pie" : "../lib/flot/jquery.flot.pie.min",        
        "qtip2" : "../lib/qtip2/jquery.qtip.min",
        "text" : "../js/text",
        "gebo_common" : "../js/gebo_common",
        "moment" : "../lib/moment_js/moment.min",
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
     'gebo_common' : {
      deps : ['jquery','jquery.actual']
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
    'jquery.actual' : {
      deps : ['jquery']
    },
    'jquery.inputmask' : {
      deps : ['jquery']
    },
    'jquery.ui' : {
      deps : ['jquery']
    },
    'jquery.serializeObject' : {
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
    },
    'backbone.syphon' : {
      deps : ['backbone']
    }
    }
})