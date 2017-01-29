# angular-mocks-async
AngularJS ngMockE2E Async
<br><br>

Angular 1.3.0 [![CircleCI](https://circleci.com/gh/amoldavsky/angular-mocks-async/tree/master.svg?style=shield)](https://circleci.com/gh/amoldavsky/angular-mocks-async)

Angular 1.5.8 [![CircleCI](https://circleci.com/gh/amoldavsky/angular-mocks-async/tree/master.svg?style=shield)](https://circleci.com/gh/amoldavsky/angular-mocks-async)

[![codecov](https://codecov.io/gh/amoldavsky/angular-mocks-async/branch/master/graph/badge.svg)](https://codecov.io/gh/amoldavsky/angular-mocks-async)
<br><br>

An abstraction on top of ngMockE2E to support async calls using promises. 

If you need to make an async operation ( such as working with WebSQL / IndexedDB ) the orignial ngMockE2E will fall through and you will never have the chance to respond with your own response.

ngMockE2EAsync decorates the $httpBackend by utilizing promises. Responses can now be in a form of a promise where the $httpBackend will original function will not be called until your promise has been resolved. Once resolved the original $httpBackend APIs will be called and things will flow their natural ways back to the caller.

## Demo
[jsFiddle](https://jsfiddle.net/amoldavsky/omw8m23L/) [Plunker](https://plnkr.co/edit/IWtaW9?p=preview)

## Install

```html
<script src="angular.js"></script>
<script src="angular-mocks.js"></script>
<script src="//cdn.rawgit.com/amoldavsky/angular-mocks-async/master/src/angular-mocks-async.js"></script>
```

## Usage

The decorator exposes a new API
```javascript
	$httpBackend.whenAsync()
```
Which is equivalent to the $httpBackend.when() API but expects a promise in the .respond() function.

Here is an example for an HTTP GET
```javascript
(function( ng ) {

	var app = ng.module('myApp', ['ngMockE2E', 'ngMockE2EAsync'])
	
	app.run( [ '$httpBackend', '$q', function( $httpBackend, $q ) {

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
			    response.resolve( [ 200, "this is a mocked async GET response", "123" ] );

			}, 1000 );

			return response.promise;

		});
		
		$http({
			url: "http://api.example.com/user/103",
			method: 'GET'
		}).then( function( response ) {
			alert( response.data );
		});
	}]);
}(angular);
```
You may use this API the same way for POST, PUT, UPDATE, and DELETE.

## Details

The code adds a custom decorator function to the existing angular mock namespace which already hold similar decorator functions - angular.mock.$HttpBackendAsyncDecorator.

## Developing & Testing

gulpfile.js has the following tasks:
```
compile
test-unminified
test-minified
```
Please be sure to run these tests when making changes


## License
MIT
