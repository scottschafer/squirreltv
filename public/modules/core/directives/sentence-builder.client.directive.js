'use strict';

angular.module('core').directive('sentenceBuilder', function () {
  return {
    restrict: 'E',
    templateUrl: 'modules/core/directives/sentence-builder.html',
    require: 'ngModel',

    scope: {
      sentenceOptions: '='
    },

    link: function (scope, element, attrs, ngModel) {
      scope.ngModel = ngModel;

      scope.getSelectedSentence = function () {
        var result = '';

        if (scope.sentenceOptions) {
          for (var i = 0; i < scope.sentenceOptions.length; i++) {
            if (i > 0) {
              result += ' ';
            }
            var selectedWord = scope.sentenceOptions[i].selectedWord;
            if (selectedWord.length === 0) {
              selectedWord += ' ';
            }
            result += selectedWord;
          }
        }

        return result;
      };

      scope.$watch('getSelectedSentence()', function () {
        var sentence = scope.getSelectedSentence();
        ngModel.$setViewValue(sentence);
      });
    }
  };
});