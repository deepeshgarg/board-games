function Board(rows, cols) {
	this.boardModel = new Array(rows);
	this.rows = rows;
	this.cols = cols;
	this.name = "default";
	this.viewHandlers = [];
	this.savedStates = [];
	this.currentStateIdx = -1;
	for (var row = 0; row < rows; row++) {
		this.boardModel[row] = new Array(cols);
		for (var col = 0; col < cols; col++) {
			this.boardModel[row][col] = "";
		}
	}
};

Board.prototype.getCell = function(row, col) {
	return this.boardModel[row][col];
};

Board.prototype.setCell = function(row, col, c) {
	this.boardModel[row][col] = c;
};

Board.prototype.c = function(row, col, val) {
	if (typeof val == "undefined") {
		return this.boardModel[row][col];
	} else {
		this.boardModel[row][col] = val;
	}
};

Board.prototype.saveState = function () {
	var state = {};
	state.boardModel = new Array(this.rows);
	for (row = 0; row < this.rows; row++) {
		state.boardModel[row] = new Array(this.cols);
		for (col = 0; col < this.cols; col++) {
			state.boardModel[row][col] = this.boardModel[row][col];
		}
	}
	this.saveChildState(state);
	this.currentStateIdx += 1;
	var removeNumElements = this.savedStates.length - this.currentStateIdx;
	this.savedStates.splice(this.currentStateIdx, removeNumElements, state);
	var i = 0;
}

Board.prototype.back = function () {
	if (this.currentStateIdx > 0) {
		this.currentStateIdx--;
		this.boardModel = $.extend(true, [], this.savedStates[this.currentStateIdx].boardModel);
		this.restoreState (this.savedStates[this.currentStateIdx]);
		this.notifyView (this);
	}
}

Board.prototype.next = function () {
	if (this.savedStates.length > this.currentStateIdx + 1 ) {
		this.currentStateIdx++;
		this.boardModel = $.extend(true, [], this.savedStates[this.currentStateIdx].boardModel);
		this.restoreState (this.savedStates[this.currentStateIdx]);
		this.notifyView (this);
	}
}

Board.prototype.restoreState = function (state) {
}

Board.prototype.saveChildState = function (state) {
}

function Cell(row, col) {
	this.r = row;
	this.c = col;
};

Cell.prototype.equals = function(cell) {
	return (this.r == cell.r && this.c == cell.c)? true: false; 
}

Cell.prototype.toString = function () {
	return '[' + this.r + ',' + this.c + ']';
};

Cell.fromString = function (str) {
	var elmnts = str.match("\d+");
	if (elmnts.length == 2) {
		return new Cell (parseInt(elmnts[0]), parseInt(elmnts[1]));
	} else {
		return null;
	}
};


