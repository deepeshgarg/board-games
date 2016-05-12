
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

	for (var row = 0; row < boardModel.rows; row++) {
		for (var col = 0; col < boardModel.cols; col++) {
			boardModel.boardModel[row][col] = " ";
		}
	}

	var fenTokens = fen.split(" ");

	fen = fenTokens[0];
				
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

	if (fenTokens.length > 1) {
		boardModel.toMove = fenTokens[1];
	}

	if (fenTokens.length > 2) {
		boardModel.castleAllowed = fenTokens[2];
	}

	if (fenTokens.length > 3) {
		boardModel.enPassant = fenTokens[3];
	}
	
	//var newfen = Chess.FEN.get (boardModel);
}

Chess.FEN.get = function (boardModel) {
	var fen = "";
	for (var row = 0; row < boardModel.rows; row++) {
		var count = 0;
		for (var col = 0; col < boardModel.rows; col++) {
			if (boardModel.getCell(row, col) == "" || boardModel.getCell(row, col) == " ") {
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
	if (fen.slice(-1) == '/') {
		fen += '8';
	}
	return fen;
}

Chess.FEN.canonical = function (fen) {
	fen = fen.trim();
	var fenTokens = fen.split(" ");

	fen = fenTokens[0];
				
	var index = 0 ;
	var len = fen.length ;
	var canonicalFen = "";
	var col = 0 ;
	for (var row = 0; row < 8 && index < len; row++) {
		var c = fen.charAt(index++) ;
		col = 0 ;
		while (c != '/' && col < 8) {
			if (c == ' ' || c == '') {
				break;
			}
			var skip = 1 ;
			if (c == 'p' || c == 'P' || c == 'n' || c == 'N' || c == 'b' || c == 'B' || 
			    c == 'r' || c == 'R' || c == 'q' || c == 'Q' || c == 'k' || c == 'K') {
				canonicalFen += c;
				col++;
			} else {
				skip = parseInt(c) ;
				canonicalFen += c;
				col += skip ;
			}
			c = fen.charAt(index++) ;
		}
		canonicalFen += (col < 8)?((8 - col) + c) : c;
	}
	if (canonicalFen.slice(-1) == '/') {
		canonicalFen += "8";
	}
	for (var i = 1; i < fenTokens.length; i++) {
		canonicalFen += " " + fenTokens[i];
	}
	canonicalFen = canonicalFen.replace(/\s{2,}/g, ' ');
	var cfenTokens = canonicalFen.split(" ");
	if (cfenTokens.length < 4) {
		for (var i = 0; i < (4 - cfenTokens.length); i++) {
			canonicalFen = canonicalFen + " -";
		}
	}
	return canonicalFen;
};

Chess.FEN.getCanonical = function (boardModel) {
	return Chess.FEN.canonical(Chess.FEN.get(boardModel));
};

Chess.PGN = {};

Chess.PGN.pgnmvre = /([BNRQK]?[a-h]?[1-8]?[x]?[a-h][1-8][=]?[bnrqBNRQ]?)|(O-O(-O)?)/g ;
Chess.PGN.sqre = /[a-h][1-8]/g ;
Chess.PGN.rankre = /[a-h]/ ;
Chess.PGN.filere = /[1-8]/ ;
Chess.PGN.piecere = /[NBRQK]/ ;
Chess.PGN.prmtre = /=[nbrqkNBRQK]/ ;
Chess.PGN.killre = /[x]/ ;
Chess.PGN.qcastlere = /O-O-O/ ;
Chess.PGN.kcastlere = /O-O/ ;

Chess.PGN.parse = function (pgn, fen) {
	var moveArray = [];
	var egn = new GarboChessEngine(fen);
	var wtm = egn.whiteToMove() ;
	fen = egn.getFen();
	var rootNode = new ChessNode();
	rootNode.fen = fen;
	rootNode.wtm = wtm;
	var rootLink = new Link(null, rootNode);
	var link = rootLink;
	var currentNode = rootNode;

	var m = pgn.match(Chess.PGN.pgnmvre);
	for (var i = 0; i < m.length; i++) {
		var p = Chess.PGN.parseMove(m[i], wtm); 
		var validMoves = egn.getValidMoves(fen);
		var move = Chess.PGN.selectMove(validMoves, p, fen);
		if (move != null) {
			// Copied from playMove
			var moveText = egn.getMoveText(move);
			egn.makeMove(move);
			var node = new ChessNode();
			node.fen = egn.getFen();
			node.wtm = egn.whiteToMove();
			var newLink = new Link(move, node);
			newLink.moveText = moveText;
			link = currentNode.addLink(newLink);
			currentNode = link.node;
			
			fen = node.fen;
			wtm = node.wtm;
			moveArray.push(p);
		}
	}
	//return moveArray;
	return rootLink;
}

Chess.PGN.selectMove = function (validMoves, p, fen) {
	var board = new Board(8, 8);
	Chess.FEN.load(board, fen);
	var candidateMoves = [];
	var toCell = Chess.Algebric.fromAlgebricToCell(p.to);
	for (var i = 0; i < validMoves.length; i++) {
		if (validMoves[i].to.equals(toCell)) {
			var piece = (board.boardModel[validMoves[i].from.r][validMoves[i].from.c]).toUpperCase();
			if (piece == p.piece) {
				candidateMoves.push(validMoves[i]);
			}
		}
	}
	//console.log(candidateMoves.length + " candidate moves found");
	if (candidateMoves.length == 1) {
		return candidateMoves[0];
	} else {
		var fromCell = Chess.Algebric.fromAlgebricToCell(p.from);
		for (var i = 0; i < candidateMoves.length; i++) {
			if ((fromCell.r == -1 || fromCell.r == candidateMoves[i].from.r) &&
			    (fromCell.c == -1 || fromCell.c == candidateMoves[i].from.c) &&
			    (p.promotion == "" || p.promotion.toUpperCase() == candidateMoves[i].promotion.toUpperCase())) {
				    return candidateMoves[i];
			    }
		}
	}
	return null;
}

Chess.Algebric = {};

Chess.Algebric.RANK = {"1" : 7, "2" : 6, "3" : 5, "4" : 4, "5" : 3, "6" : 2, "7" : 1, "8" : 0};
Chess.Algebric.FILE = {"a" : 0, "b" : 1, "c" : 2, "d" : 3, "e" : 4, "f" : 5, "g" : 6, "h" : 7};

Chess.Algebric.fromAlgebricToCell = function (algebric) {
	var cell = new Cell(-1, -1);
	var s = algebric.split("");
	for (var i = 0; i < s.length; i++) {
		if (Chess.Algebric.RANK[s[i]] != undefined) {
			cell.r = Chess.Algebric.RANK[s[i]] ;
		}
		if (Chess.Algebric.FILE[s[i]] != undefined) {
			cell.c = Chess.Algebric.FILE[s[i]] ;
		}
	}
	//console.log(algebric + " " + cell.toString());
	return cell;
}

Chess.PGN.parseMove = function (move, wtm) {
	var mstr = move;
	var from = "";
	var to = "";
	var piece = "";
	var promotion = "";
	var kill = false;
	var castle = "";
	var m = move.match(Chess.PGN.sqre) ;
	if (m == null) {
		var qc = move.match(Chess.PGN.qcastlere);
		if (qc != null) {
			castle = "q";
			piece = "K";
			if (wtm) {
				from = "e1";
				to = "c1";
			} else {
				from = "e8"
				to = "c8";
			}
		} else { 
			var kc = move.match(Chess.PGN.kcastlere);
			if (kc != null) {
				castle = "k";
				piece = "K";
				if (wtm) {
					from = "e1";
					to = "g1";
				} else {
					from = "e8";
					to = "g8";
				}
			}

		}
	}
	else if (m.length == 1) {
		to = m[0];
		move = move.replace(to, "");
		m = move.match(Chess.PGN.rankre);
		if (m != null) {
			from = m[0];
		} else {
			m = move.match(Chess.PGN.filere);	
			if (m != null) {
				from = m[0];
			}
		}
	} else if (m.length == 2) {
		from = m[0];
		to = m[1];
		move = move.replace(from, "");
		move = move.replace(to, "");
	} 
	var k = move.match(Chess.PGN.killre);
	if (k != null && k.length == 1) {
		kill = true;
	}
	p = move.match (Chess.PGN.prmtre);
	if (p != null && p.length == 1) {
		promotion = p[0].substr(1,1);
		piece = "P";
	} else {
		var p = move.match (Chess.PGN.piecere);
		if (p != null && p.length == 1) {
			piece = p[0];
		}
	}	
	if (piece == "") {
		piece = "P";
	}

	return {"from" : from, "to" : to, "piece" : piece, "promotion" : promotion, "kill" : kill, "castle" : castle, "str" : mstr };
}


ChessNode.prototype = new Node();

function ChessNode() {
	this.init();
}

ChessNode.prototype.addLink = function(link) {
	for (var i = 0; i < this.links.length; i++) {
		if (link.linkdata.equals(this.links[i].linkdata)) {
			return this.links[i];
		}
	}
	this.links.push(link);
	return link;
}

ChessNode.createLink = function(fen, move, moveText, wtm) {
	var node = new ChessNode();
	node.fen = fen;
	node.wtm = wtm;
	var link = new Link(move, node);
	link.moveText = moveText;
	return link;
}


