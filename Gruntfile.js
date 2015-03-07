module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-jslint');
  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-include-source');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.root = './';
  grunt.srcDir = grunt.root + 'src/'
  grunt.srcJsDir = grunt.root + 'src/js/';
  grunt.buildDir = grunt.root + 'build/'
  grunt.targetDir = grunt.root + 'target/';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bower_concat: {
      all: {
        dest: grunt.buildDir + 'src/js/components.js',
        cssDest: grunt.buildDir + 'src/css/components.css',
        bowerOptions: {
          relative: false
        }
      }
    },
    wiredep: {
      task: {
        src: [
          grunt.targetDir + 'index.html'
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
          'target/index.html': 'index.html'
        }  
      }
    },
    jslint: { 
      client: {
        src: [
          grunt.srcJsDir + '**/*.js',
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
        src: [grunt.srcJsDir + '**/*.js', grunt.buildDir + 'src/js/components.js'],
        dest: grunt.targetDir + 'concat.js',
      },
    },
    uglify: {
      my_target: {
        files: {
          'target/game-of-life.min.js': [grunt.targetDir + 'concat.js']
        }
      }
    },
    copy: {
      dev: {
        files: [
          {expand: true, src: ['src/**'], dest: 'target/', filter: 'isFile'}
        ]
      }
    },
    clean: {
      build: [grunt.buildDir],
      target: [grunt.targetDir]
    }
  });


  grunt.registerTask('dev', ['clean', 'copy:dev', 'includeSource', 'wiredep']);
  grunt.registerTask('default', ['bower_concat', 'wiredep', 'includeSource', 'jasmine_node']);
  grunt.registerTask('test', ['jasmine_node']);

};

