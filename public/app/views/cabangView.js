define([
  'jquery',
  'underscore',
  'backbone',
  'text!../templates/cabangList.html',
  'text!../templates/cabangForm.html'
], function($, _, Backbone, cabangList,cabangForm){

  var HomeView = Backbone.View.extend({
    el: $('#container'),
    render: function(page){
      // Using Underscore we can compile our template with data
      var data = {};
      var template;
      if(page=='form')
        template=cabangForm;
      else
        template=cabangList;

      var compiledTemplate = _.template( template, data );
      // Append our compiled template to this Views "el"
      this.$el.html( template );
    }
  });
  // Our module now returns our view
  return  HomeView;
});