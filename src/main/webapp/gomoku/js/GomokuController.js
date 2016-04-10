var gomokuApp = angular.module('gomokuApp',[]);

gomokuApp.config(['$locationProvider', function($locationProvider) {
        $locationProvider.html5Mode(true);
    }]);

gomokuApp.factory ('onlineGameDataService', ['$interval', '$http', function($interval, $http) {
	return new OnlineGameDataService($interval, $http);
}]);

gomokuApp.controller('GomokuController', ['onlineGameDataService', '$scope', '$log', '$location', function(ods, $scope, $log, $location) {
	NGBoardBaseController(15, 15, $scope, $log);
	NGOnlineGameController($scope, $log, ods, $location);
	
	var fctns = {} ;
	fctns.empty = " ";
	fctns.setInitPosition = function(bm) {
		for (var row = 0; row < bm.length; row++) {
			for (var col = 0; col < bm[row].length; col++) {
				bm[row][col] = " ";
			}
		}
	}
	
	$scope.cellTemplate = "../ang-common-templates/tmpl-cell-img.html";

	$scope.imgMap = {};
	$scope.imgMap[' '] = "../images/blank.gif";
	$scope.imgMap['x'] = "cross.gif";
	$scope.imgMap['o'] = "nots.gif";

	var firstPlayer = "x";
	var gameData = null;
	
	$scope.initialize = function() {
		gameData = {"moves":[], "turn": firstPlayer};
		fctns.setInitPosition($scope.bm);	
	}
	
	$scope.cellimg = function(row, col) {
		return $scope.imgMap[$scope.bm[row][col]];
	}

	$scope.onClick = function($event, row, col) {		
		if ($scope.bm[row][col] == " ") {
			$scope.bm[row][col] = gameData.turn;
			var move = {r: row, c: col, t: gameData.turn};
			gameData.moves.push(move);
			gameData.turn = gameData.turn == "o"? "x" : "o";
			if ($scope.onlineGame() == true) {
				ods.publish($scope.gameid, JSON.stringify(gameData));
			}
		}
 	}

	$scope.back = function () {
		var move = gameData.moves.pop();
		$scope.bm[move.r][move.c] = " ";
		gameData.turn = move.t;
		if ($scope.onlineGame() == true) {
			ods.publish($scope.gameid, JSON.stringify(gameData));
		}
	}

	$scope.newGame = function () {
		for (var row = 0; row < $scope.bm.length; row++) {
			for (var col = 0; col < $scope.bm[row].length; col++) {
				$scope.bm[row][col] = " ";
			}
		}	
		$scope.gameData.turn = firstPlayer;
	}
	
	$scope.newOnlineGame = function() {
		$scope.initialize();
		$scope.setNewOnlineGameUrl();
	}
	
	$scope.onlineGameWatchCallBack = function(gameid, gamedata) {		
		fctns.setInitPosition($scope.bm);
		for (var i = 0; i < gamedata.moves.length; i++) {
			var m = gamedata.moves[i];
			$scope.bm[m.r][m.c] = m.t;			
		}
		gameData = gamedata;		
	}
	
	$scope.initialize();
}]);
