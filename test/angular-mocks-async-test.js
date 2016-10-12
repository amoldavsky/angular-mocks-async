var expect = chai.expect;
var should = chai.should;
//-------------------------- Prep:

//-------------------------- Tests:
(function( ng ) {

    var app = ng.module( 'mockApp', [
        'ngMock',
        'ngMockE2E',
        'ngMockE2EAsync'
    ]);

    describe( 'test ngMockAsync', function() {

        beforeEach( function() {
            module( 'mockApp' )
        });

        // thank you for the amazing solution to fix mocks falling through in tests...
        // http://www.bradoncode.com/blog/2015/06/16/unit-test-http-ngmock-passthrough/
        // https://github.com/bbraithwaite/ngMockHttp
        (function() {
            angular.mock.http = {};
            angular.mock.http.init = function () {

                angular.module('ngMock', ['ng', 'ngMockE2E']).provider({
                    $exceptionHandler: angular.mock.$ExceptionHandlerProvider,
                    $log: angular.mock.$LogProvider,
                    $interval: angular.mock.$IntervalProvider,
                    $rootElement: angular.mock.$RootElementProvider
                }).config(['$provide', function ($provide) {
                    $provide.decorator('$timeout', angular.mock.$TimeoutDecorator);
                    $provide.decorator('$$rAF', angular.mock.$RAFDecorator);
                    // From version 1.4.3 this line is removed. Uncomment for older versions.
                    //$provide.decorator('$$asyncCallback', angular.mock.$AsyncCallbackDecorator);
                    $provide.decorator('$rootScope', angular.mock.$RootScopeDecorator);
                    $provide.decorator('$controller', angular.mock.$ControllerDecorator);
                }]);

            };

            angular.mock.http.reset = function () {

                angular.module('ngMock', ['ng']).provider({
                    $browser: angular.mock.$BrowserProvider,
                    $exceptionHandler: angular.mock.$ExceptionHandlerProvider,
                    $log: angular.mock.$LogProvider,
                    $interval: angular.mock.$IntervalProvider,
                    $httpBackend: angular.mock.$HttpBackendProvider,
                    $rootElement: angular.mock.$RootElementProvider
                }).config(['$provide', function ($provide) {
                    $provide.decorator('$timeout', angular.mock.$TimeoutDecorator);
                    $provide.decorator('$$rAF', angular.mock.$RAFDecorator);
                    // From version 1.4.3 this line is removed. Uncomment for older versions.
                    //$provide.decorator('$$asyncCallback', angular.mock.$AsyncCallbackDecorator);
                    $provide.decorator('$rootScope', angular.mock.$RootScopeDecorator);
                    $provide.decorator('$controller', angular.mock.$ControllerDecorator);
                }]);

            };

            beforeEach(angular.mock.http.init);
            afterEach(angular.mock.http.reset);
        })();

        //------------------ test GET:
        it( 'test original GET mock with promise fails', function( done ) {
            inject( function( $httpBackend, $q, $http ) {

                done;

                // define our HTTP mock
                $httpBackend.when(
                    'GET',
                    new RegExp( 'http://api.example.com/user/.+$' )
                ).respond( function( method, url, data, config ) {

                    var re = /.*\/user\/(\w+)/;
                    var userId = parseInt(url.replace(re, '$1'), 10);

                    var response = $q.defer();

                    var data = {
                        userId: userId
                    };
                    response.resolve( [ 200, data, {} ] );

                    return response.promise;

                });

                // test the mock
                $http({
                    method: 'GET',
                    url: 'http://api.example.com/user/11'
                }).then(
                    function success( response ) {

                        done( "the response was a SUCCESS, this is an error!" );
                    },
                    function error( response ) {
                        // mocked response had status 200 but the request failed...
                        done();
                    }
                );

            });
        });
        it( 'test original GET mock with object', function( done ) {
            inject( function( $httpBackend, $q, $http ) {

                done;

                // define our HTTP mock
                $httpBackend.when(
                    'GET',
                    new RegExp( 'http://api.example.com/user/.+$' )
                ).respond(function (method, url, data, config) {

                    var re = /.*\/user\/(\w+)/;
                    var userId = parseInt(url.replace(re, '$1'), 10);

                    var response = $q.defer();

                    var data = {
                        userId: userId
                    };
                    return [ 200, data, "some status 123" ];

                    return response.promise;

                });

                // test the mock
                $http({
                    method: 'GET',
                    url: 'http://api.example.com/user/11'
                }).then(
                    function success( response ) {

                        expect( response ).to.be.a( 'object' );
                        expect( response ).to.have.property( 'data' );
                        expect( response.data ).to.be.a( 'object' );

                        var data = response.data;
                        expect( data.userId == 11 ).to.be.ok;

                        done();
                    },
                    function error( response ) {

                        done();
                    }
                );

            });
        });
        it( 'test GET async with delayed promise', function( done ) {
            inject( function( $httpBackend, $q, $http ) {

                // define our HTTP mock
                $httpBackend.whenAsync(
                    'GET',
                    new RegExp('http://api.example.com/user/.+$')
                ).respond(function (method, url, data, config) {

                    var re = /.*\/user\/(\w+)/;
                    var userId = parseInt(url.replace(re, '$1'), 10);

                    var response = $q.defer();

                    setTimeout(function () {

                        var data = {
                            userId: userId
                        };
                        response.resolve( [ 200, data, "some status" ]);

                    }, 500);

                    return response.promise;

                });

                // test the mock
                $http({
                    method: 'GET',
                    url: 'http://api.example.com/user/11'
                }).then(
                    function success( response ) {

                        expect( response ).to.be.a( 'object' );
                        expect( response ).to.have.property( 'data' );
                        expect( response.data ).to.be.a( 'object' );

                        var data = response.data;
                        expect( data.userId == 11 ).to.be.ok;

                        done();

                    },
                    function error( response ) {
                        done( "request failed, this should not happen" );
                    }
                );
            })
        });


        //------------------ test POST:
        it( 'test original POST mock with promise fails', function( done ) {
            inject( function( $httpBackend, $q, $http ) {

                done;

                // define our HTTP mock
                $httpBackend.when(
                    'POST',
                    new RegExp( 'http://api.example.com/user/.+$' )
                ).respond( function( method, url, data, config ) {

                    var re = /.*\/user\/(\w+)/;
                    var userId = parseInt(url.replace(re, '$1'), 10);

                    var response = $q.defer();

                    var data = {
                        userId: userId
                    };
                    response.resolve([ 200, data, {} ]);

                    return response.promise;

                });

                // test the mock
                $http({
                    method: 'POST',
                    url: 'http://api.example.com/user/11'
                }).then(
                    function success( response ) {

                        done( "the response was a SUCCESS, this is an error!" );
                    },
                    function error( response ) {
                        // mocked response had status 200 but the request failed...
                        done();
                    }
                );

            });
        });
        it( 'test original POST mock with object', function( done ) {
            inject( function( $httpBackend, $q, $http ) {

                done;

                // define our HTTP mock
                $httpBackend.when(
                    'POST',
                    new RegExp( 'http://api.example.com/user/.+$' )
                ).respond( function( method, url, data, config ) {

                    var re = /.*\/user\/(\w+)/;
                    var userId = parseInt(url.replace(re, '$1'), 10);

                    var response = $q.defer();

                    var data = {
                        userId: userId
                    };
                    return [ 200, data, {} ];

                    return response.promise;

                });

                // test the mock
                $http({
                    method: 'POST',
                    url: 'http://api.example.com/user/11'
                }).then(
                    function success( response ) {

                        expect( response ).to.be.a( 'object' );
                        expect( response ).to.have.property( 'data' );
                        expect( response.data ).to.be.a( 'object' );

                        var data = response.data;
                        expect( data.userId == 11 ).to.be.ok;

                        done();
                    },
                    function error( response ) {

                        done();
                    }
                );

            });
        });
        it( 'test POST async with delayed promise', function( done ) {
            inject( function( $httpBackend, $q, $http ) {

                // define our HTTP mock
                $httpBackend.whenAsync(
                    'POST',
                    new RegExp('http://api.example.com/user/.+$')
                ).respond( function( method, url, data, config ) {

                    var re = /.*\/user\/(\w+)/;
                    var userId = parseInt( url.replace(re, '$1'), 10 );

                    var data = {
                        userId: userId
                    };

                    var response = $q.defer();

                    setTimeout(function () {
                        response.resolve( [ 200, data, {} ]);
                    }, 500);

                    return response.promise;

                });

                // test the mock
                $http({
                    method: 'POST',
                    url: 'http://api.example.com/user/11'
                }).then(
                    function success( response ) {

                        expect( response ).to.be.a( 'object' );
                        expect( response ).to.have.property( 'data' );
                        expect( response.data ).to.be.a( 'object' );

                        var data = response.data;
                        expect( data.userId == 11 ).to.be.ok;

                        done();

                    },
                    function error( response ) {
                        done( "request failed, this should not happen" );
                    }
                );
            })
        });

        //------------------ test PUT:
        it( 'test original PUT mock with promise fails', function( done ) {
            inject( function( $httpBackend, $q, $http ) {

                done;

                // define our HTTP mock
                $httpBackend.when(
                    'PUT',
                    new RegExp( 'http://api.example.com/user/.+$' )
                ).respond( function( method, url, data, config ) {

                    var re = /.*\/user\/(\w+)/;
                    var userId = parseInt(url.replace(re, '$1'), 10);

                    var response = $q.defer();

                    var data = {
                        userId: userId
                    };
                    response.resolve([ 200, data, {} ]);

                    return response.promise;

                });

                // test the mock
                $http({
                    method: 'PUT',
                    url: 'http://api.example.com/user/11'
                }).then(
                    function success( response ) {

                        done( "the response was a SUCCESS, this is an error!" );
                    },
                    function error( response ) {
                        // mocked response had status 200 but the request failed...
                        done();
                    }
                );

            });
        });
        it( 'test original PUT mock with object', function( done ) {
            inject( function( $httpBackend, $q, $http ) {

                done;

                // define our HTTP mock
                $httpBackend.when(
                    'PUT',
                    new RegExp( 'http://api.example.com/user/.+$' )
                ).respond( function( method, url, data, config ) {

                    var re = /.*\/user\/(\w+)/;
                    var userId = parseInt(url.replace(re, '$1'), 10);

                    var response = $q.defer();

                    var data = {
                        userId: userId
                    };
                    return [ 200, data, {} ];

                    return response.promise;

                });

                // test the mock
                $http({
                    method: 'PUT',
                    url: 'http://api.example.com/user/11'
                }).then(
                    function success( response ) {

                        expect( response ).to.be.a( 'object' );
                        expect( response ).to.have.property( 'data' );
                        expect( response.data ).to.be.a( 'object' );

                        var data = response.data;
                        expect( data.userId == 11 ).to.be.ok;

                        done();
                    },
                    function error( response ) {

                        done();
                    }
                );

            });
        });
        it( 'test PUT async with delayed promise', function( done ) {
            inject( function( $httpBackend, $q, $http ) {

                // define our HTTP mock
                $httpBackend.whenAsync(
                    'PUT',
                    new RegExp('http://api.example.com/user/.+$')
                ).respond( function( method, url, data, config ) {

                    var re = /.*\/user\/(\w+)/;
                    var userId = parseInt( url.replace(re, '$1'), 10 );

                    var data = {
                        userId: userId
                    };

                    var response = $q.defer();

                    setTimeout(function () {
                        response.resolve( [ 200, data, {} ]);
                    }, 500);

                    return response.promise;

                });

                // test the mock
                $http({
                    method: 'PUT',
                    url: 'http://api.example.com/user/11'
                }).then(
                    function success( response ) {

                        expect( response ).to.be.a( 'object' );
                        expect( response ).to.have.property( 'data' );
                        expect( response.data ).to.be.a( 'object' );

                        var data = response.data;
                        expect( data.userId == 11 ).to.be.ok;

                        done();

                    },
                    function error( response ) {
                        done( "request failed, this should not happen" );
                    }
                );
            })
        });

        //------------------ test DELETE:
        it( 'test original DELETE mock with promise fails', function( done ) {
            inject( function( $httpBackend, $q, $http ) {

                done;

                // define our HTTP mock
                $httpBackend.when(
                    'DELETE',
                    new RegExp( 'http://api.example.com/user/.+$' )
                ).respond( function( method, url, data, config ) {

                    var re = /.*\/user\/(\w+)/;
                    var userId = parseInt(url.replace(re, '$1'), 10);

                    var response = $q.defer();

                    var data = {
                        userId: userId
                    };
                    response.resolve([ 200, data, {} ]);

                    return response.promise;

                });

                // test the mock
                $http({
                    method: 'DELETE',
                    url: 'http://api.example.com/user/11'
                }).then(
                    function success( response ) {

                        done( "the response was a SUCCESS, this is an error!" );
                    },
                    function error( response ) {
                        // mocked response had status 200 but the request failed...
                        done();
                    }
                );

            });
        });
        it( 'test original DELETE mock with object', function( done ) {
            inject( function( $httpBackend, $q, $http ) {

                done;

                // define our HTTP mock
                $httpBackend.when(
                    'DELETE',
                    new RegExp( 'http://api.example.com/user/.+$' )
                ).respond( function( method, url, data, config ) {

                    var re = /.*\/user\/(\w+)/;
                    var userId = parseInt(url.replace(re, '$1'), 10);

                    var response = $q.defer();

                    var data = {
                        userId: userId
                    };
                    return [ 200, data, {} ];

                    return response.promise;

                });

                // test the mock
                $http({
                    method: 'DELETE',
                    url: 'http://api.example.com/user/11'
                }).then(
                    function success( response ) {

                        expect( response ).to.be.a( 'object' );
                        expect( response ).to.have.property( 'data' );
                        expect( response.data ).to.be.a( 'object' );

                        var data = response.data;
                        expect( data.userId == 11 ).to.be.ok;

                        done();
                    },
                    function error( response ) {

                        done();
                    }
                );

            });
        });
        it( 'test DELETE async with delayed promise', function( done ) {
            inject( function( $httpBackend, $q, $http ) {

                // define our HTTP mock
                $httpBackend.whenAsync(
                    'DELETE',
                    new RegExp('http://api.example.com/user/.+$')
                ).respond( function( method, url, data, config ) {

                    var re = /.*\/user\/(\w+)/;
                    var userId = parseInt( url.replace(re, '$1'), 10 );

                    var data = {
                        userId: userId
                    };

                    var response = $q.defer();

                    setTimeout(function () {
                        response.resolve( [ 200, data, {} ]);
                    }, 500);

                    return response.promise;

                });

                // test the mock
                $http({
                    method: 'DELETE',
                    url: 'http://api.example.com/user/11'
                }).then(
                    function success( response ) {

                        expect( response ).to.be.a( 'object' );
                        expect( response ).to.have.property( 'data' );
                        expect( response.data ).to.be.a( 'object' );

                        var data = response.data;
                        expect( data.userId == 11 ).to.be.ok;

                        done();

                    },
                    function error( response ) {
                        done( "request failed, this should not happen" );
                    }
                );
            })
        });
        /*
        //------------------ test PUT:
        it( 'test PUT', function( done ) {

            inject( function( $httpBackend, $q, $http ) {

                // define our HTTP mock
                $httpBackend.when(
                    'PUT',
                    new RegExp( 'http://api.example.com/user/.+$' )
                ).respond( function( method, url, payload, config ) {

                    var re = /.*\/user\/(\w+)/;
                    var userId = parseInt(url.replace(re, '$1'), 10);

                    var response = $q.defer();

                    var data = {
                        userId: userId,
                        payload: payload
                    };
                    response.resolve( [ 200, "mock response", data ] );

                    return response.promise;

                });

                // test the mock
                $http({
                    method: 'PUT',
                    url: 'http://api.example.com/user/1',
                    data: {
                        test: 123
                    }
                }).then(
                    function success( response ) {

                        expect( response ).toBeDefined();
                        expect( response.data ).toBeDefined();

                        var data = response.data;
                        expect( data.userId ).toBe( 1 );
                        expect( data.payload ).toBeDefined();
                        expect( data.payload.test ).toBe( 123 );

                        done();

                    }
                );
            });

        });

        it( 'test POST async', function() {

            app.run( [ '$httpBackend', '$q', function( $httpBackend, $q ) {

                // define our HTTP mock
                $httpBackend.whenAsync(
                    'POST',
                    new RegExp( 'http://api.example.com/user/.+$' )
                ).respond( function( method, url, payload, config ) {

                    var re = /.*\/user\/(\w+)/;
                    var userId = parseInt(url.replace(re, '$1'), 10);

                    var response = $q.defer();

                    setTimeout( function() {

                        var data = {
                            userId: userId,
                            payload: payload
                        };
                        response.resolve( [ 200, "mock response", data ] );

                    }, 1000 );

                    return response.promise;

                });

                // test the mock
                $http({
                    method: 'POST',
                    url: 'http://api.example.com/user/1'
                }).then(
                    function success( response ) {

                        expect( response ).toBeDefined();
                        expect( response.data ).toBeDefined();

                        var data = response.data;
                        expect( data.userId ).toBe( 1 );
                        expect( data.payload ).toBeDefined();
                        expect( data.payload.test ).toBe( 123 );

                    }
                );
            }]);

        });

        //------------------ test DELETE:
        it( 'test DELETE', function() {

            app.run( [ '$httpBackend', '$q', function( $httpBackend, $q ) {

                // define our HTTP mock
                $httpBackend.when(
                    'DELETE',
                    new RegExp( 'http://api.example.com/user/.+$' )
                ).respond( function( method, url, payload, config ) {

                    var re = /.*\/user\/(\w+)/;
                    var userId = parseInt(url.replace(re, '$1'), 10);

                    var response = $q.defer();

                    var data = {
                        userId: userId,
                        payload: payload
                    };
                    response.resolve( [ 200, "mock response", data ] );

                    return response.promise;

                });

                // test the mock
                $http({
                    method: 'DELETE',
                    url: 'http://api.example.com/user/1'
                }).then(
                    function success( response ) {

                        expect( response ).toBeDefined();
                        expect( response.data ).toBeDefined();

                        var data = response.data;
                        expect( data.userId ).toBe( 1 );
                        expect( data.payload ).toBeDefined();
                        expect( data.payload.test ).toBe( 123 );

                    }
                );
            }]);

        });

        it( 'test DELETE async', function() {

            var app = ng.module( 'mockApp', [
                'ngMockE2E',
                'ngMockE2EAsync'
            ]);

            app.run( [ '$httpBackend', '$q', function( $httpBackend, $q ) {

                // define our HTTP mock
                $httpBackend.whenAsync(
                    'DELETE',
                    new RegExp( 'http://api.example.com/user/.+$' )
                ).respond( function( method, url, payload, config ) {

                    var re = /.*\/user\/(\w+)/;
                    var userId = parseInt(url.replace(re, '$1'), 10);

                    var response = $q.defer();

                    setTimeout( function() {

                        var data = {
                            userId: userId,
                            payload: payload
                        };
                        response.resolve( [ 200, "mock response", data ] );

                    }, 1000 );

                    return response.promise;

                });

                // test the mock
                $http({
                    method: 'DELETE',
                    url: 'http://api.example.com/user/1'
                }).then(
                    function success( response ) {

                        expect( response ).toBeDefined();
                        expect( response.data ).toBeDefined();

                        var data = response.data;
                        expect( data.userId ).toBe( 1 );
                        expect( data.payload ).toBeDefined();
                        expect( data.payload.test ).toBe( 123 );

                    }
                );
            }]);

        });
        */
    });
})( angular );