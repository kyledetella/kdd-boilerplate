define([
  'backbone',
  'app',

  // Views
  'modules/views/indexView'

], function(Backbone, app, IndexView) {

  var Router = Backbone.Router.extend({

    routes: {
      '' : 'index'
    },

    index: function() {      
      this.reset();
      this.currentView = new IndexView();
    },

    reset: function() {
      if(this.currentView) this.currentView.close();
    }

  });

  return Router;

});