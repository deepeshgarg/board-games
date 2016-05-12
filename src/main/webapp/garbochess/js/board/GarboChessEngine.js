
GarboChessEngine.prototype = new ChessEngine();
GarboChessEngine.prototype.constructor = GarboChessEngine;

function GarboChessEngine(fen) {
	this.garboChess = new GarboChess();
	this.validMoves = [];
	this.initGame(fen);
	this.garboChess.g_timeout = 100;
	this.coIdMap = {};
};

GarboChessEngine.prototype.initGame = function (fen) {
	this.garboChess.ResetGame();
	if (typeof fen != "undefined") {
		this.initializeFromFen(fen);
	}
	this.findValidMoves();
};

GarboChessEngine.prototype.initializeFromFen = function (fen) {
	var cfen = Chess.FEN.canonical(fen);
	//console.log('cfen:' + cfen);
	this.garboChess.InitializeFromFen(cfen);
}

GarboChessEngine.prototype.getGarboChess = function (fen) {
	if (typeof fen != "undefined") {
		var garboChess = new GarboChess();
		garboChess.InitializeFromFen(fen);
		return garboChess;
	} else {
		return this.garboChess;
	}
};

GarboChessEngine.prototype.findValidMoves = function (fen) {
	if (typeof fen != "undefined") {
		var validMoves = [];
		var garboChess = new GarboChess();
		garboChess.ResetGame();
		garboChess.InitializeFromFen(fen);
		var moves = garboChess.GenerateValidMoves();
		for (var i = 0; i < moves.length; i++) {
			validMoves.push(this.gbToMove(moves[i]));
		}
		return validMoves;
	} else {
		var moves = this.garboChess.GenerateValidMoves();
		this.validMoves.length = 0;
		for (var i = 0; i < moves.length; i++) {
			this.validMoves.push(this.gbToMove(moves[i]));
		}
	}
}

GarboChessEngine.prototype.getValidMoves = function (fen) {
	if (typeof fen != "undefined") {
		return this.findValidMoves(fen);
	}
	return this.validMoves;
};

GarboChessEngine.prototype.isMoveValid = function (move, fen) {
	if (checkValidMove(move, fen) != null) {
		return true;
	}
	return false;
};

GarboChessEngine.prototype.checkValidMove = function (move, fen) {
	var validMoves = this.getValidMoves(fen);
	for (var i = 0; i < validMoves.length; i++) {
		if (validMoves[i].from.r == move.from.r && validMoves[i].from.c == move.from.c &&
		    validMoves[i].to.r == move.to.r && validMoves[i].to.c == move.to.c &&
		    validMoves[i].promotion == move.promotion) {
			    return validMoves[i];
		    }
	}
	return null;
};

GarboChessEngine.prototype.getMoveText = function (move, fen) {
	var validMove = this.checkValidMove(move, fen);
	var moveText = null;
	if (validMove != null) {
		var garboChess = this.getGarboChess(fen);
		moveText = garboChess.GetMoveSAN (this.moveToGb(validMove)); 
	}
	return moveText == null? "" : moveText;
};



GarboChessEngine.prototype.whiteToMove = function () {
	return !(this.garboChess.g_toMove == 0); 
};

GarboChessEngine.prototype.setStrength = function (strength) {
	var timeout ;
	switch (strength) {
		case 1: timeout = 100; break;
		case 2: timeout = 1000; break;
		default: timeout = 1000 * strength; break;
	}
	this.garboChess.g_timeout = timeout;
};

GarboChessEngine.prototype.makeMove = function (move, fen) {
	if (typeof fen != "undefined") {
		this.garboChess.InitializeFromFen(fen);
		this.findValidMoves();
	}
	var validMove = this.checkValidMove(move, fen);
	if (validMove != null) {
		this.garboChess.MakeMove(this.moveToGb(validMove));
		this.findValidMoves();
	}
	return this.getFen();
};

GarboChessEngine.prototype.getFen = function () {
	return Chess.FEN.canonical(this.garboChess.GetFen());
};

GarboChessEngine.prototype.analyzePosition = function (coId, fen, callback) {
	var thiz = this;
	this.initWorker();
	if (this.worker != null) {
		this.garboChess.InitializeFromFen(fen);
		var analyzeRequest = {};
		analyzeRequest.fen = fen;
		analyzeRequest.command = "analyze";
		analyzeRequest.coId = coId;
		analyzeRequest.timeout = this.garboChess.g_timeout;
		var rqst = JSON.stringify(analyzeRequest);
		this.coIdMap.coId = callback;
		this.worker.postMessage(rqst);
	} else {
		this.garboChess.InitializeFromFen(fen);
		this.garboChess.Search(function(bestMove, value, timeTaken, ply) { 
			var hint = this.garboChess.PVFromHash(bestMove, 15);
			var analysis = thiz.createAnalysis(bestMove, value, timeTaken, ply, hint);
			callback(coId, analysis);
		}, 20, null);
	}
};

GarboChessEngine.prototype.initWorker = function() {
	if (Modernizr.webworkers && typeof this.worker == "undefined") {
		var thiz = this;
		this.worker = new Worker('js/garbochess-webworker.js');
		this.worker.onmessage = function(event) {
			//console.log("Resposne received from worker " + event.data);
			var response = JSON.parse(event.data);
			switch (response.type) {
				case 'analyze' : 
					var coId = response.coId;
					var analysis = thiz.createAnalysis(
							response.bestMove, 
							response.value, 
							response.timeTaken, 
							response.ply,
							response.hint);

					thiz.coIdMap.coId(coId, analysis);
					break;
			}
		}
	}
}

GarboChessEngine.prototype.createAnalysis = function (bestMove, value, timeTaken, ply, hint) {
	var pa = new PositionAnalysis();
	pa.score = value / 200;
	pa.hint = hint;
	pa.suggestedMove = this.gbToMove(bestMove);
	return pa;
};

GarboChessEngine.prototype.gbToMove = function (gbMove) {
	var move = new Move();
	var from = gbMove & 0xFF;
	var to = (gbMove >> 8) & 0xFF;
	move.from = this.gbToCell(from);
	move.to = this.gbToCell(to);

	var flags = gbMove & 0xFF0000;
	if (flags & this.garboChess.moveflagPromotion) {
		if (gbMove& this.garboChess.moveflagPromoteBishop) move.promotion="b";
		else if (gbMove & this.garboChess.moveflagPromoteKnight) move.promotion="n";
		else if (gbMove & this.garboChess.moveflagPromoteQueen) move.promotion="q";
		else move.promotion="r";
	}
        if (flags & this.garboChess.moveflagEPC) {
		move.epc = true;
	}
        if (flags & this.garboChess.moveflagCastleKing) {
		move.castle = "k";
	}
        if (flags & this.garboChess.moveflagCastleQueen) {
		move.castle = "q";
	}
	return move;
};

GarboChessEngine.prototype.moveToGb = function (move) {
	var gbMove = 0;
	gbMove |= this.cellToGb(move.from);
	gbMove |= (this.cellToGb(move.to) << 8);
	var flags = 0;
	switch (move.promotion) {
		case "r" : flags |= this.garboChess.moveflagPromotion; break;
		case "n" : flags |= this.garboChess.moveflagPromoteKnight; break;
		case "b" : flags |= this.garboChess.moveflagPromoteBishop; break;
		case "q" : flags |= (this.garboChess.moveflagPromotion | this.garboChess.moveflagPromoteQueen); break;
	}
	if (move.epc) {
		flags |= this.garboChess.moveflagEPC;
	}
	switch (move.castle) {
		case "k" : flags |= this.garboChess.moveflagCastleKing; break;
		case "q" : flags |= this.garboChess.moveflagCastleQueen; break;
	}
	gbMove |= flags;
	//console.log(gbMove);
	return gbMove;
};

GarboChessEngine.prototype.gbToCell = function (gbSquare) {
	return new Cell((gbSquare >> 4) - 2 , (0x0F & gbSquare) - 4 );
};

GarboChessEngine.prototype.cellToGb = function (cell) {
	return 0xFF & (((cell.r + 2) << 4) | (cell.c + 4));
};

