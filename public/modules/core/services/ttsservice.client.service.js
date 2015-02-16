'use strict';

angular.module('core').factory('TTSService', [
 function () {
    // Public API

    return {
      speak: function (text) {
        if ('speechSynthesis' in window) {
          var msg = new window.SpeechSynthesisUtterance(text);
          window.speechSynthesis.speak(msg);
        }
      }
    };
 }
]);