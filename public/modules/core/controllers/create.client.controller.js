'use strict';

angular.module('core').controller('CreateController', [
  '$scope', '$stateParams', '$location', 'Authentication', 'Clips',

 function ($scope, $stateParams, $location, Authentication, Clips) {
    $scope.authentication = Authentication;

    $scope.isLoggedIn = function (user) {
      return !!user;
    };

    $scope.playerVars = {
      controls: 0
    };

    // Create new Clip
    $scope.create = function () {
      // Create new Clip object
      var clip = new Clips({
        text: this.text,
        clipId: this.clipId,
        start: this.start,
        length: this.length,
        public: this.public
      });

      // Redirect after save
      clip.$save(function (response) {
        $location.path('create/' + response._id);

        // Clear form fields
        $scope.name = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Clip
    $scope.remove = function (clip) {
      if (clip) {
        clip.$remove();

        for (var i in $scope.clips) {
          if ($scope.clips[i] === clip) {
            $scope.clips.splice(i, 1);
          }
        }
      } else {
        $scope.clip.$remove(function () {
          $location.path('create');
        });
      }
    };

    $scope.edit = function (clip) {

      }
      // Update existing Clip
    $scope.update = function () {
      var clip = $scope.clip;

      clip.$update(function () {
        $location.path('create/' + clip._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Clips
    $scope.find = function () {
      $scope.clips = Clips.query();
    };

    // Find existing Clip
    $scope.findOne = function () {
      $scope.clip = Clips.get({
        clipId: $stateParams.clipId
      });
    };
 }
]);