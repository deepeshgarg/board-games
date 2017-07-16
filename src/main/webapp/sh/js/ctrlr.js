var shMod = angular.module('shMod',[]);

shMod.controller('SHController', ['$scope', '$log', '$window', 'dictService', function ($s, $log, win, ds) {
  $s.letters = '';
  $s.pattern = '';
  $s.matchingWords = [];

  $s.search = function(pattern, letters) {
	  $s.matchingWords.length = 0;
	  $s.matchingWords = ds.findPatternContaingLetters(pattern, letters);
  }

  $s.showDefinition = function(word) {
	  var url = 'https://www.google.co.uk?#q=define+' + word; 
	  win.open(url, 'definition');
	  $log.log(url);
  }

}]);

shMod.factory('dictService', [ function() {
	return new DictService();
}]);
