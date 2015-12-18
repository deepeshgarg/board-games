var myApp = angular.module('myApp',[]);

myApp.controller('GoController', ['$scope', '$log', function($scope, $log) {
	NGBoardBaseController(19, 19, $scope, $log);
	var i = 1;
	var empty = " ";
	for (var row = 0; row < $scope.bm.length; row++) {
		for (var col = 0; col < $scope.bm[row].length; col++) {
			$scope.bm[row][col] = " ";
		}
	}

	$scope.cellTemplate = "../ang-common-templates/tmpl-cell-img.html";

	var imgMap = {};
	imgMap[' '] = "../go/images/blank.png";
	imgMap['b'] = "../go/images/b.png";
	imgMap['w'] = "../go/images/w.png";

	$scope.cellimg = function(row, col) {
		return imgMap[$scope.bm[row][col]];
	}


	$scope.moveCount = 0;
	$scope.nextMove = "b";

	$scope.onClick = function($event, row, col) {
		if ($scope.bm[row][col] == " ") {
			$scope.bm[row][col] = $scope.nextMove;
			$scope.nextMove = ($scope.nextMove == "b"? "w":"b");
		}
	}

	$scope.shuffle = function() {
		fctns.shuffle($scope.bm);
		$scope.moveCount = 0;
	}

	$scope.cellClass = function(r, c) {
		var classes = [];
		if (r == 0) {
			if(c == 0) {
				classes.push("c_tl");
			} else if (c == ($scope.bm[0].length - 1)) {
				classes.push("c_tr");
			} else {
				classes.push("e_t");
			}
		} else if (r == ($scope.bm.length - 1)) {
			if (c == 0) {
				classes.push("c_bl");
			} else if (c == ($scope.bm[0].length - 1)) {
				classes.push("c_br");
			} else {
				classes.push("e_b");
			}
		} else {
			if (c == 0) {
				classes.push("e_l");
			} else if (c == ($scope.bm[0].length - 1)) {
				classes.push("e_r");
			} else {
				classes.push("m_m");
			}	
		}

		return classes;
	}

	fctns = {} ;
}]);
