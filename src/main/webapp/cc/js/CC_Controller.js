var myApp = angular.module('myApp',[]);

myApp.config(['$locationProvider', function($locationProvider) {
        $locationProvider.html5Mode(true);
    }]);

myApp.factory ('onlineGameDataService', ['$interval', '$http', function($interval, $http) {
	return new OnlineGameDataService($interval, $http);
}]);

myApp.controller('CCController', ['onlineGameDataService', '$scope', '$log', '$location', function(ods, $scope, $log, $location) {

	fctns = {} ;
	fctns.empty = " ";
	fctns.initPosition = null;

	fctns.startStop = [[0, 12, 12, 'p1'],
	    		 [1, 11, 13, 'p1'],
			 [2, 10, 14, 'p1'],
			 [3, 9, 15, 'p1'],
			 [4, 0, 6, 'p2'], [4, 8, 16, 'e'], [4, 18, 24, 'p3'],
			 [5, 1, 5, 'p2'], [5, 7, 17, 'e'], [5, 19, 23, 'p3'],
			 [6, 2, 4, 'p2'], [6, 6, 18, 'e'], [6, 20, 22, 'p3'],
			 [7, 3, 3, 'p2'], [7, 5, 19, 'e'], [7, 21, 21, 'p3'],
			 [8, 4, 20, 'e'],
	                 [9, 3, 3, 'p4'], [9, 5, 19, 'e'], [9, 21, 21, 'p5'],
			 [10, 2, 4, 'p4'], [10, 6, 18, 'e'], [10, 20, 22, 'p5'],
			 [11, 1, 5, 'p4'], [11, 7, 17, 'e'], [11, 19, 23, 'p5'],
			 [12, 0, 6, 'p4'], [12, 8, 16, 'e'], [12, 18, 24, 'p5'],
			 [13, 9, 15, 'p6'],
			 [14, 10, 14, 'p6'],
			 [15, 11, 13, 'p6'],
			 [16, 12, 12, 'p6']];

	fctns.getInitPosition = function(players) {
		if (fctns.initPosition == null) {
			fctns.initPosition = new Array(17);
			for (var i = 0; i < fctns.initPosition.length; i++) {
				fctns.initPosition[i] = new Array(25);
			}
		}
		for (var r = 0; r < fctns.initPosition.length; r++) {
			for (var c = 0; c < fctns.initPosition[r].length; c++) {
				fctns.initPosition[r][c] = fctns.empty;
			}
		}
		for (var i = 0; i < fctns.startStop.length; i++) {
			for (var col = fctns.startStop[i][1]; col <= fctns.startStop[i][2]; col+=2) {
				fctns.initPosition[fctns.startStop[i][0]][col] = players[fctns.startStop[i][3]];
			}
		}
		return fctns.initPosition;
	}

	fctns.copyPosition = function(p1, p2) {
		if (p1.length == p2.length) {
			for (var r = 0; r < p1.length; r++) {
				if (p1[r].length == p2[r].length) {
					for (var c = 0; c < p1[r].length; c++) {
						p2[r][c] = p1[r][c];
					}
				}
			}
		}
	}

	var empty = " ";

	var lastCell = null;
	var gameData = null;
	var s1 = null;
	var s2 = null;
	var s3 = null;

	$scope.players = {e: "e", p1:"b", p2:"e", p3:"e", p4:"e", p5:"e", p6:"r"};
	$scope.playerOptions = [{label: "Red", color: "r"}, {label: "Blue", color: "b"}, {label: "Orange", color: "o"}, {label: "Green", color: "g"},
	                        {label: "Purple", color: "p"}, {label: "Yellow", color: "y"}, {label: "None", color: "e"}];

	$scope.initialize = function() {
		lastCell = null;
		gameData = {"moves":[], "players": $scope.players};
		s1 = null;
		s2 = null;
		s3 = null;
		fctns.copyPosition(fctns.getInitPosition($scope.players), $scope.bm);
		$scope.selectingPlayers = false;
	}

	$scope.flipBoard = false;

	NGBoardBaseController(17, 25, $scope, $log);
	NGOnlineGameController($scope, $log, ods, $location);
	$scope.initialize();

	var imgMap = {};
	imgMap['e'] = "../cc/images/blank.png";
	imgMap[' '] = "../cc/images/blank.png";
	imgMap['r'] = "../cc/images/r.png";
	imgMap['y'] = "../cc/images/y.png";
	imgMap['g'] = "../cc/images/g.png";
	imgMap['b'] = "../cc/images/b.png";
	imgMap['o'] = "../cc/images/o.png";
	imgMap['p'] = "../cc/images/p.png";

	$scope.cellimg = function(row, col) {
		return imgMap[$scope.bm[row][col]];
	}

	$scope.cellTemplate = "../ang-common-templates/tmpl-cell-img.html";
	

	$scope.flipChanged = function() {
		if ($scope.flipBoard) {
    			$scope.boardTemplate = "../../ang-common-templates/tmpl-down-board.html";
		} else {
    			$scope.boardTemplate = "../../ang-common-templates/tmpl-up-board.html";
		}
	}

	$scope.onClick = function($event, row, col) {
		if ($scope.bm[row][col] != " " && $scope.bm[row][col] != "e") {
			if (lastCell == null) {
				lastCell = {r: row, c: col};
			} else {
				lastCell.r = row;
				lastCell.c = col;
			}
			s3 = lastCell;
		} else if ($scope.bm[row][col] == "e") {
			$scope.bm[row][col] = $scope.bm[lastCell.r][lastCell.c] ;
			$scope.bm[lastCell.r][lastCell.c] = "e";
			s1 = {r: lastCell.r, c: lastCell.c};
			s2 = {r: row, c: col};
			gameData.moves.push({f:{r: lastCell.r, c: lastCell.c}, t:{r: row, c: col}});
			if ($scope.onlineGame() == true) {
				$log.log(JSON.stringify(gameData));
				ods.publish($scope.gameid, JSON.stringify(gameData));
			}
		}
 	}

	$scope.selectPlayersMode = function() {
		$scope.selectingPlayers = true;
	}

	$scope.completeSelection = function() {
		$scope.selectingPlayers = false;
		$scope.initialize();
		gameData.players = $scope.players;
		if ($scope.onlineGame() == true) {
			$log.log(JSON.stringify(gameData));
			ods.publish($scope.gameid, JSON.stringify(gameData));
		}
	}

	$scope.cancelSelection = function() {
		$scope.selectingPlayers = false;
	}


	$scope.cellClass = function(r, c) {
		var cls = "";
		if ($scope.bm[r][c] != empty) {
			cls += " cell-class-pit";
		} else {
			cls += " cell-class-empty";
		}
		if (s1 != null) {
			if (s1.r == r && s1.c == c) {
				cls += " selected";
			}
		}
		if (s2 != null) {
			if (s2.r == r && s2.c == c) {
				cls += " selected";
			}
		}
		if (s3 != null) {
			if (s3.r == r && s3.c == c) {
				cls += " selected";
			}
		}

		return cls;
	}

	$scope.watchCallBack = function(gamedata) {
		$log.log("watch CallBack " + JSON.stringify(gamedata));
		var initPosition = fctns.getInitPosition(gamedata.players);
		for (var i = 0; i < gamedata.moves.length; i++) {
			var m = gamedata.moves[i];
			initPosition[m.t.r][m.t.c] = initPosition[m.f.r][m.f.c];
			initPosition[m.f.r][m.f.c] = "e";
		}
		gameData = gamedata;
		$scope.players = gamedata.players;
		fctns.copyPosition(initPosition, $scope.bm);
		if (gameData.moves.length > 0) {
			var idx = gameData.moves.length - 1;
			s1 = {r: gameData.moves[idx].f.r, c: gameData.moves[idx].f.c};
			s2 = {r: gameData.moves[idx].t.r, c: gameData.moves[idx].t.c};
		}
	}

	$scope.newOnlineGame = function() {
		$scope.initialize();
		$scope.setNewOnlineGameUrl();
	}
}]);
