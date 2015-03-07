module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-jslint');
  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-include-source');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bower_concat: {
      all: {
        dest: 'build/src/js/components.js',
        cssDest: 'build/src/css/components.css',
        bowerOptions: {
          relative: false
        }
      }
    },
    wiredep: {
      task: {
        src: [
          '*.html'
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
    },
    includeSource: {
      options: {
      },
      your_target: {
        files: {
          'dist/index.html': 'index.html'
        }  
      }
    },
    jslint: { 
      client: {
        src: [
          'src/js/**/*.js',
          'spec/**/*.js'
        ],
        directives: {
          browser: true,
          predef: [
            'jQuery'
          ]
        }
      }
    },
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['src/js/**/*.js', 'build/src/js/components.js'],
        dest: 'dist/built.js',
      },
    },
    uglify: {
      my_target: {
        files: {
          'dist/output.min.js': ['dist/built.js']
        }
      }
    }
  });


  grunt.registerTask('default', ['bower_concat', 'wiredep', 'includeSource', 'jasmine_node']);
  grunt.registerTask('test', ['jasmine_node']);

};

