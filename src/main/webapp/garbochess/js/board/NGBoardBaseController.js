function NGBoardBaseController(r, c, $scope, $log) {
    $scope.board = new Board(r, c);
    $scope.bm = $scope.board.boardModel;
    for (var row = 0; row < $scope.bm.length; row++) {
        for (var col = 0; col < $scope.bm[row].length; col++) {
            $scope.bm[row][col] = "val" + row + "-" + col;
        }
    }

    $scope.boardTemplate = "tmpl-up-board";
    $scope.cellTemplate = "tmpl-cell";

    $scope.rl = range(0, $scope.bm.length - 1);
    $scope.rrl = range($scope.bm.length - 1, 0);
    $scope.cl = range(0, $scope.bm[0].length - 1);
    $scope.rcl = range($scope.bm[0].length - 1, 0);

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
