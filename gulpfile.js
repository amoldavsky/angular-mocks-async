(function( require ) {

    const gulp = require( "gulp" );
    const karma = require( "gulp-karma-runner" );
    const fs = require('fs');

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

    gulp.task("test-minified", function () {
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

    gulp.task("compile", function () {
        const compressor = require( "node-minify" );

        /// copy sources
        try {

            const srcFile = 'src/angular-mocks-async.js';
            const destFile = 'dist/angular-mocks-async.js';

            fs.createReadStream(
                srcFile
            ).pipe( fs.createWriteStream(
                destFile
            ));

            console.log( `processed: ${destFile}` );

        } catch( e ) {
            console.error( e );
            throw e;
        }

        // minify all distributions
        try {

            const srcFile = 'dist/angular-mocks-async.js';
            const destFile = 'dist/angular-mocks-async.min.js';

            compressor.minify({
                compressor: 'yui-js',
                input: srcFile,
                output: destFile,
                sync: true,
                callback: function( error ) {
                    if( error ) {
                        console.error( error );
                        throw error;
                    }

                    console.log(`minified: ${destFile}`);
                }
            });
        } catch( e ) {
            console.error( e );
            throw e;
        }
    });

}( require ));