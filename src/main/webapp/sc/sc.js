
SCModel.prototype = new BoardModel(4, 4);
SCModel.prototype.constructor = SCModel;

function SCModel() {
	BoardModel.call(this, 4, 4);
	this.name = 'Solitaire Chess';
	this.pieceFactory = new SCPieceFactory();
	this.listenerUpdateAuto = false;
};

SCModel.prototype.load = function (fen) {
	Chess.FEN.load (this, fen);
	this.clearSavedStates();
	this.saveState();
	this.notifyModelChangeListeners();
}

SCModel.prototype.move = function (cellFrom, cellTo) {
	this.setCell(cellTo.r, cellTo.c, this.getCell(cellFrom.r, cellFrom.c));
	this.setCell(cellFrom.r, cellFrom.c, "");
	this.saveState();
	this.notifyModelChangeListeners();
}

SCModel.prototype.getValidMoves = function (r, c) {
	var piece = this.pieceFactory.getPiece(this.getCell(r, c));
	if (piece != null) {
		return piece.validMoves(r, c, this);
	}
	return [];
}

SCView.prototype = new BoardView();
SCView.prototype.constructor = SCView;

function SCView(ctnr) {
	BoardView.call(this, ctnr);
	this.name = "Solitaire Chess View";
	this.validMoves = [];
	this.selectedCell = null;
};

SCView.prototype.createTable = function (boardModel) {
	BoardView.prototype.createTable.call(this, boardModel);
	BoardUtil.forEachCell(0, 0, BoardUtil.nextCellForward, function(r, c, view) {
				var cellClass = (r + c) % 2 == 0? 'light' : 'dark'; 
				view.addClass(r, c, cellClass);
			},
			this, boardModel.rows, boardModel.cols);
	boardModel.notifyModelChangeListeners();
}

SCView.prototype.handleModelChange = function (model) {
	BoardUtil.forEachCell(0, 0, BoardUtil.nextCellForward, function(r, c, d) {
				d.view.setImage(r, c, d.view.getImagePath(d.model.board[r][c]));
			},
			{"model":model, "view":this}, model.rows, model.cols);
};

SCView.prototype.getImagePath = function(c) {
	if (c == "p") {
		return 'sc/pawn-b.png';
	} else if (c == "n") {
		return 'sc/knight-b.png';
	} else if (c == "b") {
		return 'sc/bishop-b.png';
	} else if (c == "r") {
		return 'sc/rook-b.png';
	} else if (c == "q") {
		return 'sc/queen-b.png';
	} else if (c == "k") {
		return 'sc/king-b.png';
	} else if (c == "P") {
		return 'sc/pawn-w.png';
	} else if (c == "N") {
		return 'sc/knight-w.png';
	}  else if (c == "B") {
		return 'sc/bishop-w.png';
	} else if (c == "R") {
		return 'sc/rook-w.png';
	} else if (c == "Q") {
		return 'sc/queen-w.png';
	} else if (c == "K") {
		return 'sc/king-w.png';
	}
	return 'images/blank.gif';
}

SCView.prototype.onMouseDown = function (boardModel, row, col) {
	this.mouseAction(boardModel, row, col, true);
}

SCView.prototype.onMouseUp = function (boardModel, row, col) {
	this.mouseAction(boardModel, row, col, false);
}

SCView.prototype.mouseAction = function (boardModel, row, col, actionStart) {
	if (this.selectedCell != null) {
		this.removeClass(this.selectedCell.r, this.selectedCell.c, "selected");
	}
	for (var i = 0; i < this.validMoves.length; i++) {
		this.removeClass(this.validMoves[i].r, this.validMoves[i].c, "validmove");
	}
	if (this.selectedCell == null && actionStart) {
		if (boardModel.getCell(row, col) != "") {
			this.selectedCell = new Cell(row, col);
			this.addClass(row, col, "selected");
			this.validMoves = boardModel.getValidMoves(row, col);
		}	
	} else {
		if (boardModel.getCell(row, col) != "") {
			if (Cell.inCellList(new Cell(row, col), this.validMoves)) {
				boardModel.move(new Cell(this.selectedCell.r, this.selectedCell.c), new Cell(row, col));
				//boardModel.setCell(row, col, boardModel.getCell(this.selectedCell.r, this.selectedCell.c));
				//boardModel.setCell(this.selectedCell.r, this.selectedCell.c, "");
				//boardModel.saveState();
				this.selectedCell = null;
				this.validMoves = [];
			} else if (row == this.selectedCell.r && col == this.selectedCell.c) {
			} else {
				this.selectedCell = null;
				this.validMoves = [];
			}
		} else {
			this.selectedCell = null;
			this.validMoves = [];
		}
	}
	if (this.selectedCell != null) {
		this.addClass(this.selectedCell.r, this.selectedCell.c, "selected");
	}	
	for (var i = 0; i < this.validMoves.length; i++) {
		this.addClass(this.validMoves[i].r, this.validMoves[i].c, "validmove");
	}
	boardModel.notifyModelChangeListeners();
}