var semver = require('semver'),
    f = require('util').format;


module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    // pkg: grunt.file.readJSON('package.json'),

    // version: grunt.file.readJSON('package.json').version,

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
      clean: ["./public/dist"]
    },

    //
    // Build & Compile LESS
    //
    less: {
      development: {
        options: {
          paths: ["./public/css/less"],
          yuicompress: false
        },
        files: {
          "./public/dist/css/app.css": "./public/css/less/app.less"
        }
      },
      production: {
        options: {
          paths: ["./public/css/less"],
          yuicompress: true
        },
        files: {
          "./public/dist/css/app.css": "./public/css/less/app.less"
        }
      }
    },

    //
    // Watch task to live update files & builds
    //
    watch: {
      files: "./public/css/less/*",
      tasks: ["less"]
    }
  });


  //
  // Register Grunt Tasks
  // ---------------------------


  //
  // Enter as grunt release:minor (or major, patch, build)
  // This will re-write and update package.json
  //
  grunt.registerTask('release', 'Ship (dev & production)', function(version) {

    var _ = grunt.util._,
        pkg = grunt.file.readJSON('package.json'),
        curVersion = pkg.version;

    if(!version) version = 'minor';

    version = semver.inc(curVersion, version) || version;

    if (!semver.valid(version) || semver.lte(version, curVersion)) {
      grunt.fatal('invalid version dummy');
    }

    grunt.config.set('version', version);

    pkg = JSON.stringify(_.extend(pkg, {
      version: version
    }), null, 2);
    grunt.file.write('package.json', pkg);

    grunt.task.run([
      'clean',
      'requirejs',
      'less:production',
      'exec:git_add',
      'exec:git_commit:'+ version,
      'exec:git_push'
    ]);
  });


  //
  // Clean Project
  //
  grunt.registerTask('sweep', 'Clean up files', function() {
    grunt.task.run([
      'clean',
      'exec:git_add_u'
    ]);
  });


  //
  // Register Grunt Tasks
  //
  grunt.registerTask('default', 'build');
  grunt.registerTask('build', ['requirejs', 'less:development', 'sed:version']);
  grunt.registerTask('watch', ['less:development']);

  //
  // Load npm tasks
  //
  grunt.loadNpmTasks('grunt-sed');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-less');

};
