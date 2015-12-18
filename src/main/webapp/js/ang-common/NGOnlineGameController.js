function NGOnlineGameController($scope, $log, ods, $location) {

	var qs = $location.search();
	$scope.gameid = qs['gameid'];

	$scope.$on('$locationChangeSuccess', function () {
		$log.log('$locationChangeSuccess in subscope changed!', new Date());
		var qs = $location.search();
		if (typeof($scope.gameid) != 'undefined' && $scope.gameid != null) {
			ods.unwatch($scope.gameid);
		}
		$scope.gameid = qs['gameid'];
		if (typeof($scope.gameid) != 'undefined') {
			ods.watch($scope.gameid, $scope.watchCallBack);
		}
		$log.log($scope.gameid);
	});

	$scope.onlineGame = function() {
		if (typeof($scope.gameid) != 'undefined' && $scope.gameid != null) {
			return true;
		} 
		return false;
	}

	$scope.watchCallBack = function(gamedata) {
	}

	$scope.setNewOnlineGameUrl = function() {
		$location.search('gameid', ods.guid());
	}
}

