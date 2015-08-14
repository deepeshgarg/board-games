var myApp = angular.module('myApp',[]);

myApp.controller('PzController', ['$scope', '$log', function($scope, $log) {
	NGBoardBaseController(4, 4, $scope, $log);
	var i = 1;
	for (var row = 0; row < $scope.bm.length; row++) {
		for (var col = 0; col < $scope.bm[row].length; col++) {
			$scope.bm[row][col] = "" + i++;
		}
	}
	var empty = " ";
	$scope.bm[3][3] = empty;
	$scope.moveCount = 0;

	$scope.onClick = function($event, row, col) {
		if (fctns.move($scope.bm, {r: row, c: col})) {
			$scope.moveCount++;
		};
 	}

	$scope.shuffle = function() {
		fctns.shuffle($scope.bm);
		$scope.moveCount = 0;
	}

	$scope.cellClass = function(r, c) {
		if ($scope.bm[r][c] == empty) {
			return "empty";
		} else {
			return "";
		}
	}

	fctns = {} ;

	fctns.getEmptyCell = function(bm) {
		for (var row = 0; row < bm.length; row++) {
			for (var col = 0; col < bm[row].length; col++) {
				if (bm[row][col] == empty) {
					return {r: row, c: col};
				}
			}
		}
	}

	fctns.getMovableCells = function(bm) {
		var ec = fctns.getEmptyCell(bm);
		var mc = [];
		if (ec.r - 1 >= 0) { 
			for (var i = 0; i < bm.length && (ec.r - 1 - i) >=0 ; i++) {
				mc.push ({r : ec.r - 1 - i, c : ec.c}); 
			}
		}
		if (ec.r + 1 < bm.length) { 
			for (var i = 0; i < bm.length && (ec.r + 1 + i) < bm.length ; i++) {
				mc.push ({r : ec.r + 1 + i, c : ec.c}); 
			}
		}
		if (ec.c - 1 >= 0) {
			for (var i = 0; i < bm[0].length && (ec.c - 1 - i) >= 0 ; i++) {
				mc.push ({r : ec.r, c : ec.c - 1 - i}); 
			}
		}
		if (ec.c + 1 < bm[0].length) { 
			for (var i = 0; i < bm[0].length && (ec.c + 1 + i) < bm[0].length ; i++) {
				mc.push ({r : ec.r, c : ec.c + 1 + i}); 
			}
		}
		return mc;
	}

	fctns.move = function(bm, cell) {
		var ec = fctns.getEmptyCell(bm);
		if (ec.c == cell.c) {
			var d = ec.r < cell.r? 1: -1;
			for (var i = 0; ec.r + d * i != cell.r; i++) {
				bm[ec.r + d*i][ec.c] = bm[ec.r + d*(i+1)][ec.c];
			}
			bm[cell.r][cell.c] = empty;
			return true;
		}
		if (ec.r == cell.r) {
			var d = ec.c < cell.c? 1: -1;
			for (var i = 0; ec.c + d * i != cell.c; i++) {
				bm[ec.r][ec.c + d*i] = bm[ec.r][ec.c + d*(i+1)];
			}
			bm[cell.r][cell.c] = empty;
			return true;
		}
		return false;
	}
	
	fctns.shuffle = function(bm) {
		for (var i = 0; i < 100; i++) {
			var cells = fctns.getMovableCells(bm);
			var idx = Math.floor(Math.random()*cells.length);
			fctns.move(bm, cells[idx]);
		}
	}
}]);
