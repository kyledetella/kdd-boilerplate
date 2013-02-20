requirejs.config({
  paths: {
    'jquery' : 'vendor/jquery-1.9.1.min',
    'underscore' : 'vendor/lodash',
    'backbone' : 'vendor/backbone',
    'handlebars' : 'vendor/handlebars'
  },
  shim: {
    'backbone' : {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'underscore' : {
      exports: '_'
    },
    'handlebars' : {
      exports: 'Handlebars'
    }
  }
});

require([
  'app',
  'handlebars',
  'router'

], function(app, Handlebars, Router) {
  // Run this through a configure() in app.js for more dynamic injection
  app.$injectionPoint = $('#app');

  app.router = new Router();
  Backbone.history.start();

});