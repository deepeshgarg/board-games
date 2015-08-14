function FOMController($scope, $log) {
	NGBoardBaseController(9, 9, $scope, $log);
	for (var row = 0; row < $scope.bm.length; row++) {
		for (var col = 0; col < $scope.bm[row].length; col++) {
			$scope.bm[row][col] = "e";
		}
	}

	var fomService = new FOMService();
	fomService.board = $scope.bm;
	fomService.rows = $scope.bm.length;
	fomService.cols = $scope.bm[0].length;
	fomService.initialize();
	$scope.nextColors = fomService.nextColors;

	var pathPrefix = "";
	if (legacySupport == true) {
		pathPrefix = "fom/";
	}

    	$scope.boardTemplate = pathPrefix + "../ang-common-templates/tmpl-up-board.html";
	$scope.cellTemplate = pathPrefix + "../ang-common-templates/tmpl-cell-img.html";
	$scope.score = 0;

	$scope.imgMap = {};
	$scope.imgMap['e'] = pathPrefix + "../images/blank.gif";
	$scope.imgMap['b'] = pathPrefix + "images/b.gif";
	$scope.imgMap['c'] = pathPrefix + "images/c.gif";
	$scope.imgMap['g'] = pathPrefix + "images/g.gif";
	$scope.imgMap['o'] = pathPrefix + "images/o.gif";
	$scope.imgMap['p'] = pathPrefix + "images/p.gif";
	$scope.imgMap['r'] = pathPrefix + "images/r.gif";
	$scope.imgMap['y'] = pathPrefix + "images/y.gif";

	$scope.showScores = false;

	$scope.cellimg = function(row, col) {
		return $scope.imgMap[$scope.bm[row][col]];
	}

	$scope.onClick = function($event, row, col) {
		fomService.onClickImpl(row, col);	
		if (fomService.getEmptyCellList().length == 0) {
			$scope.showScores = true;
			var hs = loadHighScore();
			var name = "";
			var score = fomService.score;
			if (hs.length == 0 || (hs.length > 0 && hs[hs.length - 1].score < fomService.score)) {
				if (hs.length > 0) { name = hs[0].name }
				name = window.prompt("Enter name", name);
				$scope.saveHighScore(name, score);
				$scope.highScores = loadHighScore();
			}
		}
		$scope.nextColors = fomService.nextColors;
		$scope.score = fomService.score;
 	}

	$scope.saveHighScore = function (name, score) {
		var highScore = {"name": name, "score": score};
		if (Modernizr.localstorage) {
			var hs = loadHighScore();
			if (hs.length == 0) {
				hs.push(highScore); 
			} else {
				var i = 0;
				for (i = 0; i < hs.length && i < 10; i++) {
					if (hs[i].score < score) {
						hs.splice(i, 0, highScore);
						break;
					}
				}
				if (i == hs.length && i < 10) {
					hs.push (highScore);
				}
			}
			var highScores = JSON.stringify(hs);
			var ls = window.localStorage;
			ls.setItem("highScores", highScores);
		}
	}

	loadHighScore = function () {
		var hs = [];
		if (Modernizr.localstorage) {
			var ls = window.localStorage;
			var highScores = ls.getItem("highScores");
			if (highScores != null) {
				hs = JSON.parse(highScores);
			} 
		}
		return hs;
	}

	$scope.highScores = loadHighScore();

	$scope.next = function () {
		$log.log("in next");
		fomService.next();
		$scope.score = fomService.score;
	};

	$scope.back = function () {
		$log.log("in back");
		fomService.back();
		$scope.score = fomService.score;
	};
}
