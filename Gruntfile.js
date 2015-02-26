module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-jasmine-node');

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
          'app/*.html'
        ]
      }
    },
    jasmine_node: {
      options: {
        forceExit: true,
        match: '.',
        matchall: false,
        extensions: 'js',
        specNameMatcher: 'spec'
      },
      all: ['spec/']
    }
  });

  grunt.registerTask('default', ['bower_concat', 'wiredep', 'jasmine_node']);
  grunt.registerTask('test', ['jasmine_node']);

};

