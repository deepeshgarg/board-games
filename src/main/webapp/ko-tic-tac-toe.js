
KOTicTacToeModel.prototype = new BoardModel(3, 3);
KOTicTacToeModel.prototype.constructor = KOTicTacToeModel;

function KOTicTacToeModel() {
	this.eventHandlers.click = this.click.bind(this);
	this.cellTemplate = "cell-img";
	this.nextMove = "x";
}

KOTicTacToeModel.prototype.click = function(data) {
	this.b()[data.r]()[data.c](this.nextMove);
	this.nextMove = this.nextMove == "x"? "o" : "x";
}

KOTicTacToeModel.prototype.getCellImage = function(r, c) {
	if (this.b()[r]()[c]() == "x") {
		return 'tic-tac-toe/cross.gif';
	} else if (this.b()[r]()[c]() == "o") {
		return 'tic-tac-toe/nots.gif';
	} else {
		return 'images/blank.gif';
	}
}

