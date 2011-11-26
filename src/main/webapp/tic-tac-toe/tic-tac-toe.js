
TicTacToeModel.prototype = new Board(3, 3);
TicTacToeModel.prototype.constructor = TicTacToeModel;

function TicTacToeModel() {
	this.name = 'Tic Tac Toe';
	for (row = 0; row < this.rows; row++) {
		for (col = 0; col < this.cols; col++) {
			this.boardModel[row][col] = "e";
		}
	}
	this.player = "o";
};

TicTacToeModel.prototype.onClickImpl = function (row, col) {
	if (this.boardModel[row][col] == "e") {
		dbg ("empty", {on:false});
		this.boardModel[row][col] = this.player;
		this.changePlayer();
	} else if (this.boardModel[row][col] == "o") {
		dbg ("nots", {on:false});
	} else if (this.boardModel[row][col] == "x") {
		dbg ("cross", {on:false});
	} 
};

TicTacToeModel.prototype.changePlayer = function() {
	if (this.player == "o") {
		this.player = "x";
	} else {
		this.player = "o";
	}
}

TicTacToeView.prototype = new BoardView();
TicTacToeView.prototype.constructor = TicTacToeView;

function TicTacToeView(ctnr) {
	BoardView.call(this, ctnr);
	this.name = "tic tac toe view";
};

TicTacToeView.prototype.updateView = function (model) {
	dbg ('here', {on:false});
	dbg (this.name, {on:false});
	dbg (this.container, {on:false});
	/*
	this.container.find(".cell").each(function (i, elem) {
		$(elem).removeClass("ttt-empty ttt-cross ttt-nots");
		row = $(elem).attr('r'); 
		col = $(elem).attr('c'); 
		dbg(row + ' ' + col + ' ' + model.boardModel, {on:false});
		value = model.boardModel[row][col];
		if (value == "e") {
			$(elem).addClass("ttt-empty");
		} else if (value == "x") {
			$(elem).addClass("ttt-cross");
		} else if (value == "o") {
			$(elem).addClass("ttt-nots");
		}
	}
	);
	*/
	this.container.find(".cell").each(function (i, elem) {
		row = $(elem).attr('r'); 
		col = $(elem).attr('c'); 
		dbg(row + ' ' + col + ' ' + model.boardModel, {on:false});
		value = model.boardModel[row][col];
		if (value == "e") {
			$(elem).find('img').attr('src','images/blank.gif');
		} else if (value == "x") {
			$(elem).find('img').attr('src','tic-tac-toe/cross.gif');
		} else if (value == "o") {
			$(elem).find('img').attr('src','tic-tac-toe/nots.gif');
		}
	}
	);

};
