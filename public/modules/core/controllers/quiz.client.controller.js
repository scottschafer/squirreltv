'use strict';

angular.module('core').
controller('QuizController', ["$scope", "TTSService", "ClipService", function ($scope, TTSService, ClipService) {

  $scope.showSentence = false;
  $scope.clips = ClipService.getClips();
  $scope.currentClip = 0;

  $scope.init = function () {
    ClipService.getClips().$promise.then(
      function (clips) {
        $scope.clips = clips;
        $scope.currentClip = -1;
        $scope.nextClip();
      },
      function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
  }

  $scope.$on('youtube.player.paused', function ($event, player) {
    $scope.showSentence = true;
  });

  $scope.replay = function () {
    $scope.showSentence = false;
    $scope.playing = true;
    for (var i = 0; i < $scope.sentenceOptions.length; i++) {
      $scope.sentenceOptions[i].selectedWord = "";
    }
  }

  $scope.nextClip = function () {
    $scope.showSentence = false;
    $scope.currentClip = ($scope.currentClip + 1) % $scope.clips.length;
    var clip = $scope.clips[$scope.currentClip];

    var words = clip.text.split(" ");
    var sentenceOptions = [];

    var patterns = ClipService.getSentencePatterns($scope.clips);

    for (var i = 0; i < words.length; i++) {
      var word = {
        selectedWord: "",
        options: patterns[i]
      };

      sentenceOptions.push(word);
    }
    $scope.sentenceOptions = sentenceOptions;
  }

  $scope.$watch("sentence", function () {
    if ($scope.sentence && $scope.clips.length > $scope.currentClip) {
      $scope.sentenceComplete = $scope.sentence.indexOf('  ') == -1;
      $scope.sentenceCorrect = $scope.sentence == $scope.clips[$scope.currentClip].text;
      if ($scope.sentenceComplete) {
        TTSService.speak($scope.sentence + ($scope.sentenceCorrect ? "!" : "?"));
      }
    } else {
      $scope.sentenceComplete = false;
    }
  });

  $scope.init();

}]);