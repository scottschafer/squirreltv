'use strict';

(function() {
	// Clips Controller Spec
	describe('Clips Controller Tests', function() {
		// Initialize global variables
		var ClipsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Clips controller.
			ClipsController = $controller('ClipsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Clip object fetched from XHR', inject(function(Clips) {
			// Create sample Clip using the Clips service
			var sampleClip = new Clips({
				name: 'New Clip'
			});

			// Create a sample Clips array that includes the new Clip
			var sampleClips = [sampleClip];

			// Set GET response
			$httpBackend.expectGET('clips').respond(sampleClips);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.clips).toEqualData(sampleClips);
		}));

		it('$scope.findOne() should create an array with one Clip object fetched from XHR using a clipId URL parameter', inject(function(Clips) {
			// Define a sample Clip object
			var sampleClip = new Clips({
				name: 'New Clip'
			});

			// Set the URL parameter
			$stateParams.clipId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/clips\/([0-9a-fA-F]{24})$/).respond(sampleClip);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.clip).toEqualData(sampleClip);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Clips) {
			// Create a sample Clip object
			var sampleClipPostData = new Clips({
				name: 'New Clip'
			});

			// Create a sample Clip response
			var sampleClipResponse = new Clips({
				_id: '525cf20451979dea2c000001',
				name: 'New Clip'
			});

			// Fixture mock form input values
			scope.name = 'New Clip';

			// Set POST response
			$httpBackend.expectPOST('clips', sampleClipPostData).respond(sampleClipResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Clip was created
			expect($location.path()).toBe('/clips/' + sampleClipResponse._id);
		}));

		it('$scope.update() should update a valid Clip', inject(function(Clips) {
			// Define a sample Clip put data
			var sampleClipPutData = new Clips({
				_id: '525cf20451979dea2c000001',
				name: 'New Clip'
			});

			// Mock Clip in scope
			scope.clip = sampleClipPutData;

			// Set PUT response
			$httpBackend.expectPUT(/clips\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/clips/' + sampleClipPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid clipId and remove the Clip from the scope', inject(function(Clips) {
			// Create new Clip object
			var sampleClip = new Clips({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Clips array and include the Clip
			scope.clips = [sampleClip];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/clips\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleClip);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.clips.length).toBe(0);
		}));
	});
}());