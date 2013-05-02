var semver = require('semver'),
    f = require('util').format;


module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    version: grunt.file.readJSON('package.json').version,

    banner: [
      '/*!',
      ' * kdd boilerplate <%= version %>',
      ' * https://github.com/kyledetella/kdd-boilerplate',
      ' */\n\n'
    ].join('\n'),

    requirejs: {
      compile: {
        options: {
          baseUrl: "public/js",
          name: 'main',
          mainConfigFile: "public/js/main.js",
          out: "public/dist/js/app.min.js"
        }
      }
    },

    sed: {
      version: {
        pattern: '%VERSION%',
        replacement: '<%= version %>',
        path: ['<%= requirejs.compile.options.out %>']
      }
    },


    exec: {
      git_add: {
        cmd: 'git add .'
      },

      git_add_u: {
        cmd: 'git add -u'
      },

      git_commit: {
        cmd: function(m) { return f('git commit -m "%s"', m); }
      },

      git_push: {
        cmd: 'git push origin deploys'
      }
    },


    clean: {
      dist: 'dist'
    }

  });


  //
  // Register Grunt Tasks
  //
  grunt.registerTask('release', 'Ship it.', function(version) {

    var curVersion = grunt.config.get('version');
    version = semver.inc(curVersion, 'minor') || 'minor';

    if (!semver.valid(version) || semver.lte(version, curVersion)) {
      grunt.fatal('invalid version dummy');
    }

    grunt.config.set('version', version);

    grunt.task.run([
      'clean',
      'requirejs',
      'exec:git_add',
      'exec:git_commit',
      'exec:git_push'
    ]);
  });


  //
  // Clean Project
  //
  grunt.registerTask('sweep', 'Clean up files', function() {
    grunt.task.run([
      'clean',
      'requirejs',
      'exec:git_add_u'
    ]);
  });


  grunt.registerTask('default', 'build');
  grunt.registerTask('build', ['requirejs','sed:version']);

  //
  // Load npm tasks
  //
  grunt.loadNpmTasks('grunt-sed');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');



};
