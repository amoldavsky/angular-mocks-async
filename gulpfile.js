(function( require ) {

    const gulp = require( "gulp" );
    const karma = require( "gulp-karma-runner" );
    const fs = require('fs');

    gulp.task( "compile", function () {
        const compressor = require( "node-minify" );

        let copyPromise = new Promise( function( resolve, reject ) {

            /// copy sources
            try {

                const srcFile = 'src/angular-mocks-async.js';
                const destFile = 'dist/angular-mocks-async.js';

                fs.createReadStream(
                    srcFile
                ).pipe(fs.createWriteStream(
                    destFile
                ).on('finish', function () {
                    resolve( destFile );
                }));

                console.log(`processed: ${destFile}`);

            } catch (e) {
                console.error(e);
                throw e;
            }
        });

        // minify all distributions
        return copyPromise.then( function( compiledFile ) {
            try {

                // generate dest file
                const destFile = (function( srcFile ) {
                    let split = srcFile.split( "." );
                    split.splice( split.length - 1, 0, "min" );
                    return split.join( "." );
                })( compiledFile );

                return new Promise( function( resolve, reject ) {
                    compressor.minify({
                        compressor: 'gcc',
                        input: compiledFile,
                        output: destFile,
                        sync: true,
                        options: {},
                        callback: function( error ) {
                            if( error ) {
                                console.error( error );
                                reject( error );
                            }

                            console.log(`minified: ${destFile}`);
                            resolve( destFile );
                        }
                    });
                });
            } catch( e ) {
                console.error( e );
                throw e;
            }
        });

    });

    gulp.task( "test-unminified", function () {
        gulp.src([
            'test/angular-1.5.8/angular.js',
            'test/angular-1.5.8/angular-mocks.js',
            'dist/angular-mocks-async.js',
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

    gulp.task( "test-minified", function () {
        gulp.src([
            'test/angular-1.5.8/angular.js',
            'test/angular-1.5.8/angular-mocks.js',
            'dist/angular-mocks-async.min.js',
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

    gulp.task( "test-with-angular-1.3.0", function () {
        gulp.src([
            'test/angular-1.3.0/angular.js',
            'test/angular-1.3.0/angular-mocks.js',
            'dist/angular-mocks-async.min.js',
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