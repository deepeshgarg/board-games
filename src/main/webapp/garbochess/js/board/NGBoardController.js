var chessApp = angular.module('chessApp',[]);

chessApp.config(['$locationProvider', function($locationProvider) {
        $locationProvider.html5Mode(true);
    }]);

chessApp.factory ('onlineGameDataService', ['$interval', '$http', function($interval, $http) {
	return new OnlineGameDataService($interval, $http);
}]);

chessApp.controller('chessController', ['onlineGameDataService', '$scope', '$log', '$location', function(ods, $scope, $log, $location) {
	var fctns = {} ;
	fctns.analyzeNode = function (node, displayData) {
		var id = "" + Math.random();
		for (var property in pendingAnalysis) {
		    if (pendingAnalysis.hasOwnProperty(property)) {
		        var pad = pendingAnalysis[property];
		        if (pad.node == node) {
		        	return;
		        }
		    }
		}
		var pendingAnalysisData = {};
		pendingAnalysisData.node = node;
		pendingAnalysisData.dd = displayData;
		pendingAnalysis[id] = pendingAnalysisData;
		analyser.analyzePosition(id, node.fen, fctns.handleNodeAnalysis);
	}
	
	fctns.analyzeAll = function (displayDataArray) {
		for (var i = 0; i < displayDataArray.length; i++) {
			var dd = displayDataArray[i];
			if (dd.node.analysis == null && $scope.settings.anStrength != 0) {
				fctns.analyzeNode(dd.node, dd);
			}
		}
	}

	fctns.handleNodeAnalysis = function(coId, pa) {
		$log.log("move callback for " + coId + ". score:" + pa.score + " hint:" + pa.hint + " suggestedMove:" + pa.suggestedMove );
		var pendingAnalysisData = pendingAnalysis[coId];
		pendingAnalysisData.node.analysis = pa;
		if (pendingAnalysisData.dd != null) {
			pendingAnalysisData.dd.score = pa.score;
			pendingAnalysisData.dd.hint = pa.hint;
		}
		delete pendingAnalysis[coId];
		$scope.$apply();
	}

	fctns.handleMove = function(coId, pa) {
		$log.log("move callback. score:" + pa.score + " hint:" + pa.hint + " suggestedMove:" + pa.suggestedMove );
		if (fctns.makeMistake()) {
			pa.suggestedMove = fctns.getBadMove();
		}
		fctns.playMove(pa.suggestedMove);
		$scope.$apply();
		setTimeout($scope.next, 10);
	}
	
	fctns.getBadMove = function() {
		var moveList = game.getValidMoves();
		var randomIdx = Math.floor(Math.random() * moveList.length);
		return moveList[randomIdx];
	}
	
	fctns.makeMistake = function() {
		if ($scope.settings.mistakePercent >= Math.random() * 100) {
			return true;
		}
		return false;
	}

	fctns.playMove = function (move) {
		var moveText = game.getMoveText(move);
		game.makeMove(move);
		var node = new ChessNode();
		node.fen = game.getFen();
		node.wtm = game.whiteToMove();
		var link = new Link(move, node);
		link.moveText = moveText;
		link = currentNode.addLink(link);
		currentNode = link.node;
		$scope.currentIndex++;
		updateDisplayData($scope.currentIndex, link, $scope.displayDataArray, fctns);
		fctns.showBoard();
		//fctns.analyzeNode(link.node, null);
		$scope.saveGame();
	}

	fctns.showBoard = function() {
		Chess.FEN.load($scope.board, game.getFen());
		$scope.fen = game.getFen();
	}


	fctns.getEngine = function(player) {
		var cnstr = playerConstructors[player];
		var engine = null;
		if (typeof cnstr == "function") {
			engine = new cnstr();
		}
		return engine;
	}

	
	fctns.checkPawnPromotion = function(from, to) {
		if ((from.r == 1 && $scope.bm[from.r][from.c] == "P") ||
			 from.r == 6 && $scope.bm[from.r][from.c] == "p"	) {
			return true;
		}
		return false;
	}

	/* 
	 * Display borad for that position. also set currentNode 
	 */
	fctns.showBoardAtIndex = function(index) {
		var fen =  $scope.displayDataArray[index].fen;
		Chess.FEN.load($scope.board, fen);
		$scope.currentIndex = index;
		currentNode = $scope.displayDataArray[index].node;
		game.initGame(fen);
		$scope.fen = fen;
	}

	fctns.getGameTreeJSON = function() {
		var gameTreeJSON = JSON.stringify(root);
		$log.log(gameTreeJSON);
		return gameTreeJSON;
	}

	fctns.getPgn = function() {
		var pgn = "";
		var dda = $scope.displayDataArray;
		var moveCount = 1;
		for (var i = 0; i < dda.length; i++) {
			var dd = dda[i];
			if (dd.moveText) {
				if (!dd.node.wtm) {
					pgn += " " + moveCount + "." + dd.moveText;
					moveCount++;
				} else {
					pgn += " " + dd.moveText;
				}
			}	
		}
		return pgn;
	}
		
	NGBoardBaseController(8, 8, $scope, $log);
	NGOnlineGameController($scope, $log, ods, $location);
	for (var row = 0; row < $scope.bm.length; row++) {
		for (var col = 0; col < $scope.bm[row].length; col++) {
			$scope.bm[row][col] = " ";
		}
	}

	$scope.getScoreCellWidth = getScoreCellWidth;
	//$scope.updateDisplayData = updateDisplayData;
	
	$scope.players = ["human", "gb-chess"];
	var playerConstructors = {"gb-chess": GarboChessEngine};
	$scope.whitePlayer = "human";
	$scope.blackPlayer = "human";
	$scope.strengths = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	$scope.bpStrength = 1;
	$scope.wpStrength = 1;
	$scope.flipBoard = false;

	$scope.settings = {};
	$scope.settings.fen = "";
	$scope.settings.pgn = "";
	$scope.settings.mistakePercent = 0;
	$scope.anStrengths = ["0", 1, 2, 3, 4, 5, 6, 7, 8, 9];
	$scope.settings.anStrength = "0";

	var game = new GarboChessEngine();
	var analyser = new GarboChessEngine();
	analyser.setStrength($scope.settings.anStrength);
	var pendingAnalysis = {};

	Chess.FEN.load($scope.board, game.getFen());
	$scope.fen = game.getFen();
	var currentNode = new ChessNode();
	currentNode.fen = $scope.fen;
	currentNode.wtm = game.whiteToMove();
	var root = new Link(null, currentNode);
	//var currentLink = root;
	$scope.displayDataArray = [];
	$scope.currentIndex = 0;
	updateDisplayData($scope.currentIndex, root, $scope.displayDataArray, fctns);

	$scope.cellTemplate = "tmpl-cell-img";

	var imgMap = {};
	imgMap[' '] = "img/blank.png";
	imgMap['p'] = "img/pawn-b.png";
	imgMap['P'] = "img/pawn-w.png";
	imgMap['n'] = "img/knight-b.png";
	imgMap['N'] = "img/knight-w.png";
	imgMap['b'] = "img/bishop-b.png";
	imgMap['B'] = "img/bishop-w.png";
	imgMap['r'] = "img/rook-b.png";
	imgMap['R'] = "img/rook-w.png";
	imgMap['q'] = "img/queen-b.png";
	imgMap['Q'] = "img/queen-w.png";
	imgMap['k'] = "img/king-b.png";
	imgMap['K'] = "img/king-w.png";

	$scope.showSettingsPanel = false;

	$scope.cellimg = function(row, col) {
		return imgMap[$scope.bm[row][col]];
	}

	$scope.newGame = function() {
		$scope.setOfflineGameUrl();
		game = new GarboChessEngine();
		pendingAnalysis = {};

		Chess.FEN.load($scope.board, game.getFen());
		$scope.fen = game.getFen();
		currentNode = new ChessNode();
		currentNode.fen = $scope.fen;
		currentNode.wtm = game.whiteToMove();
		root = new Link(null, currentNode);
		//currentLink = root;
		$scope.displayDataArray = [];
		$scope.currentIndex = 0;
		updateDisplayData($scope.currentIndex, root, $scope.displayDataArray, fctns);
		$scope.saveGame();
		$scope.hideSettingsPanel();
	}
	
	$scope.newOnlineGame = function() {				
		$scope.newGame();
		$scope.setNewOnlineGameUrl();
	}
	
	$scope.onlineGameWatchCallBack = function(gameid, gamedata) {
		var r = Chess.PGN.parse(gamedata);
		//$scope.loadPgn(gamedata);
		var destLink = root;
		var nextLinks = r.node.links;
		while (nextLinks.length > 0) {
			var nextLink = nextLinks[0];
			destLink = destLink.node.addLink(nextLink) ;
			nextLinks = nextLink.node.links;
		} 
		updateDisplayData(0, root, $scope.displayDataArray, fctns);
		fctns.showBoardAtIndex($scope.displayDataArray.length - 1);
	}

	$scope.saveGame = function() {
		var pgn = fctns.getPgn();
		if (Modernizr.localstorage) {
			var ls = window.localStorage;
			ls.setItem("gb_pgn", pgn);
		}
		if ($scope.onlineGame() == true) {
			ods.publish($scope.gameid, pgn);
		}
	}

	$scope.loadGame = function() {
		var pgn = "";
		if (Modernizr.localstorage) {
			var ls = window.localStorage;
			pgn = ls.getItem("gb_pgn");
		} 
		if (pgn != null && pgn != "") {
			$scope.loadPgn(pgn);
		}
	}


	$scope.next = function() {
		if (game.whiteToMove()) {
			if ($scope.whitePlayerEngine != null) {
				$scope.whitePlayerEngine.analyzePosition("", game.getFen(), fctns.handleMove);
			}
		} else {
			if ($scope.blackPlayerEngine != null) {
				$scope.blackPlayerEngine.analyzePosition("", game.getFen(), fctns.handleMove);
			}
		}
	}
	
	$scope.onPlayerChange = function(color) {
		$log.log("player changed:" + color);
		switch (color) {
			case 'w': $scope.whitePlayerEngine = fctns.getEngine($scope.whitePlayer);
				  if ($scope.whitePlayerEngine != null) {
				    $scope.whitePlayerEngine.setStrength($scope.wpStrength);
				  }
				break;
			case 'b': $scope.blackPlayerEngine = fctns.getEngine($scope.blackPlayer);
				  if ($scope.blackPlayerEngine != null) {
				    $scope.blackPlayerEngine.setStrength($scope.bpStrength);
				  }
				break;
		}
		$scope.next();
	}

	$scope.onStrengthChange = function(color) {
		switch (color) {
			case 'w' :
				if ($scope.whitePlayerEngine != null) {
					$scope.whitePlayerEngine.setStrength($scope.wpStrength);
				}
				break;
			case 'b' :
				if ($scope.blackPlayerEngine != null) {
					$scope.blackPlayerEngine.setStrength($scope.bpStrength);
				}
			case 'an' :
				analyser.setStrength($scope.settings.anStrength);
				fctns.analyzeAll($scope.displayDataArray);
				break;
		}
	}

	$scope.flipChanged = function() {
		$log.log("fliped " + $scope.flipBoard);
		if ($scope.flipBoard) {
    			$scope.boardTemplate = "tmpl-down-board";
		} else {
    			$scope.boardTemplate = "tmpl-up-board";
		}
	}

	$scope.onMouseDown = function ($event, row, col) {
		if ($scope.editMode) {
			if ($scope.bm[row][col] == $scope.edit.piece) {
				$scope.bm[row][col] = " ";
			} else {
				$scope.bm[row][col] = $scope.edit.piece;
			}
			return;
		}
		$scope.onClick($event, row, col);
	}
	
	$scope.onMouseUp = function ($event, row, col) {
		if ($scope.editMode) {
			return;
		}
		$scope.onClick($event, row, col);
	}
	
	$scope.onClick = function($event, row, col) {
		if ($scope.from == null) {
			$scope.from = new Cell(row, col);
		} else {
			$scope.to = new Cell(row, col);
			var move = new Move();
			move.from = $scope.from;
			move.to = $scope.to;
			if (fctns.checkPawnPromotion($scope.from, $scope.to)) {
				move.promotion = "q";
			}
			move = game.checkValidMove(move);
			if (move != null) {
				fctns.playMove(move);
				$scope.from = null;
				$scope.to = null;
				$scope.next();
			} else {
				$scope.from = new Cell(row, col);
			}
		}
	}

	/*
	$scope.addGameData = function (game, move) {
		var n = new ChessNode();
		n.setData("fen", game.getFen());
		currentNode.addNode(move.toString(), n);
		currentNode = n;
	}
	*/

	$scope.toggleVariations = function(evt, num) {
		var tgt = angular.element(evt.target);
		var variationsElem = tgt.next(".variations");
		$log.log(variationsElem.height());
		if (variationsElem.height() == 0) {
			variationsElem.height(20 * num);
		} else {
			variationsElem.height(0);
		}
	}

	$scope.variationClick = function (evt, index, vrtn) {
		var tgt = angular.element(evt.target);
		var variationsElem = tgt.parent(".variations");
		$log.log(index + " " + vrtn.link);
		updateDisplayData(index + 1, vrtn.link, $scope.displayDataArray, fctns);
		fctns.showBoardAtIndex(index + 1);
		variationsElem.height(0);
	}
	
	/* 
	 * Handle click on move row
	 */
	$scope.moveClick = fctns.showBoardAtIndex; 

	$scope.cellClass = function(r, c) {
		return ((r + c) % 2 == 0? "even" : "odd");
	}

	$scope.getMoveRowClass = function (index) {
		var classes = "";
		if (index == $scope.currentIndex) {
			classes += " " + "selected";
		}
		return classes;
	}

	$scope.vrtnsClass = function (vrtns) {
		return vrtns > 1 ? "vrtns" : "";
	}

	$scope.getCurrentDD = function() {
		return $scope.displayDataArray[$scope.currentIndex];
	}
	
	
	$scope.toggleSettingsPanel = function() {
		$scope.showSettingsPanel = !$scope.showSettingsPanel;
	}
	
	$scope.hideSettingsPanel = function() {
		$scope.showSettingsPanel = false;
	}
	
	$scope.loadFen = function(fen) {
		game = new GarboChessEngine();
		game.initGame(fen);
		pendingAnalysis = {};

		Chess.FEN.load($scope.board, game.getFen());
		$scope.fen = game.getFen();
		currentNode = new ChessNode();
		currentNode.fen = $scope.fen;
		currentNode.wtm = game.whiteToMove();
		root = new Link(null, currentNode);
		//currentLink = root;
		$scope.displayDataArray = [];
		$scope.currentIndex = 0;
		updateDisplayData($scope.currentIndex, root, $scope.displayDataArray, fctns);
		$scope.showSettingsPanel = false;
		$scope.editMode = false;
	}
	
	$scope.showFen = function(fen) {
		$scope.settings.fen = $scope.displayDataArray[$scope.currentIndex].node.fen;
	}
	
	$scope.loadPgn = function(pgn) {
		root = Chess.PGN.parse(pgn);
		//currentLink = root;
		$scope.displayDataArray = [];
		$scope.currentIndex = 0;
		updateDisplayData($scope.currentIndex, root, $scope.displayDataArray, fctns);
		$scope.showSettingsPanel = false;
		$scope.editMode = false;
	}
	
	$scope.showPgn = function() {
		$scope.settings.pgn = fctns.getPgn();
	}
	
	$scope.setEdit = function() {
		$scope.editMode = true;
		$scope.showSettingsPanel = false;
	}
	
	$scope.edit = {};
	$scope.edit.piece = " ";
	$scope.edit.toMove = "w";
	$scope.edit.castle = [true, true, true, true];
	$scope.selectEditPiece = function(piece) {
		$scope.edit.piece = piece;
	}
	$scope.toggleEditToMove = function() {
		if ($scope.edit.toMove == "w") {
			$scope.edit.toMove = "b";
		} else {
			$scope.edit.toMove = "w";
		}
	}
	$scope.loadEdit = function() {
		var fen = Chess.FEN.get($scope.board);
		$log.log(fen);
		var c = $scope.edit.castle;
		var castleStatus = (c[0]?"k":"") + (c[1]?"q":"") + (c[2]?"K":"") + (c[3]?"Q":"") 
		fen += " " + $scope.edit.toMove + " " + castleStatus + " -";
		$scope.loadFen(fen);
		$scope.editMode = false;
	}
	
	$scope.cancelEdit = function() {
		fctns.showBoardAtIndex($scope.currentIndex);
		$scope.editMode = false;
	}

	$scope.clearEdit = function() {
		for (var row = 0; row < $scope.bm.length; row++) {
			for (var col = 0; col < $scope.bm[row].length; col++) {
				$scope.bm[row][col] = " ";
			}
		}
		var c = $scope.edit.castle; c[0] = false; c[1] = false; c[2] = false; c[3] = false;
	}
	
	$scope.loadGame();
}]);

function updateVariations(dd) {
	dd.variations = [];
	var links = dd.node.links;
	for (var i = 0; i < links.length; i++) {
		var variation = new Variation();
		variation.link = links[i];
		variation.text = links[i].moveText;
		dd.variations.push(variation);
	}
}

function updateDisplayData(index, link, displayDataArray, fctns) {
	var ddarray = [];
	var nextLink = link;
	var moveNum = Math.floor(index / 2) + 1;
	if (index > 0) {
		updateVariations(displayDataArray[index - 1]);
	}
	while (nextLink != null) {
		var dd = new DisplayData();
		if (typeof nextLink.moveText != "undefined") {
			var moveText = "" ;
			if (nextLink.node.wtm) {
				moveText += "...";
				moveNum++;
			} else {
				moveText += moveNum + ".";
			}
			dd.moveDisplayText = moveText + nextLink.moveText;
			dd.moveText = nextLink.moveText;
		}
		if (nextLink.node.analysis != null) {
			dd.score = nextLink.node.analysis.score;
			dd.hint = nextLink.node.analysis.hint;
		}		
		dd.node = nextLink.node;
		dd.fen = nextLink.node.fen;		
		if (nextLink.node.links.length > 0) {
			updateVariations(dd);
			nextLink = nextLink.node.links[0];
		} else {
			nextLink = null;
		}
		ddarray.push(dd);
	}
	displayDataArray.splice(index);
	displayDataArray.push.apply(displayDataArray, ddarray);
	fctns.analyzeAll(displayDataArray);
}

function DisplayData() {
	this.moveDisplayText = "";
	this.moveText = "";
	this.node = null;
	this.score = 0;
	this.variations = [];
};

function Variation() {
	this.link = null;
	this.text = "V";
}

function getScoreCellWidth(score) {
	if (score > 100) {
		score = 100;
	}
	else if (score < -100) {
		score = -100;
	}

	return (50 + score/2) + "%" ;
};

/*
 * Todo:
 * Node : contains Link[]. done
 * Link: contains linkdata, and node. done
 * Node + Link will give Tree. done
 * DisplayData: contains, moveText, fen, whiteToMove, score, hint, Link[]. done
 *
 * Array of DisplayData: contains ui related fields and Link[] (variations). done
 * A utility function which takes a link and convert to array of display data, selecting first entry from Link[] when Link[] size > 1. done
 * An onclick handler which will be passed an index to display data array and a Link. DisplayData array from index onwards to be created from Link. done
 * For consistency, root node to be stored as Link which can be stored as Node otherwise. done
 * 
 */
