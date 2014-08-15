VERSION = require('./package.json').version
BANNER = """
Leaflet.controllable-image-overlay v#{VERSION}

A plugin to Leaflet powered maps that:
1. allow you to put an image above the map.
2. allow you to rotate, resize, move and set opacity of this image.

Copyright (c) 2014 agate.
Licensed under the ISC license.

https://github.com/agate/Leaflet.controllable-image-overlay
"""

module.exports = (grunt) ->
  grunt.initConfig
    clean:
      dist: 'dist/*'

    coffee:
      compile:
        files:
          'dist/leaflet.controllable-image-overlay.js': [
            'src/control.coffee'
            'src/overlay.coffee'
          ]

    sass:
      dist:
        options:
          style: 'expanded'
        files:
          'dist/leaflet.controllable-image-overlay.css':
            'src/style.sass'

    uglify:
      dist_min:
        files:
          'dist/leaflet.controllable-image-overlay.min.js': [
            'dist/leaflet.controllable-image-overlay.js'
          ]

    cssmin:
      combine:
        files:
          'dist/leaflet.controllable-image-overlay.min.css': [
            'dist/leaflet.controllable-image-overlay.css'
          ]

    usebanner:
      all:
        options:
          banner: "/*\n#{BANNER.split(/\n/).map((line) -> " * #{line}").join("\n")}\n */\n"
        files:
          src: [
            'dist/leaflet.controllable-image-overlay.js'
            'dist/leaflet.controllable-image-overlay.min.js'
            'dist/leaflet.controllable-image-overlay.css'
            'dist/leaflet.controllable-image-overlay.min.css'
          ]

    copy:
      images:
        files: [
          {
            src: 'resources/sprites.enable.png'
            dest: 'dist/leaflet.controllable-image-overlay.enable.png'
          }
          {
            src: 'resources/sprites.disable.png'
            dest: 'dist/leaflet.controllable-image-overlay.disable.png'
          }
        ]

    watch:
      coffee:
        files: 'src/*.coffee'
        tasks: [ 'coffee' ]
      sass:
        files: 'src/*.sass'
        tasks: [ 'sass' ]

  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-sass'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-cssmin'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-banner'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'default', [
    'clean'
    'coffee'
    'sass'
    'uglify'
    'cssmin'
    'usebanner'
    'copy'
  ]
