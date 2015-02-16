'use strict';
/*global $:false */

angular.module('core')
  .directive('television', ['GeomUtils',
    function (GeomUtils) {
      return {
        restrict: 'E',
        controller: 'TelevisionController',
        templateUrl: 'modules/core/directives/television.html',

        scope: {
          videoClip: '=',
          playing: '='
        },

        link: function ($scope, $element, $attrs, televisionController) {

          $scope.screen = {
            width: 0,
            height: 0
          };

          televisionController.init($element);

          var tv = $element.find('.tv');
          var origTvWidth = parseFloat(tv.css('width'));
          var origTvHeight = parseFloat(tv.css('height'));

          var tvScreen = $element.find('.tv-screen');
          var origScreenOffset = {
            left: parseFloat(tvScreen.css('left')),
            top: parseFloat(tvScreen.css('top'))
          };
          var origScreenWidth = tvScreen.width();
          var origScreenHeight = tvScreen.height();

          var youtubeVideo = $element.find('youtube-video');

          var lastResizedDim = '';

          function handleResize() {

            var tvWidth = $element.parent().width();
            var tvHeight = $element.parent().height();

            var newDim = tvWidth + ',' + tvHeight;

            if (newDim === lastResizedDim) {
              return;
            }
            lastResizedDim = newDim;

            var bodyHeight = $('body').height();
            tvHeight = Math.min(tvHeight, bodyHeight - $element.offset().top);
            console.log("avail dim: (" + tvWidth + ", " + tvHeight + ")");
            
            var resizedTVBounds =
              GeomUtils.centerRectangleInRectangle(origTvWidth, origTvHeight, tvWidth, tvHeight);
            resizedTVBounds.left = Math.round(resizedTVBounds.left);
            resizedTVBounds.top = Math.round(resizedTVBounds.top);
            resizedTVBounds.width = Math.round(resizedTVBounds.width);
            resizedTVBounds.height = Math.round(resizedTVBounds.height);
            
            console.log("resizedTVBounds: (" + resizedTVBounds.width + ", " + resizedTVBounds.height + ")");
            tv.css({
              left: (resizedTVBounds.left + 'px'),
              top: (resizedTVBounds.top + 'px'),
              width: (resizedTVBounds.width + 'px'),
              height: (resizedTVBounds.height + 'px')
            });

            var scale = resizedTVBounds.height / origTvHeight;
            console.log("scale = " + scale + ", resizedTVBounds.height = " + resizedTVBounds.height +
                        ", origTvHeight = " + origTvHeight);
            tvScreen.css({
              left: (origScreenOffset.left * scale + 'px'),
              top: (origScreenOffset.top * scale + 'px'),
              width: (origScreenWidth * scale + 'px'),
              height: (origScreenHeight * scale + 'px')
            });

            $scope.screen = {
              width: tvScreen.width(),
              height: tvScreen.height()
            };
            var iframe = $element.find('iframe');
            iframe.css('width', $scope.screen.width + 'px');
            iframe.css('height', $scope.screen.height + 'px');
            iframe.attr('width', $scope.screen.width);
            iframe.attr('height', $scope.screen.height);

            if ($scope.screen.width > 0) {
              tv.css('display', 'block');
            }
          }

          // this seems wrong, but it's the only approach I've found that works reliably
          function checkResize() {
            handleResize();
            window.setTimeout(checkResize, 1);
          }
          checkResize();
        }
      };
    }])
  .controller('TelevisionController', function ($scope, $element, $attrs) {
    var self = this;
    var element = $element;

    this.init = function (element) {
      $scope.element = element;
    };

    $scope.playerVars = {
      controls: 0,
      showinfo: 0,
      rel: 0,
      autoplay: 0
    };

    $scope.$on('youtube.player.playing', function ($event, player) {
      $scope.player = player;

      var clip = $scope.currentClip;
      window.setTimeout(function () {
        player.seekTo(clip.start + clip.length);
        player.pauseVideo();
        $scope.$digest();
      }, 1000 * clip.length);

    });

    $scope.$watch('videoClip', function () {
      var videoClip = $scope.videoClip;
      $scope.currentClip = videoClip;

      $scope.playerVars = {
        controls: 0,
        showinfo: 0,
        rel: 0,
        autoplay: 1,
        loop: 0,
        start: videoClip ? videoClip.start : 0
      };
    });

    $scope.$watch('playing', function () {
      var isPlaying = $scope.playing;
      $scope.playing = false;

      if ($scope.player && isPlaying) {
        $scope.player.seekTo($scope.currentClip.start);
        $scope.player.playVideo();
      }
    });
  });