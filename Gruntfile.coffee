VERSION = require('./package.json').version
BANNAR = """
Leaflet.controllable-image-overlay v#{VERSION}

A plugin to Leaflet powered maps that allow you to put a image above map and
allow you to rotate, resize, move and set transparent of this image.

Copyright (c) 2014 agate.
Licensed under the ISC license.

https://github.com/agate/Leaflet.controllable-image-overlay

Date: #{new Date().toUTCString()}
"""

module.exports = (grunt) ->
  grunt.initConfig
    clean:
      tmp: 'tmp'
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
          banner: "/*\n#{BANNAR}\n*/\n"

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

  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-sass'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-cssmin'
  grunt.loadNpmTasks 'grunt-contrib-copy'

  grunt.registerTask 'default', [
    'clean'
    'coffee'
    'sass'
    'uglify'
    'cssmin'
    'copy'
  ]
