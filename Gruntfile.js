module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-jslint');
  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-include-source');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-coveralls');
  grunt.loadNpmTasks('grunt-jasmine-node-coverage');

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
      with_coverage: {
        options: {
          coverage: {},
          forceExit: true,
          match: '.',
          matchAll: false,
          specFolders: ['spec'],
          extensions: 'js',
          specNameMatcher: 'spec',
          captureExceptions: true,
          showColors: true,
          junitreport: {
            report: false,
            savePath : './build/reports/jasmine/',
            useDotNotation: true,
            consolidate: true
          }
        },
        src: ['src/js/*.js']
      }
    },
    includeSource: {
      options: {
        basePath: 'target'
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
        dest: grunt.buildDir + 'src/js/concat.js',
      },
    },
    uglify: {
      my_target: {
        files: {
          'target/src/js/game-of-life.min.js': [grunt.buildDir + 'src/js/concat.js']
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
    },
    coveralls: {
      options: {
        // LCOV coverage file relevant to every target
        src: 'coverage-results/lcov.info',

        // When true, grunt-coveralls will only print a warning rather than
        // an error, to prevent CI builds from failing unnecessarily (e.g. if
        // coveralls.io is down). Optional, defaults to false.
        force: false
      },
      your_target: {
        // Target-specific LCOV coverage file
        src: 'coverage-results/extra-results-*.info'
      },
    },
  });

  grunt.registerTask('test', ['jasmine_node']);
  grunt.registerTask('dev', ['clean', 'copy:dev', 'includeSource', 'wiredep']);
  grunt.registerTask('release', ['test', 'bower_concat', 'concat', 'uglify', 'includeSource', 'clean:build']);
  grunt.registerTask('default', ['dev']);

};

