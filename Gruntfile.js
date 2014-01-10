'use strict';
module.exports = function(grunt) {

    //frameworks = ["requirejs"];
    //grunt.loadNpmTasks('grunt-conventional-changelog');
    grunt.loadNpmTasks('grunt-karma');

    grunt.initConfig({
        karma: {
            options: {
                browsers: ['PhantomJS' /*'Chrome', 'Firefox'*/],
                //browsers: ['PhantomJS', 'PhantomJS_custom'],
                runnerPort: 9999,
                files: [
                    //'node_modules/karma-mocha/lib/index.js',
                    //'node_modules/karma-mocha/lib/adapter.js',
                    'src/head.load.js',
                    'src/honey.source.js',
                    'test/honey.js'
                ],
                frameworks: ['mocha', 'chai'],
                autoWatch: true,
                colors : true,
                plugins: [
                    'karma-mocha',
                    'karma-spec-reporter',
                    'karma-chai',
                    'karma-phantomjs-launcher'
                ]
            },
            continuous: {
                singleRun: true,
                browsers: ['PhantomJS'],
                reporters : ['spec']
            },
        }
    });

    grunt.registerTask('test', ['karma:continuous']);
    //grunt.registerTask('test', ['karma']);
};
