//-------------------------- Prep:

//-------------------------- Tests:
(function( ng ) {
    describe( 'ground test', function() {

        it( 'test angularjs structure', function() {

            expect( ng.mock ).toBeDefined();

            var app = ng.module( 'mockApp', [ 'ngMockE2E' ] );
            app.run( [ '$httpBackend', function( $httpBackend  ) {
                expect( $httpBackend.when ).toBeDefined();
            }]);

        });

        it( 'test init', function() {

            var app = ng.module( 'mockApp', [ 'ngMockE2EAsync' ] );
            expect( ng.mock.$HttpBackendAsyncDecorator ).toBeDefined();

            app.run( [ '$httpBackend', function( $httpBackend  ) {
                expect( $httpBackend.whenAsync ).toBeDefined();
            }]);

        });

    });

    describe( 'test ngMockAsync', function() {

        //------------------ test GET:
        it( 'test GET', function() {

            var app = ng.module( 'mockApp', [
                'ngMockE2E',
                'ngMockE2EAsync'
            ]);

            app.run( [ '$httpBackend', '$q', function( $httpBackend, $q ) {

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
                    response.resolve( [ 200, "mock response", data ] );

                    return response.promise;

                });

                // test the mock
                $http({
                    method: 'GET',
                    url: 'http://api.example.com/user/1'
                }).then(
                    function success( response ) {

                        expect( response ).toBeDefined();
                        expect( response.data ).toBeDefined();

                        var data = response.data;
                        expect( data.userId ).toBe( 1 );

                    }
                );
            }]);

        });

        it( 'test GET async', function() {

            var app = ng.module( 'mockApp', [
                'ngMockE2E',
                'ngMockE2EAsync'
            ]);

            app.run( [ '$httpBackend', '$q', function( $httpBackend, $q ) {

                // define our HTTP mock
                $httpBackend.whenAsync(
                    'GET',
                    new RegExp( 'http://api.example.com/user/.+$' )
                ).respond( function( method, url, data, config ) {

                    var re = /.*\/user\/(\w+)/;
                    var userId = parseInt(url.replace(re, '$1'), 10);

                    var response = $q.defer();

                    setTimeout( function() {

                        var data = {
                            userId: userId
                        };
                        response.resolve( [ 200, "mock response", data ] );

                    }, 1000 );

                    return response.promise;

                });

                // test the mock
                $http({
                    method: 'GET',
                    url: 'http://api.example.com/user/1'
                }).then(
                    function success( response ) {

                        expect( response ).toBeDefined();
                        expect( response.data ).toBeDefined();

                        var data = response.data;
                        expect( data.userId ).toBe( 1 );

                    }
                );
            }]);

        });

        //------------------ test POST:
        it( 'test POST', function() {

            var app = ng.module( 'mockApp', [
                'ngMockE2E',
                'ngMockE2EAsync'
            ]);

            app.run( [ '$httpBackend', '$q', function( $httpBackend, $q ) {

                // define our HTTP mock
                $httpBackend.when(
                    'POST',
                    new RegExp( 'http://api.example.com/user/.+$' )
                ).respond( function( method, url, payload, config ) {

                    var re = /.*\/user\/(\w+)/;
                    var userId = parseInt( url.replace(re, '$1'), 10 );

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
                    method: 'POST',
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

                    }
                );
            }]);

        });

        it( 'test POST async', function() {

            var app = ng.module( 'mockApp', [
                'ngMockE2E',
                'ngMockE2EAsync'
            ]);

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

                    }
                );
            }]);

        });

        //------------------ test PUT:
        it( 'test PUT', function() {

            var app = ng.module( 'mockApp', [
                'ngMockE2E',
                'ngMockE2EAsync'
            ]);

            app.run( [ '$httpBackend', '$q', function( $httpBackend, $q ) {

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

                    }
                );
            }]);

        });

        it( 'test POST async', function() {

            var app = ng.module( 'mockApp', [
                'ngMockE2E',
                'ngMockE2EAsync'
            ]);

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

            var app = ng.module( 'mockApp', [
                'ngMockE2E',
                'ngMockE2EAsync'
            ]);

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

    });
})( angular );