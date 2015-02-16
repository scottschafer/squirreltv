'use strict';
/*global $:false */

angular.module('core').directive('wordChooser', function () {
    return {
      restrict: 'E',
      controller: 'wordChooserController',
      templateUrl: 'modules/core/directives/word-chooser.html',
      require: 'ngModel',
      scope: {
        word: '=ngModel',
      },

      link: function (scope, element, attrs, ngModel) {
        scope.ngModel = ngModel;
        scope.$watch('word.options', function () {
          if (scope.word.options.length === 1) {
            scope.word.selectedWord = scope.word.options[0];
          }
        });
      }
    };
  })
  .controller('wordChooserController', function ($scope, $element, $attrs, $animate, TTSService) {
    var self = this;
    var element = $element;

    $scope.element = $element;

    $scope.selectWord = function (word) {
      TTSService.speak(word);

      $scope.word.selectedWord = word;

      var options = $scope.word.options;
      for (var i = 0; i < options.length; i++) {
        if (options[i] === word) {
          break;
        }
      }

      var element = $scope.element;
      var wordButtons = element.find('.word-button');
      if (i < wordButtons.length) {
        var wordButton = wordButtons.eq(i);

        var buttonOffset = wordButton.offset();
        var wordSelectionContainer = element.find('.word-selection-container');

        var buttonContainerAdj = (wordSelectionContainer.height() - wordButton.height()) / 2;

        var buttonContainerOffset = wordSelectionContainer.parent().offset();

        var topOffset = '+=' + (buttonContainerOffset.top - buttonOffset.top + buttonContainerAdj);
        $(wordSelectionContainer).animate({
          top: topOffset
        }, 1000, function () {});

      }
    };
  });