//-------------------------- Prep:

//-------------------------- Tests:
(function( ng ) {
    describe( 'ngMockAsync Test', function() {

        it( 'test module init', function() {

            var app = ng.module( 'mockApp', [ 'ngMockE2EAsync' ] );

        });

    });

    describe( 'ngMockAsync Test 2', function() {

        it( 'test module init2', function() {

            var app = ng.module( 'mockApp', [ 'ngMockE2EAsync' ] );

        });

    });
})( angular );