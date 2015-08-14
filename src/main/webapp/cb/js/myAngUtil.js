var myUtilModule = angular.module('myUtilModule', []).

directive('focusOn', function factory() {
	var directiveDefinitionObject = {
		link: function postLink(scope, iElement, iAttrs) {
			scope.$watch(iAttrs.focusOn, function(newVal) {
				if (newVal) {
					iElement[0].focus();
				}
			});
		}
	}
	return directiveDefinitionObject;
});
