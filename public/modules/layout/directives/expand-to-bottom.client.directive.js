'use strict';

/**
 * expandToBottom - expands the element from its current top to the bottom of the window.
 * seems like there should be a clean CSS way to do this, but I haven't found one yet.
 */
angular.module('layout').directive('expandToBottom', ['$window', function ($window) {

  return {
    restrict: 'A',

    link: function (scope, element, attrs, ngModel) {

      var debug = false;

      function resizeElement() {
        var bodyHeight = $(window).innerHeight();
        var elementTop = element.offset().top;
        var height = bodyHeight - elementTop;
        element.height(height);

        if (debug) {
          console.log("bodyHeight = " + bodyHeight + ", elementTop = " + elementTop);
          if ($("#test_expandToBottom1").length == 0) {
            $("body").append(
              '<div id="test_expandToBottom1" style="z-index:100;position:absolute;top:0px;width:20px;background-color:red;border-radius:20px"></div> \
  <div id="test_expandToBottom2" style="z-index:101;position:absolute;top:0px;width:20px;background-color:blue;border-radius:20px"></div>');
          }

          $("#test_expandToBottom1").height(elementTop);
          $("#test_expandToBottom2").height(height);
          $("#test_expandToBottom2").css("top", elementTop + "px");
        }
      }

      scope.$watch(
        function () {
          return element.width() + "x" + element.height() + ":" + element.offset().top;
        },
        function (value) {
          console.log('directive got resized:', value.split('x'));
          resizeElement();
        }
      )

      $(window).resize(resizeElement);
      resizeElement();
    }
  }
}]);