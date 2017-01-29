(function( require ) {

    const gulp = require( "gulp" );
    const karma = require( "gulp-karma-runner" );

    gulp.task("test-unminified", function () {
        gulp.src([
            'test/angular-1.5.8/angular.js',
            'test/angular-1.5.8/angular-mocks.js',
            'src/angular-mocks-async.js',
            'test/angular-mocks-async-internal-tests.js',
            'test/angular-mocks-async-test.js'
        ], {"read": false}).pipe(
            karma.server({
                singleRun: true,
                autoWatch: true,
                concurrency: Infinity,
                port: 9876,

                frameworks: [ "mocha", "chai" ],
                browsers: [ "Chrome" ],
                basePath: "",
                exclude: [],
                preprocessors: {
                    'src/**/*.js': ['coverage']
                },
                reporters: [ 'spec', 'coverage' ],
                coverageReporter: {
                    type : 'lcov',
                    dir : 'coverage/'
                },
                colors: true
            })
        );
    });
}( require ));