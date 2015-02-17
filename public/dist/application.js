'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'youtubesw';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils', 'youtube-embed'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('clips');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('layout');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('settings');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Configuring the Articles module
angular.module('clips').run(['Menus',
 function (Menus) {
    // Set top bar menu items
    /*
		Menus.addMenuItem('topbar', 'Clips', 'clips', 'dropdown', '/clips(/create)?');
		Menus.addSubMenuItem('topbar', 'clips', 'List Clips', 'clips');
		Menus.addSubMenuItem('topbar', 'clips', 'New Clip', 'clips/create');
    */
 }
]);
'use strict';

//Setting up route
angular.module('clips').config(['$stateProvider',
	function($stateProvider) {
		// Clips state routing
		$stateProvider.
		state('listClips', {
			url: '/clips',
			templateUrl: 'modules/clips/views/list-clips.client.view.html'
		}).
		state('createClip', {
			url: '/clips/create',
			templateUrl: 'modules/clips/views/create-clip.client.view.html'
		}).
		state('viewClip', {
			url: '/clips/:clipId',
			templateUrl: 'modules/clips/views/view-clip.client.view.html'
		}).
		state('editClip', {
			url: '/clips/:clipId/edit',
			templateUrl: 'modules/clips/views/edit-clip.client.view.html'
		});
	}
]);
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
'use strict';

angular.module('clips').
service('ClipService', ['Clips', function (Clips) {

  return {
    // call to get all clips
    getClips: function () {
      // TODO, return only public clips and clips belonging to signed in user
      return Clips.query();

      /*
      
//      var clips = $http.get('/api/clips');
     // console.log('api/clips = ' + JSON.stringify(clips));
      var clips = [{
          id: 'IANwb_qT1gg',
          start: 78,
          length: 7.9,
          text: 'The squirrel steals the plane'
          },
        {
          id: 'Y54BnU73CQA',
          start: 25,
          length: 15,
          text: 'The man steals the plane'
          },
        {
          id: '9J4Vjc9jMq0',
          start: 23,
          length: 15,
          text: 'The squirrel steals the corn'
          }
        ];
      return clips;
      */
    },

    getSentencePatterns: function (clips) {
      var clipsWords = [];

      for (var i = 0; i < clips.length; i++) {
        var text = clips[i].text;
        var textWords = text.split(' ');
        if (i === 0 || textWords.length === clipsWords[0].length) {
          clipsWords.push(textWords);
        }
      }

      var uniqueWordsInEachPosition = [];
      var result = [];

      for (i = 0; i < clipsWords.length; i++) {
        var clipWords = clipsWords[i];

        for (var j = 0; j < clipWords.length; j++) {
          var uniqueWordsInPosition = {};
          if (uniqueWordsInEachPosition.length <= j) {
            uniqueWordsInEachPosition.push(uniqueWordsInPosition);
            result.push([]);
          } else {
            uniqueWordsInPosition = uniqueWordsInEachPosition[j];
          }
          uniqueWordsInPosition[clipWords[j]] = true;
        }
      }

      for (i = 0; i < uniqueWordsInEachPosition.length; i++) {
        for (var key in uniqueWordsInEachPosition[i]) {
          result[i].push(key);
        }
      }

      return result;

    }
  }
}]);
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
 function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');

    // Home state routing
    $stateProvider.
    state('clips', {
      url: '/clips',
      templateUrl: 'modules/clips/views/list-clips.client.view.html'
    }).
    state('quiz', {
      url: '/quiz',
      templateUrl: 'modules/core/views/quiz.client.view.html'
    }).
    state('explore', {
      url: '/explore',
      templateUrl: 'modules/core/views/explore.client.view.html'
    }).
    state('home', {
      url: '/',
      templateUrl: 'modules/core/views/home.client.view.html'
    });
 }
]);
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
'use strict';

angular.module('core').
controller('ExploreController', ['$scope', 'TTSService', 'ClipService', function ($scope, TTSService, ClipService) {

  $scope.showSentence = false;
  $scope.currentClip = 0;

  $scope.clip = null;

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
      $scope.sentenceOptions[i].selectedWord = '';
    }
  }


  $scope.nextClip = function () {
    $scope.showSentence = false;
    $scope.currentClip = ($scope.currentClip + 1) % $scope.clips.length;
    var clip = $scope.clips[$scope.currentClip];

    var words = clip.text.split(' ');
    var sentenceOptions = [];

    var patterns = ClipService.getSentencePatterns($scope.clips);

    for (var i = 0; i < words.length; i++) {
      var word = {
        selectedWord: '',
        options: patterns[i]
      };

      sentenceOptions.push(word);
    }
    $scope.sentenceOptions = sentenceOptions;
  }

  $scope.$watch('sentence', function () {
    var sentence = $scope.sentence;
    if (sentence) {
      if (sentence.indexOf('  ') != -1) {
        $scope.sentenceComplete = false;
      } else {
        $scope.sentenceComplete = true;
        for (var i = 0; i < $scope.clips.length; i++) {
          var clip = $scope.clips[i];
          if (clip.text == sentence) {
            $scope.clip = clip;
            $scope.playing = true;
            break;
          }
        }
      }
    }

  });

  $scope.init();

}]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
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
  .controller('TelevisionController', ["$scope", "$element", "$attrs", function ($scope, $element, $attrs) {
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
  }]);
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
  .controller('wordChooserController', ["$scope", "$element", "$attrs", "$animate", "TTSService", function ($scope, $element, $attrs, $animate, TTSService) {
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
  }]);
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
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
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
'use strict';

//Setting up route
angular.module('settings').config(['$stateProvider',
	function($stateProvider) {
		// Settings state routing
		$stateProvider.
		state('listSettings', {
			url: '/settings',
			templateUrl: 'modules/settings/views/list-settings.client.view.html'
		}).
		state('createSetting', {
			url: '/settings/create',
			templateUrl: 'modules/settings/views/create-setting.client.view.html'
		}).
		state('viewSetting', {
			url: '/settings/:settingId',
			templateUrl: 'modules/settings/views/view-setting.client.view.html'
		}).
		state('editSetting', {
			url: '/settings/:settingId/edit',
			templateUrl: 'modules/settings/views/edit-setting.client.view.html'
		});
	}
]);
'use strict';

// Settings controller
angular.module('settings').controller('SettingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Settings',
	function($scope, $stateParams, $location, Authentication, Settings) {
		$scope.authentication = Authentication;

		// Create new Setting
		$scope.create = function() {
			// Create new Setting object
			var setting = new Settings ({
				name: this.name
			});

			// Redirect after save
			setting.$save(function(response) {
				$location.path('settings/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Setting
		$scope.remove = function(setting) {
			if ( setting ) { 
				setting.$remove();

				for (var i in $scope.settings) {
					if ($scope.settings [i] === setting) {
						$scope.settings.splice(i, 1);
					}
				}
			} else {
				$scope.setting.$remove(function() {
					$location.path('settings');
				});
			}
		};

		// Update existing Setting
		$scope.update = function() {
			var setting = $scope.setting;

			setting.$update(function() {
				$location.path('settings/' + setting._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Settings
		$scope.find = function() {
			$scope.settings = Settings.query();
		};

		// Find existing Setting
		$scope.findOne = function() {
			$scope.setting = Settings.get({ 
				settingId: $stateParams.settingId
			});
		};
	}
]);
'use strict';

//Settings service used to communicate Settings REST endpoints
angular.module('settings').factory('Settings', ['$resource',
	function($resource) {
		return $resource('settings/:settingId', { settingId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
 function ($scope, $http, $location, Authentication) {
    $scope.authentication = Authentication;

    var redirectTo = '/';
    var search = $location.search();
    if (search && search.hasOwnProperty('next')) {
      redirectTo += search.next;
    }

    // If user is signed in then redirect back home
    if ($scope.authentication.user) $location.path(redirectTo);

    $scope.signup = function () {
      $http.post('/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the index page
        $location.search({});
        $location.path(redirectTo);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function () {
      $http.post('/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the index page
        $location.search({});
        $location.path(redirectTo);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
 }
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);