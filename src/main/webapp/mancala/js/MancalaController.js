var mancalaApp = angular.module('mancalaApp',[]);

mancalaApp.config(['$locationProvider', function($locationProvider) {
        $locationProvider.html5Mode(true);
    }]);

mancalaApp.factory ('onlineGameDataService', ['$interval', '$http', function($interval, $http) {
	return new OnlineGameDataService($interval, $http);
}]);

mancalaApp.controller('MancalaController', ['onlineGameDataService', '$scope', '$log', '$location', function(ods, $scope, $log, $location) {
	NGBoardBaseController(2, 8, $scope, $log);
	NGOnlineGameController($scope, $log, ods, $location);
	
	var fctns = {} ;
	fctns.empty = " ";
	fctns.setInitPosition = function(bm) {
		for (var row = 0; row < bm.length; row++) {
			for (var col = 0; col < bm[row].length; col++) {
				bm[row][col] = 4;
			}
		}
		bm[0][0] = 0;
		bm[1][0] = "";
		bm[0][7] = "";
		bm[1][7] = 0;

	};

	fctns.getNext = function (r, c, t) {
		if (r == 0 && c == 0) {
			r = 1; c = 1;
		} else if (r == 1 && c == 7) {
			r = 0; c = 6;
		} else if (r == 0 && c == 1) {
			if (t == 0) {
				r = 0; c = 0;
			} else {
				r = 1; c = 1;
			}
		} else if (r == 1 && c == 6) {
			if (t == 1) {
				r = 1; c = 7;
			} else {
				r = 0; c = 6;
			}
		} else if (r == 0) {
			c--;
		} else {
			c++;
		}
		return {"r": r, "c": c};
	};

	fctns.isRowZero = function(r, bm) {
		var z = true;
		for (var c = 1; c < 7; c++) {
			if (bm[r][c] != 0) {
				z = false;
			}
		}
		return z;
	};
	
	//$scope.cellTemplate = "../ang-common-templates/tmpl-cell-img.html";

	$scope.imgMap = {};
	$scope.imgMap[' '] = "../images/blank.gif";
	$scope.imgMap['x'] = "cross.gif";
	$scope.imgMap['o'] = "nots.gif";

	var firstPlayer = 1;
	var gameData = null;
	var turn;
	
	$scope.initialize = function() {
		fctns.setInitPosition($scope.bm);	
		gameData = {"moves":[]};
		$scope.setTurn(firstPlayer);
	};

	$scope.setTurn = function(t) {
		turn = t;
		if (t == 1) {
			$scope.bm[1][0] = ">>"; $scope.bm[0][7] = "-";
		} else {
			$scope.bm[1][0] = "-"; $scope.bm[0][7] = "<<";
		}
	};

	$scope.getTurn = function() {
		return turn;
	};
	
	$scope.cellimg = function(row, col) {
		return $scope.imgMap[$scope.bm[row][col]];
	};

	$scope.makeMove = function(row, col) {
		if (row != $scope.getTurn() || col == 0 || col == 7) {
			return;
		}
		var next = {"r":row, "c":col};
		var stones = $scope.bm[row][col];
		$scope.bm[row][col] = 0;
		for (var i = stones; i > 0; i--) {
			next = fctns.getNext(next["r"], next["c"], $scope.getTurn());
			$scope.bm[next["r"]][next["c"]]++;
		}
		if ($scope.getTurn() == 1 && next["r"] == 1 && next["c"] != 7 && $scope.bm[next["r"]][next["c"]] == 1 && $scope.bm[0][next["c"]] != 0) {
			$scope.bm[1][7] += $scope.bm[0][next["c"]] + $scope.bm[next["r"]][next["c"]];
			$scope.bm[0][next["c"]] = 0;
			$scope.bm[next["r"]][next["c"]] = 0;
		}
		if ($scope.getTurn() == 0 && next["r"] == 0 && next["c"] != 0 && $scope.bm[next["r"]][next["c"]] == 1 && $scope.bm[1][next["c"]] != 0) {
			$scope.bm[0][0] += $scope.bm[1][next["c"]] + $scope.bm[next["r"]][next["c"]];
			$scope.bm[1][next["c"]] = 0;
			$scope.bm[next["r"]][next["c"]] = 0;
		}
		if ($scope.getTurn() == 1 && next["c"] != 7) $scope.setTurn(0);
		else if ($scope.getTurn() == 0 && next["c"] != 0) $scope.setTurn(1);
		if ($scope.getTurn() == 0 && fctns.isRowZero(0, $scope.bm)) {
			for (var i = 1; i < 7; i++) {
				$scope.bm[1][7] += $scope.bm[1][i];
				$scope.bm[1][i] = 0;
			}
		}
		if ($scope.getTurn() == 1 && fctns.isRowZero(1, $scope.bm)) {
			for (var i = 1; i < 7; i++) {
				$scope.bm[0][0] += $scope.bm[0][i];
				$scope.bm[0][i] = 0;
			}
		}
		var move = {r: row, c: col};
		gameData.moves.push(move);
	};

	$scope.onClick = function($event, row, col) {		
		$scope.makeMove(row, col);
		if ($scope.onlineGame() == true) {
			ods.publish($scope.gameid, JSON.stringify(gameData));
		}
 	};

	$scope.back = function () {
		gameData.moves.pop();
		$scope.replay(gameData);
		if ($scope.onlineGame() == true) {
			ods.publish($scope.gameid, JSON.stringify(gameData));
		}
	};

	$scope.newGame = function () {
		$scope.initialize();
	};
	
	$scope.newOnlineGame = function() {
		$scope.initialize();
		$scope.setNewOnlineGameUrl();
	};

	$scope.replay = function(gd) {
		$scope.initialize();
		for (var i = 0; i < gd.moves.length; i++) {
			var m = gd.moves[i];
			$scope.makeMove(m.r, m.c);
		}
	};
	
	$scope.onlineGameWatchCallBack = function(gameid, gamedata) {		
		$scope.replay(gamedata);
		gameData = gamedata;		
	};

	styles = {};
	styles.cell = {};
	styles.ucell = {};
	styles.dcell = {};
	for (var i = 0; i <= 48; i++) {
		var c = i > 11? 11: i;
		styles.cell["" + i] = {"background" : "url('images/" + c + ".png')", "background-size" : "100% 100%", "vertical-align" : "top"};
		var u = Math.ceil(i / 2);
		var d = Math.floor(i / 2);
		u = u > 20? 20 : u;
		d = d > 20? 20 : d;
		styles.ucell["" + i] = {"background" : "url('images/" + u + "u.png')", "background-size" : "100% 100%", "vertical-align" : "top"};
		styles.dcell["" + i] = {"background" : "url('images/" + d + "d.png')", "background-size" : "100% 100%", "vertical-align" : "bottom"};
	}

	$scope.cellStyle = function (row, col) {
		if (col != 0 && col != 7) {
			return styles.cell["" + $scope.bm[row][col]];
		} else {
			if (row == 0 && col == 0) {
				return styles.ucell["" + $scope.bm[0][0]];
			}
			if (row == 0 && col == 7) {
				return styles.ucell["" + $scope.bm[1][7]];
			}
			if (row == 1 && col == 0) {
				return styles.dcell["" + $scope.bm[0][0]];
			}
			if (row == 1 && col == 7) {
				return styles.dcell["" + $scope.bm[1][7]];
			}
		}
	}
	
	$scope.initialize();

}]);
