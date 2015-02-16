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