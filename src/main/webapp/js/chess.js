
function ChessPiece (type) {
	this.pieceType = type;
	this.captureRayList = [];
	this.nonCaptureRayList = [];
	this.canMoveFromRayList = [];
}

ChessPiece.diagonals = [new Ray([new Cell(1, 1), new Cell(2, 2), new Cell(3, 3), new Cell(4, 4), new Cell(5, 5), new Cell(6, 6), new Cell(7, 7)]), 
                       new Ray([new Cell(1, -1), new Cell(2, -2), new Cell(3, -3), new Cell(4, -4), new Cell(5, -5), new Cell(6, -6), new Cell(7, -7)]),
                       new Ray([new Cell(-1, 1), new Cell(-2, 2), new Cell(-3, 3), new Cell(-4, 4), new Cell(-5, 5), new Cell(-6, 6), new Cell(-7, 7)]),
                       new Ray([new Cell(-1, -1), new Cell(-2, -2), new Cell(-3, -3), new Cell(-4, -4), new Cell(-5, -5), new Cell(-6, -6), new Cell(-7, -7)])];

ChessPiece.straights = [new Ray([new Cell(0, 1), new Cell(0, 2), new Cell(0, 3), new Cell(0, 4), new Cell(0, 5), new Cell(0, 6), new Cell(0, 7)]),
						new Ray([new Cell(0, -1), new Cell(0, -2), new Cell(0, -3), new Cell(0, -4), new Cell(0, -5), new Cell(0, -6), new Cell(0, -7)]),
						new Ray([new Cell(1, 0), new Cell(2, 0), new Cell(3, 0), new Cell(4, 0), new Cell(5, 0), new Cell(6, 0), new Cell(7, 0)]),
						new Ray([new Cell(-1, 0), new Cell(-2, 0), new Cell(-3, 0), new Cell(-4, 0), new Cell(-5, 0), new Cell(-6, 0), new Cell(-7, 0)])];
						
ChessPiece.oneSquare = [new Ray([new Cell(0, 1)]),
						new Ray([new Cell(0, -1)]),
						new Ray([new Cell(1, 0)]),
						new Ray([new Cell(-1, 0)]),
						new Ray([new Cell(1, 1)]),
						new Ray([new Cell(1, -1)]),
						new Ray([new Cell(-1, 1)]),
						new Ray([new Cell(-1, -1)])];

ChessPiece.knightMoves = [new Ray([new Cell(1, 2)]),
						new Ray([new Cell(1, -2)]),
						new Ray([new Cell(2, 1)]),
						new Ray([new Cell(2, -1)]),
						new Ray([new Cell(-1, 2)]),
						new Ray([new Cell(-1, -2)]),
						new Ray([new Cell(-2, 1)]),
						new Ray([new Cell(-2, -1)])];
						
ChessPiece.blackPawnCapture = [new Ray([new Cell(1, -1)]),
						   new Ray([new Cell(1,  1)])];
						   
ChessPiece.whitePawnCapture = [new Ray([new Cell(-1, -1)]),
						   new Ray([new Cell(-1,  1)])];
						
ChessPiece.prototype.validMoves = function (r, c, boardModel) {
	var validMoves = [];
	validMoves = validMoves.concat(this.captureMoves(r, c, boardModel));
	validMoves = validMoves.concat(this.nonCaptureMoves(r, c, boardModel));
	return validMoves;
}

ChessPiece.prototype.captureMoves = function (r, c, boardModel) {
	return BoardUtil.getValidCaptureMoves (new Cell(r, c), boardModel, this.captureRayList, this.isCapture, this.isEmpty);
}

ChessPiece.prototype.nonCaptureMoves = function (r, c, boardModel) {
	return BoardUtil.getValidNonCaptureMoves (new Cell(r, c), boardModel, this.captureRayList, this.isEmpty);
}

ChessPiece.prototype.canMoveFrom = function (r, c, boardModel) {
	return BoardUtil.getValidNonCaptureMoves (new Cell(r, c), boardModel, this.canMoveFromRayList, this.isEmpty);
}

ChessPiece.prototype.isEmpty = function (val) {
	if (val == "") {
		return true;
	} else {
		return false;
	}
}

ChessPiece.prototype.isCapture = function (val) {
	if ("pnbrqk".indexOf(val) >= 0) {
		return "PNBRQK".indexOf(val) >= 0;
	} else {
		return "pnbrqk".indexOf(val) >= 0; 
	}
}

ChessPiece.prototype.getColor = function() {
	return this.color;
}

SCChessPiece.prototype = new ChessPiece("");
SCChessPiece.prototype.constructor = SCChessPiece;

function SCChessPiece(type) {
	this.pieceType = type;
}

SCChessPiece.prototype.validMoves = function (r, c, boardModel) {
	var validMoves = [];
	validMoves = validMoves.concat(this.captureMoves(r, c, boardModel));
	return validMoves;
}

SCChessPiece.prototype.isCapture = function (val) {
	if (val != "") {
		return true; 
	} else {
		return false;
	}
}

SCBlackPawn.prototype = new SCChessPiece("p");
SCBlackPawn.prototype.constructor = SCBlackPawn;

function SCBlackPawn() {
	this.color = "b";
	this.captureRayList = ChessPiece.whitePawnCapture;
	this.canMoveFromRayList = ChessPiece.blackPawnCapture;
}


/*
SCBlackPawn.prototype.validMoves = function (r, c, boardModel) {
	//r = parseInt(r);
	//c = parseInt(c);
	var validMoves = [];
	if (boardModel.inBoard(r - 1, c - 1) && 
	    boardModel.getCell(r - 1, c - 1) != "") {
	    validMoves.push(new Cell(r - 1, c - 1));
	}
	if (boardModel.inBoard(r - 1, c + 1) && 
	    boardModel.getCell(r - 1, c + 1) != "") {
	    validMoves.push(new Cell(r - 1, c + 1));
	}
	return validMoves;  
}
*/

SCBlackBishop.prototype = new SCChessPiece("b");
SCBlackBishop.prototype.constructor = SCBlackBishop;

function SCBlackBishop() {
	this.color = "b";
	this.captureRayList = ChessPiece.diagonals;
	this.canMoveFromRayList = this.captureRayList;
}

SCBlackKnight.prototype = new SCChessPiece("n");
SCBlackKnight.prototype.constructor = SCBlackKnight;

function SCBlackKnight() {
	this.color = "b";
	this.captureRayList = ChessPiece.knightMoves;
	this.canMoveFromRayList = this.captureRayList;
}

SCBlackRook.prototype = new SCChessPiece("r");
SCBlackRook.prototype.constructor = SCBlackRook;

function SCBlackRook() {
	this.color = "b";
	this.captureRayList = ChessPiece.straights;
	this.canMoveFromRayList = this.captureRayList;
}

SCBlackQueen.prototype = new SCChessPiece("q");
SCBlackQueen.prototype.constructor = SCBlackQueen;

function SCBlackQueen() {
	this.color = "q";
	this.captureRayList = ChessPiece.straights.concat(ChessPiece.diagonals);
	this.canMoveFromRayList = this.captureRayList;
}

SCBlackKing.prototype = new SCChessPiece("k");
SCBlackKing.prototype.constructor = SCBlackKing;

function SCBlackKing() {
	this.color = "k";
	this.captureRayList = ChessPiece.oneSquare;
	this.canMoveFromRayList = this.captureRayList;
}

function SCPieceFactory () {
	this.blackPawn = new SCBlackPawn();
	this.blackKnight = new SCBlackKnight();
	this.blackBishop = new SCBlackBishop();
	this.blackRook = new SCBlackRook();
	this.blackQueen = new SCBlackQueen();
	this.blackKing = new SCBlackKing();
}

SCPieceFactory.prototype.getPiece = function (type) {
	switch(type) {
		case "p": case "P" : return this.blackPawn;
		case "n": case "N" : return this.blackKnight;
		case "b": case "B" : return this.blackBishop;
		case "r": case "R" : return this.blackRook;
		case "q": case "Q" : return this.blackQueen;
		case "k": case "K" : return this.blackKing;
		default: return null;
	}
} 

Chess = {};
Chess.FEN = {};

Chess.FEN.load = function (boardModel, fen) {

	BoardUtil.forEachCell(0, 0, BoardUtil.nextCellForward, function(r, c, d) {
					d[r][c] = "";
				},
				boardModel.board, boardModel.rows, boardModel.cols);
				
	var index = 0 ;
	var len = fen.length ;

	for (var row = 0; row < boardModel.rows && index < len; row++) {
		var c = fen.charAt(index++) ;
		var col = 0 ;
		while (c != '/' && col < boardModel.cols) {
			if (c == ' ') {
				break;
			}
			var skip = 1 ;
			if (c == 'p' || c == 'P' || c == 'n' || c == 'N' || c == 'b' || c == 'B' || 
			    c == 'r' || c == 'R' || c == 'q' || c == 'Q' || c == 'k' || c == 'K') {
				boardModel.setCell(row, col,c) ;
			} else {
				skip = parseInt(c) ;
			}
			c = fen.charAt(index++) ;
			col += skip ;
		}
	}
	
	var newfen = Chess.FEN.get (boardModel);
}

Chess.FEN.get = function (boardModel) {
	var fen = "";
	for (var row = 0; row < boardModel.rows; row++) {
		var count = 0;
		for (var col = 0; col < boardModel.rows; col++) {
			if (boardModel.getCell(row, col) == "") {
				count++;
			} else {
				fen += (count == 0? "" : ("" + count)) + boardModel.getCell(row, col);
				count = 0;
			}
		}
		if (row < boardModel.rows - 1) {
			fen += "/";
		}
	}
	return fen;
}