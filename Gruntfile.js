// Gruntfile.js
module.exports = function (grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)

  grunt.initConfig({
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          clearRquireCache: true,
          quiet: false
        },
        src: ['test/*.js']
      }
    },

    watch: {
      js: {
        files: ['Gruntfile.js', 'lib/**/*.js', 'test/*.js'],
        tasks: ['mochaTest']
      }
    }
  })

  grunt.registerTask('default', 'mochaTest')
}
