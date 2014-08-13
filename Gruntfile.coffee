module.exports = (grunt) ->
  grunt.initConfig
    clean:
      dist: [
        'dist/leaflet.controllable-image-overlay.js'
        'dist/leaflet.controllable-image-overlay.min.js'
      ]

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

  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-sass'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-cssmin'

  grunt.registerTask 'default', [
    'clean'
    'coffee'
    'sass'
    'uglify'
    'cssmin'
  ]
