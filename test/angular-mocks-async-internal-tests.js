var expect = chai.expect;
var should = chai.should;
//-------------------------- Prep:

//-------------------------- Tests:
(function( ng ) {

    var app = ng.module('mockApp', [
        'ngMock',
        'ngMockE2E',
        'ngMockE2EAsync'
    ]);

    describe('ground test', function () {


        beforeEach(function () {
            module('mockApp')
        });

        it('test angularjs structure', function (done) {

            expect(ng.mock).to.be.a('object');

            var app = ng.module('mockApp2', ['ngMockE2E']);
            app.run(['$httpBackend', function ($httpBackend) {
                expect($httpBackend.when).to.be.a('function');
            }]);

            done();
        });

        it('test init', function (done) {

            var app = ng.module('mockApp2', ['ngMockE2EAsync']);
            expect(ng.mock.$HttpBackendAsyncDecorator).to.exist;

            app.run(['$httpBackend', function ($httpBackend) {
                expect($httpBackend.whenAsync).to.be.a('function');
            }]);

            done();
        });
    });

    describe( 'test internals', function() {

        beforeEach(function () {
            module('mockApp')
        });

        // thank you for the amazing solution to fix mocks falling through in tests...
        // http://www.bradoncode.com/blog/2015/06/16/unit-test-http-ngmock-passthrough/
        // https://github.com/bbraithwaite/ngMockHttp
        (function () {
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

        //------------------ test matchers:
        it( 'test original data matcher', function( done ) {

            var payload1 = {
                a: 1
            };
            var payload2 = {
                2: 2
            };

            inject( function( $httpBackend, $q, $http ) {

                done;

                // define our HTTP mock 1
                $httpBackend.when(
                    'POST',
                    new RegExp( 'http://api.example.com/user/.+$' ),
                    payload1
                ).respond( function( method, url, data, config ) {

                    var response = $q.defer();

                    setTimeout( function() {
                        response.resolve( [ 200, payload1, {} ] );
                    }, 500);

                    return response.promise;

                });

                // define our HTTP mock 2
                $httpBackend.when(
                    'POST',
                    new RegExp( 'http://api.example.com/user/.+$' ),
                    payload2
                ).respond( function( method, url, data, config ) {

                    var response = $q.defer();

                    setTimeout( function() {
                        response.resolve( [ 200, payload2, {} ] );
                    }, 500);

                    return response.promise;

                });

                $http({
                    method: 'POST',
                    url: 'http://api.example.com/user/11',
                    data: payload1
                }).then(
                    function success( response ) {

                        expect( response ).to.be.a( 'object' );
                        expect( response ).to.have.property( 'data' );
                        expect( response.data ).to.be.a( 'object' );

                        var data = response.data;
                        expect( data == payload1 ).to.be.ok;

                        done();

                    },
                    function error( response ) {
                        // mocked response had status 200 but the request failed...
                        done();
                    }
                );

                // test the mock
                $http({
                    method: 'POST',
                    url: 'http://api.example.com/user/11',
                    data: payload2
                }).then(
                    function success( response ) {

                        expect( response ).to.be.a( 'object' );
                        expect( response ).to.have.property( 'data' );
                        expect( response.data ).to.be.a( 'object' );

                        var data = response.data;
                        expect( data == payload2 ).to.be.ok;

                        done();
                    },
                    function error( response ) {
                        // mocked response had status 200 but the request failed...
                        done();
                    }
                );


            });
        });

        /* fix this test */
        it( 'test our data matcher', function( done ) {

            var payload1 = {
                a: 1
            };
            var payload2 = {
                b: 2
            };

            inject( function( $httpBackend, $q, $http ) {

                done;

                // define our HTTP mock 1
                $httpBackend.whenAsync(
                    'POST',
                    new RegExp( 'http://api.example.com/user/.+$' ),
                    payload1
                ).respond( function( method, url, data, config ) {

                    var response = $q.defer();

                    setTimeout( function() {
                        response.resolve( [ 200, payload1, {} ] );
                    }, 500);

                    return response.promise;

                });

                // define our HTTP mock 2
                $httpBackend.whenAsync(
                    'POST',
                    new RegExp( 'http://api.example.com/user/.+$' ),
                    payload2
                ).respond( function( method, url, data, config ) {

                    var response = $q.defer();

                    setTimeout( function() {
                        response.resolve( [ 200, payload2, {} ] );
                    }, 500);

                    return response.promise;

                });

                $http({
                    method: 'POST',
                    url: 'http://api.example.com/user/11',
                    data: payload1
                }).then(
                    function success( response ) {

                        expect( response ).to.be.a( 'object' );
                        expect( response ).to.have.property( 'data' );
                        expect( response.data ).to.be.a( 'object' );

                        var data = response.data;
                        expect( data == payload1 ).to.be.ok;

                        done();

                    },
                    function error( response ) {
                        // mocked response had status 200 but the request failed...
                        done();
                    }
                );

                // test the mock
                $http({
                    method: 'POST',
                    url: 'http://api.example.com/user/11',
                    data: payload2
                }).then(
                    function success(response) {

                        expect( response ).to.be.a( 'object' );
                        expect( response ).to.have.property( 'data' );
                        expect( response.data ).to.be.a( 'object' );

                        var data = response.data;
                        expect( data == payload2 ).to.be.ok;

                        done();
                    },
                    function error(response) {
                        // mocked response had status 200 but the request failed...
                        done();
                    }
                );


            });
        });

    });
})( angular );