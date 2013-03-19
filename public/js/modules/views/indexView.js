define([
  'jquery',
  'underscore',
  'backbone',
  'handlebars',

  'app'
],
function($, _, Backbone, Handlebars, app) {


  var tmpl = '<div class="row"><h1>Welcome to your app!</h1><p>{{message}}</p></div>';

  var IndexView = Backbone.View.extend({

    template: Handlebars.compile(tmpl),

    initialize: function() {
      this.render();
    },

    render: function() {
      app.$injectionPoint.html(this.template({message: 'I am generated in the indexView'}));
    }

  });

  return IndexView;

});