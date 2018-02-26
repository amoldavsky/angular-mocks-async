(function( require ) {

    const gulp = require( "gulp" );
    // const gulpSequence = require('run-sequence').use( gulp );
    const karma = require( "gulp-karma-runner" );
    const fs = require('fs');

    function createKarmaServer() {
        return karma.server({
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
        });
    }

    function gulpTestRun( angularVersion = "1.6.0", isMinified = false ) {
        const ext  = isMinified ? '.min' : '';
        return gulp.src([
                `test/angular-${angularVersion}/angular.js`,
                `test/angular-${angularVersion}/angular-mocks.js`,
                `dist/angular-mocks-async${ext}.js`,
                'test/angular-mocks-async-internal-tests.js',
                'test/angular-mocks-async-test.js'
        ], { "read": false })
        .pipe( createKarmaServer() );
    }

    gulp.task( "dist", function () {
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

    gulp.task( "test-with-angular-1.6.0", [ "test-with-angular-1.6.0-minified", "test-with-angular-1.6.0-unminified" ]);
    gulp.task( "test-with-angular-1.6.0-unminified", () => gulpTestRun( "1.6.0" ) );
    gulp.task( "test-with-angular-1.6.0-minified", () => gulpTestRun( "1.6.0", true ) );

    gulp.task( "test-with-angular-1.5.0", [ "test-with-angular-1.5.0-minified", "test-with-angular-1.5.0-unminified" ]);
    gulp.task( "test-with-angular-1.5.0-unminified", () => gulpTestRun( "1.5.0" ) );
    gulp.task( "test-with-angular-1.5.0-minified", () => gulpTestRun( "1.5.0", true ) );

    gulp.task( "test-with-angular-1.4.0", [ "test-with-angular-1.4.0-minified", "test-with-angular-1.4.0-unminified" ]);
    gulp.task( "test-with-angular-1.4.0-unminified", () => gulpTestRun( "1.4.0" ) );
    gulp.task( "test-with-angular-1.4.0-minified", () => gulpTestRun( "1.4.0", true ) );

    gulp.task( "test-with-angular-1.3.17", [ "test-with-angular-1.3.17-minified", "test-with-angular-1.3.17-unminified" ]);
    gulp.task( "test-with-angular-1.3.17-minified", () => gulpTestRun( "1.3.17" ) );
    gulp.task( "test-with-angular-1.3.17-unminified", () => gulpTestRun( "1.3.17", true ) );

    function runSequential( tasks ) {
        if( !tasks || tasks.length <= 0 ) return;

        const task = tasks[0];
        gulp.start( task, () => {
            console.log( `${task} finished` );
            runSequential( tasks.slice(1) );
        } );
    }
    gulp.task( "test-with-angular-all-versions", () => runSequential([
        "test-with-angular-1.3.17",
        "test-with-angular-1.4.0",
        "test-with-angular-1.5.0",
        "test-with-angular-1.6.0",
    ]));

    gulp.task( "test-with-angular-1.3.0", () => gulpTestRun("1.3.0") );

}( require ));