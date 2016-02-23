# angular-mocks-async
AngularJS ngMockE2E Async

An abstraction on top of ngMockE2E to support async calls using promises. 

If you need to make an async operation ( such as working with WebSQL / IndexedDB ) the orignial ngMockE2E will fall through and you will never have the chance to respond with your own response.

ngMockE2EAsync decorates the $httpBackend by utilizing promises. Responses can now be in a form of a promise where the $httpBackend will original function will not be called until your promise has been resolved. Once resolved the original $httpBackend APIs will be called and things will flow their natural ways back to the caller.

## Install

TODO: add throgh bower

## Usage

```html
<script src="angular-mocks.js"></script>
<script src="angular-mocke-async.js"></script>
```

The decorator exposes a new API
```javascript
	$httpBackend.whenAsync()
```
Which is equivalent to the $httpBackend.when() API but expects a promise in the .respond() function.

Here is an example for an HTTP GET
```javascript
(function( ng ) {

	var app = ng.module('myApp', ['ngMockE2E', 'ngMockE2EAsync'])
	
	app.run( [ '$httpBackend', function( $httpBackend ) {

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
	}]);
}(angular);
```
You may use this API the same way for POST, PUT, UPDATE, and DELETE.


## Details

The code adds a custom decorator function to the existing angular mock namespace which already hold similar decorator functions - angular.mock.$HttpBackendAsyncDecorator.


## License
MIT
