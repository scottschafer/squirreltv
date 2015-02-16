'use strict';

angular.module('core').factory('GeomUtils', [
 function () {
    // Geomutils service logic

    // Public API
    return {
      // center and scale a child rectangle (specified by width & height) inside the
      // parent rectangle, maintaining the child rectangle's aspect ratio, applying an
      // optional margin, and optional constraints on the child scaling.
      centerRectangleInRectangle: function (childWidth, childHeight, parentWidth,
        parentHeight, margin, minScaling, maxScaling) {

        if (typeof margin === 'undefined') {
          margin = 0;
        } else {
          parentWidth -= margin + margin;
          parentHeight -= margin + margin;
        }

        var childAR = childWidth / childHeight;
        var parentAR = parentWidth / parentHeight;

        var scale;
        if (childAR > parentAR) {
          scale = parentWidth / childWidth;
        } else {
          scale = parentHeight / childHeight;
        }

        if (typeof minScaling !== 'undefined') {
          scale = Math.max(scale, minScaling);
        }

        if (typeof maxScaling !== 'undefined') {
          scale = Math.min(scale, maxScaling);
        }

        var result = {};
        result.width = childWidth * scale;
        result.height = childHeight * scale;
        result.left = margin + (parentWidth - result.width) / 2;
        result.top = margin + (parentHeight - result.height) / 2;

        return result;
      }
    };
 }
]);