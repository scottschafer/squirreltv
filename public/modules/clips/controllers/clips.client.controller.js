'use strict';

// Clips controller
angular.module('clips').controller('ClipsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Clips',
function ($scope, $stateParams, $location, Authentication, Clips) {
    $scope.authentication = Authentication;

    $scope.playerVars = {
      controls: 0
    };

    $scope.clip = {};

    $scope.isLoggedIn = function (user) {
      return !!user;
    };

    // Create new Clip
    $scope.create = function () {
      // Create new Clip object
      var clip = new Clips({
        text: this.clip.text,
        clipId: this.clip.clipId,
        start: this.clip.start,
        length: this.clip.length,
        public: this.clip.public
      });

      // Redirect after save
      clip.$save(function (response) {
        $location.path('clips'); ///' + response._id);

        // Clear form fields
        $scope.name = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.editClip = function (clip) {
      $location.path('clips/' + clip._id + '/edit');
    }

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
          $location.path('clips');
        });
      }
    };

    // Update existing Clip
    $scope.update = function () {
      var clip = $scope.clip;

      clip.$update(function () {
        $location.path('clips'); ///' + clip._id);
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
      Clips.get({
        clipId: $stateParams.clipId
      }).$promise.then(
        function (clip) {
          $scope.clip = clip;
        },
        function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
    };
  }
]);