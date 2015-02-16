'use strict';

//Setting up route
angular.module('clips').config(['$stateProvider',
	function($stateProvider) {
		// Clips state routing
		$stateProvider.
		state('listClips', {
			url: '/clips',
			templateUrl: 'modules/clips/views/list-clips.client.view.html'
		}).
		state('createClip', {
			url: '/clips/create',
			templateUrl: 'modules/clips/views/create-clip.client.view.html'
		}).
		state('viewClip', {
			url: '/clips/:clipId',
			templateUrl: 'modules/clips/views/view-clip.client.view.html'
		}).
		state('editClip', {
			url: '/clips/:clipId/edit',
			templateUrl: 'modules/clips/views/edit-clip.client.view.html'
		});
	}
]);