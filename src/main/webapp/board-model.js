function BoardModel(rows, cols) {
	this.rows = rows;
	this.cols = cols;
	this.name = "default";
	this.viewHandlers = [];
	this.modelChangeListeners = [];
	this.savedStates = [];
	this.currentStateIdx = -1;
	this.listenerUpdateAuto = true;
	this.board = BoardUtil.createGrid(this.rows, this.cols, "");
};

BoardModel.prototype.getCell = function(row, col) {
	return this.board[row][col];
};

BoardModel.prototype.setCell = function(row, col, data) {
	this.board[row][col] = data;
	this.modelChanged();
};

BoardModel.prototype.inBoard = function(r, c) {
	if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
		return true;
	}
	return false;
}

BoardModel.prototype.saveState = function () {
	var state = {};
	state.board = new Array(this.rows);
	for (row = 0; row < this.rows; row++) {
		state.board[row] = new Array(this.cols);
		for (col = 0; col < this.cols; col++) {
			state.board[row][col] = this.board[row][col];
		}
	}
	this.saveChildState(state);
	this.currentStateIdx += 1;
	var removeNumElements = this.savedStates.length - this.currentStateIdx;
	this.savedStates.splice(this.currentStateIdx, removeNumElements, state);
	var i = 0;
}

BoardModel.prototype.back = function () {
	if (this.currentStateIdx > 0) {
		this.currentStateIdx--;
		this.restoreState();
		this.modelChanged();
	}
}

BoardModel.prototype.next = function () {
	if (this.savedStates.length > this.currentStateIdx + 1 ) {
		this.currentStateIdx++;
		this.restoreState();
		this.modelChanged();
	}
}

BoardModel.prototype.restoreState = function () {
	this.board = $.extend(true, [], this.savedStates[this.currentStateIdx].board);
	this.restoreChildState (this.savedStates[this.currentStateIdx]);
}

BoardModel.prototype.clearSavedStates = function() {
	this.savedStates = [];
	this.currentStateIdx = -1;
}

BoardModel.prototype.saveChildState = function (state) {
}

BoardModel.prototype.restoreChildState = function (state) {
}

BoardModel.prototype.registerViewHandler = function (viewHandler) {
	this.viewHandlers.push(viewHandler);	
}

BoardModel.prototype.registerModelChangeListener = function (modelChangeListener) {
	this.modelChangeListeners.push(modelChangeListener);	
}

BoardModel.prototype.modelChanged = function () {
	if (this.listenerUpdateAuto) {
		this.notifyModelChangeListeners();
	}
}

BoardModel.prototype.notifyModelChangeListeners = function () {
	for (i = 0; i < this.modelChangeListeners.length; i++) {
		this.modelChangeListeners[i].handleModelChange(this);
	}
}

