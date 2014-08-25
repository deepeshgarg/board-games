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

	$scope.turn = "o";
	
	$scope.cellimg = function(row, col) {
		return $scope.imgMap[$scope.bm[row][col]];
	}

	$scope.onClick = function($event, row, col) {
		$log.log(">" + $scope.bm[row][col] + "<");
		if ($scope.bm[row][col] == " ") {
			$scope.bm[row][col] = $scope.turn;
			$scope.turn = $scope.turn == "o"? "x" : "o";
		}
 	}
}