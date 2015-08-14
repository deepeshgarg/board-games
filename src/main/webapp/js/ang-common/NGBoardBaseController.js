function NGBoardBaseController(r, c, $scope, $log) {
    
	$scope.bm = new Array(r);
	
    for (var row = 0; row < r; row++) {
		$scope.bm[row] = new Array(c);
		for (var col = 0; col < c; col++) {
			$scope.bm[row][col] = "";
		}
	}

    $scope.boardTemplate = "../../ang-common-templates/tmpl-up-board.html";
    $scope.cellTemplate = "../../ang-common-templates/tmpl-cell.html";

    $scope.rl = range(0, $scope.bm.length - 1);
    $scope.rrl = range($scope.bm.length - 1, 0);
    $scope.cl = range(0, $scope.bm[0].length - 1);
    $scope.rcl = range($scope.bm[0].length - 1, 0);

    $scope.onMouseUp = function($event, row, col) {
    };

    $scope.onMouseDown = function($event, row, col) {
        $log.log('click ' + row + ' ' + col);
    };

    $scope.onClick = function($event, row, col) {
        $log.log('click ' + row + ' ' + col);
    };

    function range (from, to) {
        var incr = from < to? 1 : -1;
        var rng = [];
        for (var i = from; i != to; i += incr) {
            rng.push(i);
        }
        rng.push(i);

        return rng;
    };
};
