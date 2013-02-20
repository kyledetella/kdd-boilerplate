define([
  'jquery',
  'underscore',
  'backbone'
],function($, _, Backbone) {

  var app = {
    util: {
      // Asynchronously load templates located in separate .html files
      // Pool those templates in the 'reservoir' for later lookup
      loadAndPoolTemplates: function(views,callback) {
        var reservoir = [];
        var deferreds = [];
        var _me = this;
        _.each(views, function(view){
            deferreds.push($.get('/templates/' + view.path + '.html'));
        },this);

        $.when.apply(null,deferreds).done(function(){
          var i = 0;
          var len = deferreds.length;
          for(i; i<len; i++){
            reservoir.push({
              name: views[i]['name'],
              template: !views[i]['compile'] ? deferreds[i]['responseText'] : Handlebars.compile(deferreds[i]['responseText'])
            });
          }
          _me.reservoir = reservoir;
          callback();
        });
      },
      lookupTemplate: function(key){
        var tmpl;
        _.each(this.reservoir,function(item,index){
          if(item.name === key) tmpl = item.template;
        },this);
        return tmpl;
      }
    },
  }

  

  return _.extend(app,Backbone.Events);
});
