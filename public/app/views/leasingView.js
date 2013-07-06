define([

  'jquery',
  'underscore',
  'backbone',
  'text!../../templates/karyawanList.html',
  'text!../../templates/leasingForm.html'
], function($, _, Backbone, leasingList,leasingForm){

  var HomeView = Backbone.View.extend({
    el: $('#container'),
    render: function(page){
      // Using Underscore we can compile our template with data
      var data = {};
      var template;
      if(page=='form')
        template=leasingForm;
      else
        template=leasingList;

      var compiledTemplate = _.template( template, data );
      // Append our compiled template to this Views "el"
      this.$el.html( template );
    }
  });
  // Our module now returns our view
  return  HomeView;
});