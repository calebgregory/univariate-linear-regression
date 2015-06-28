module.exports = function(grunt) {

  // grunt.loadNpmTasks('grunt-babel');
  // grunt.loadNpmTasks('grunt-contrib-clean');
  // grunt.loadNpmTasks('grunt-contrib-copy');
  // grunt.loadNpmTasks('grunt-contrib-jade');
  // grunt.loadNpmTasks('grunt-sass');

  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    autoprefixer: {
      main: {
        options: ['>1% in US'],
        src: 'public/css/main.css'
      }
    },
    babel: {
      dev: {
        options: {
          sourceMap: 'inline'
        },
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: ['**/*.js'],
            dest: 'public/'
          }
        ]
      },
      prod: {
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: ['**/*.js'],
            dest: 'public/'
          }
        ]
      }
    },
    bower_concat: {
      main: {
        dest: 'public/lib/build.js',
        cssDest: 'public/lib/build.css'
      }
    },
    clean: ['public'],
    connect: {
      server: {
        options: {
          port: 9001,
          base: 'public/',
          open: true,
          livereload: true
        }
      }
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: [
              '**',
              '!**/*.jade',
              '!**/*.scss',
              '!**/*.js'
            ],
            dest: 'public/',
            filter: 'isFile'
          }
        ]
      }
    },
    cssmin: {
      main: {
        files: {
          'public/lib/build.css': 'public/lib/build.css'
        }
      }
    },
    jade: {
      dev: {
        options: {
          pretty: true
        },
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: ['**/*.jade', '!**/_*.jade'],
            dest: 'public/',
            ext: '.html'
          }
        ]
      },
      prod: {
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: ['**/*.jade', '!**/_*.jade'],
            dest: 'public/',
            ext: '.html'
          }
        ]
      }
    },
    sass: {
      prod: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          'public/css/main.css': 'src/_styles/main.scss'
        }
      },
      dev: {
        files: {
          'public/css/main.css': 'src/_styles/main.scss'
        },
        options: {
          sourceMap: true,
          sourceMapEmbed: true
        }
      }
    },
    uglify: {
      bower: {
        files: {
          'public/lib/build.js': 'public/lib/build.js'
        }
      },
      main: {
        files: [
          {
            expand: true,
            cwd: 'public/',
            src: ['**/*.js'],
            dest: 'public/'
          }
        ]
      }
    },
    watch: {
      livereload: {
        options: {
          livereload: true
        },
        files: [
          'public/css/main.css',
          'public/js/**/*.js',
          'public/**/*.html'
        ]
      },
      jade: {
        files: ['src/**/*.jade'],
        tasks: ['jade:dev']
      },
      sass: {
        files: ['src/**/*.scss'],
        tasks: ['sass:dev', 'autoprefixer']
      },
      js: {
        files: ['src/js/**/*.js'],
        tasks: ['babel:dev']
      }
    }
  });

  // Default task(s).
  grunt.registerTask('default', []);
  grunt.registerTask('build', [
    'clean',
    'copy',
    'bower_concat',
    'jade:prod',
    'sass:prod',
    'babel:prod',
    'autoprefixer',
    'uglify',
    'cssmin'
  ]);
  grunt.registerTask('build-dev', [
    'clean',
    'copy',
    'bower_concat',
    'jade:dev',
    'sass:dev',
    'babel:dev',
    'autoprefixer'
  ]);
  grunt.registerTask('serve', [
    'connect',
    'watch'
  ])
};
