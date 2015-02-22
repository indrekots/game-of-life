module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-include-source');

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
      templates: {
        html: {
          js: '<script src="{filePath}"></script>',
          css: '<link rel="stylesheet" type="text/css" href="{filePath}" />',
        }
      },
      myTarget: {
        files: {
          'dist/index.html': 'app/index.tpl.html'
        }
      }
    }
  });

  // Default task(s).
  grunt.registerTask('default', ['bower_concat', 'includeSource']);

};

