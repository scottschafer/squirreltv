'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
 function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');

    // Home state routing
    $stateProvider.
    state('clips', {
      url: '/clips',
      templateUrl: 'modules/clips/views/list-clips.client.view.html'
    }).
    state('quiz', {
      url: '/quiz',
      templateUrl: 'modules/core/views/quiz.client.view.html'
    }).
    state('explore', {
      url: '/explore',
      templateUrl: 'modules/core/views/explore.client.view.html'
    }).
    state('home', {
      url: '/',
      templateUrl: 'modules/core/views/home.client.view.html'
    });
 }
]);