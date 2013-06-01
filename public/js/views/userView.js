define([
  'jquery',
  'underscore',
  'backbone',
  'text!../../templates/userList.html',
  'text!../../templates/userForm.html',
  '../models/user'
], function($, _, Backbone, userList,userForm,Model){

  var HomeView = Backbone.View.extend({
    el: $('#container'),
    render: function(page,id){
      var that = this;
      var data = {};
      var template;
      if(page=='form')
        template=userForm;
      else
        template=userList;

      if(id) {
      var user = new Model({id:id});
      user.fetch({
        success: function (user) {
            var data = user.toJSON();
            var compiledTemplate = _.template( template, data );
            that.$el.html( compiledTemplate );
        }
       });
      }
      else {

         var user = new Model();

      var compiledTemplate = _.template( template, user.toJSON() );
      // Append our compiled template to this Views "el"
      this.$el.html( compiledTemplate );
      }
    }
  });
  // Our module now returns our view
  return  HomeView;
});