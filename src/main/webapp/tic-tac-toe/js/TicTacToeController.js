function TicTacToeController($scope, $log) {
	NGBoardBaseController(3, 3, $scope, $log);
	for (var row = 0; row < $scope.bm.length; row++) {
		for (var col = 0; col < $scope.bm[row].length; col++) {
			$scope.bm[row][col] = " ";
		}
	}

	$scope.cellTemplate = "../ang-common-templates/tmpl-cell-img.html";

	$scope.imgMap = {};
	$scope.imgMap[' '] = "../images/blank.gif";
	$scope.imgMap['x'] = "cross.gif";
	$scope.imgMap['o'] = "nots.gif";

	var firstPlayer = "x";
	$scope.turn = firstPlayer;
	var moves = [];
	
	$scope.cellimg = function(row, col) {
		return $scope.imgMap[$scope.bm[row][col]];
	}

	$scope.onClick = function($event, row, col) {
		$log.log(">" + $scope.bm[row][col] + "<");
		if ($scope.bm[row][col] == " ") {
			$scope.bm[row][col] = $scope.turn;
			var move = {r: row, c: col, t: $scope.turn};
			moves.push(move);
			$scope.turn = $scope.turn == "o"? "x" : "o";
		}
 	}

	$scope.back = function () {
		var move = moves.pop();
		$scope.bm[move.r][move.c] = " ";
		$scope.turn = move.t;
	}

	$scope.newGame = function () {
		for (var row = 0; row < $scope.bm.length; row++) {
			for (var col = 0; col < $scope.bm[row].length; col++) {
				$scope.bm[row][col] = " ";
			}
		}	
		$scope.turn = firstPlayer;
	}

}
