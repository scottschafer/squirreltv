'use strict';

//Clips service used to communicate Clips REST endpoints
angular.module('clips').factory('Clips', ['$resource',
 function ($resource) {
    return $resource('clips/:clipId', {
      clipId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
 }
]);