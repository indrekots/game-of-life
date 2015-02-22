module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bower_concat: {
      all: {
        dest: 'build/_bower.js',
        cssDest: 'build/_bower.css',
        bowerOptions: {
          relative: false
        }
      }
    },
    includeSource: {
      options: {
        basePath: 'app',
        baseUrl: 'public/'
      },
      myTarget: {
        files: {
          'dist/index.html': 'app/index.tpl.html'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-include-source');

  // Default task(s).
  grunt.registerTask('default', ['bower_concat', 'includeSource']);

};

