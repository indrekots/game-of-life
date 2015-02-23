module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-wiredep');

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
    wiredep: {
      task: {
        src: [
          'app/*.html'   // .html support...
        ]
      }
    }
  });

  // Default task(s).
  grunt.registerTask('default', ['bower_concat']);

};

